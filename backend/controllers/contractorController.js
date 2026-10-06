const asyncHandler = require('express-async-handler');
const ContractorProfile = require('../models/ContractorProfile');
const ContractorUser = require('../models/ContractorUser');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get / create-if-missing own contractor profile
// @route   GET /api/contractors/me
// @access  Private/contractor
const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await ContractorProfile.findOne({ user: req.user._id }).populate(
    'user',
    'name email phone avatar isBlocked'
  );

  if (!profile) {
    profile = await ContractorProfile.create({ user: req.user._id, location: { city: '' } });
    profile = await profile.populate('user', 'name email phone avatar isBlocked');
  }

  res.status(200).json(new ApiResponse(200, profile, 'Contractor profile fetched'));
});

// @desc    Update own contractor profile
// @route   PUT /api/contractors/me
// @access  Private/contractor
const updateMyProfile = asyncHandler(async (req, res) => {
  const body = req.body;
  const profile = await ContractorProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Contractor profile not found');

  const user = await ContractorUser.findById(req.user._id);
  if (body.name) user.name = body.name.trim();
  if (body.phone !== undefined) user.phone = body.phone.trim();
  const avatar = req.files?.find((file) => file.fieldname === 'avatar');
  const coverImage = req.files?.find((file) => file.fieldname === 'coverImage');
  if (avatar) user.avatar = { url: avatar.path, publicId: avatar.filename };
  else if (body.avatarUrl) {
    const galleryImage = profile.gallery.find((image) => image.url === body.avatarUrl);
    if (galleryImage) user.avatar = { url: galleryImage.url, publicId: galleryImage.publicId };
  }
  if (coverImage) profile.coverImage = { url: coverImage.path, publicId: coverImage.filename };

  const fields = ['companyName', 'about', 'experienceYears', 'teamSize', 'availability', 'minBudget', 'maxBudget', 'completedProjectsCount'];
  fields.forEach((field) => {
    if (body[field] !== undefined) profile[field] = body[field];
  });
  if (body.city || body.state || body.address) {
    profile.location = {
      city: body.city || profile.location.city,
      state: body.state || profile.location.state,
      address: body.address || profile.location.address,
    };
  }

  if (body.specializations !== undefined) {
    profile.specializations = Array.isArray(body.specializations)
      ? body.specializations
      : body.specializations.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (body.servicesOffered !== undefined) {
    profile.servicesOffered = Array.isArray(body.servicesOffered)
      ? body.servicesOffered
      : body.servicesOffered.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (body.galleryImages !== undefined) {
    let retainedImageUrls;
    try {
      retainedImageUrls = JSON.parse(body.galleryImages);
    } catch (error) {
      throw new ApiError(400, 'Existing gallery images data is invalid');
    }
    if (!Array.isArray(retainedImageUrls)) throw new ApiError(400, 'Existing gallery images data is invalid');
    const retainedUrls = new Set(retainedImageUrls);
    profile.gallery = profile.gallery.filter((image) => retainedUrls.has(image.url));
  }

  const newImages = (req.files || [])
    .filter((file) => file.fieldname === 'gallery')
    .map((file) => ({ url: file.path, publicId: file.filename }));
  if (newImages.length) {
    profile.gallery = [...profile.gallery, ...newImages];
  }

  if (body.previousProjects) {
    let projects;
    try {
      projects = JSON.parse(body.previousProjects);
    } catch (error) {
      throw new ApiError(400, 'Previous projects data is invalid');
    }
    profile.previousProjects = projects.map((project, index) => ({
      ...project,
      images: [
        ...(project.images || []),
        ...(req.files || [])
          .filter((file) => file.fieldname === `projectImages_${index}`)
          .map((file) => ({ url: file.path, publicId: file.filename })),
      ],
    }));
  }

  await user.save();
  await profile.save();
  await profile.populate('user', 'name email phone avatar isBlocked');
  res.status(200).json(new ApiResponse(200, profile, 'Contractor profile updated'));
});

// @desc    Public search/list of verified contractors
const getContractors = asyncHandler(async (req, res) => {
  const { city, specialization, minExperience, sortBy, search, page = 1, limit = 12 } = req.query;

  const filter = { verificationStatus: 'verified' };
  const contractorUserIds = await ContractorUser.find({ isBlocked: false }).distinct('_id');
  filter.user = { $in: contractorUserIds };
  if (city) filter['location.city'] = { $regex: `^${city}$`, $options: 'i' };
  if (specialization) filter.specializations = { $in: [specialization] };
  if (minExperience) filter.experienceYears = { $gte: Number(minExperience) };

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matchingUserIds = await ContractorUser.find({
      isBlocked: false,
      name: { $regex: escapedSearch, $options: 'i' },
    }).distinct('_id');
    filter.$or = [
      { companyName: { $regex: escapedSearch, $options: 'i' } },
      { user: { $in: matchingUserIds } },
    ];
  }

  const sortMap = {
    experience: { experienceYears: -1 },
    newest: { createdAt: -1 },
  };
  const sort = sortMap[sortBy] || sortMap.newest;

  const skip = (Number(page) - 1) * Number(limit);
  const [contractors, total] = await Promise.all([
    ContractorProfile.find(filter).populate('user', 'name avatar').sort(sort).skip(skip).limit(Number(limit)),
    ContractorProfile.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, contractors, 'Contractors fetched', {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// @desc    Get single contractor public profile with projects, services, reviews
// @route   GET /api/contractors/:id
// @access  Public
const getContractorById = asyncHandler(async (req, res) => {
  const profile = await ContractorProfile.findOne({ user: req.params.id }).populate(
    'user',
    'name avatar phone email'
  );
  if (!profile || !profile.user) throw new ApiError(404, 'Contractor not found');

  if (!req.user || String(req.user._id) !== String(req.params.id)) {
    profile.profileViews += 1;
    await profile.save({ validateBeforeSave: false });
  }

  const projects = profile.previousProjects?.length
    ? profile.previousProjects
    : (profile.gallery || []).map((image, index) => ({
      _id: `${profile._id}-project-${index}`,
      name: `Previous Project ${index + 1}`,
      images: [image],
      location: profile.location?.city,
    }));
  const services = (profile.servicesOffered || []).map((title, index) => ({
    _id: `${profile._id}-service-${index}`,
    title,
    description: 'Professional construction service',
  }));
  res.status(200).json(
    new ApiResponse(200, { profile, projects, services }, 'Contractor profile fetched')
  );
});

// @route   GET /api/contractors/admin/all
// @access  Private/Admin
const adminGetContractors = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status === 'block') {
    const contractorIds = await ContractorUser.find().distinct('_id');
    filter.user = { $in: contractorIds };
  } else if (status) {
    filter.verificationStatus = status;
    const blockedContractorIds = await ContractorUser.find({ isBlocked: true }).distinct('_id');
    filter.user = { $nin: blockedContractorIds };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [contractors, total] = await Promise.all([
    ContractorProfile.find(filter)
      .populate('user', 'name email phone isBlocked createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ContractorProfile.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, contractors, 'Contractors fetched', {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// @desc    Admin: update contractor verification status
// @route   PUT /api/contractors/:id/verify
// @access  Private/Admin
const verifyContractor = asyncHandler(async (req, res) => {
  const { action, rejectionReason } = req.body; // 'verify' | 'reject' | 'unverify'
  const profile = await ContractorProfile.findOne({ user: req.params.id });
  if (!profile) throw new ApiError(404, 'Contractor profile not found');

  if (action === 'verify') {
    profile.verificationStatus = 'verified';
    profile.rejectionReason = '';
    await ContractorUser.findByIdAndUpdate(req.params.id, { isVerified: true, verificationStatus: 'verified' });
  } else if (action === 'unverify') {
    profile.verificationStatus = 'pending';
    profile.rejectionReason = '';
    await ContractorUser.findByIdAndUpdate(req.params.id, { isVerified: false, verificationStatus: 'pending' });
  } else if (action === 'reject') {
    profile.verificationStatus = 'rejected';
    profile.rejectionReason = rejectionReason || 'Profile did not meet verification requirements';
    await ContractorUser.findByIdAndUpdate(req.params.id, { isVerified: false, verificationStatus: 'rejected' });
  } else {
    throw new ApiError(400, "Action must be 'verify', 'unverify', or 'reject'");
  }

  await profile.save();

  const message = action === 'verify'
    ? 'Contractor verified'
    : action === 'unverify' ? 'Contractor returned to pending verification' : 'Contractor rejected';
  res.status(200).json(new ApiResponse(200, profile, message));
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getContractors,
  getContractorById,
  adminGetContractors,
  verifyContractor,
};
