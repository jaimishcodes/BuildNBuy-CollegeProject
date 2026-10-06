const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');
const PropertyInquiry = require('../models/PropertyInquiry');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Create a property (customer self-listing or contractor listing)
// @route   POST /api/properties
// @access  Private/customer,contractor
const createProperty = asyncHandler(async (req, res) => {
  const body = req.body;

  const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

  const property = await Property.create({
    ...body,
    amenities: Array.isArray(body.amenities) ? body.amenities : body.amenities ? [body.amenities] : [],
    location: {
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      lat: body.lat,
      lng: body.lng,
    },
    area: { value: body.area, unit: body.areaUnit || 'sqft' },
    images,
    listedBy: req.user._id,
    listedByRole: req.user.role === 'contractor' ? 'contractor' : 'customer',
    listedByModel: req.user.role === 'contractor' ? 'ContractorUser' : 'User',
    status: 'Pending',
  });

  res.status(201).json(new ApiResponse(201, property, 'Property submitted for admin approval'));
});

// @desc    Get public list of properties with filters, search, sort, pagination
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const {
    search,
    city,
    listingType,
    propertyType,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    furnishing,
    amenities,
    sortBy,
    page = 1,
    limit = 12,
    status,
  } = req.query;

  const filter = {};

  // Public users only ever see Approved properties. Admin can pass status explicitly.
  filter.status = status && req.user && req.user.role === 'admin' ? status : 'Approved';

  if (city) filter['location.city'] = { $regex: `^${city}$`, $options: 'i' };
  if (listingType) filter.listingType = listingType;
  if (propertyType) filter.propertyType = propertyType;
  if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
  if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
  if (furnishing) filter.furnishing = furnishing;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minArea || maxArea) {
    filter['area.value'] = {};
    if (minArea) filter['area.value'].$gte = Number(minArea);
    if (maxArea) filter['area.value'].$lte = Number(maxArea);
  }
  if (amenities) {
    const list = Array.isArray(amenities) ? amenities : amenities.split(',');
    filter.amenities = { $all: list };
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_low: { price: 1 },
    price_high: { price: -1 },
    popular: { views: -1 },
  };
  const sort = sortMap[sortBy] || sortMap.newest;

  const skip = (Number(page) - 1) * Number(limit);

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('listedBy', 'name role avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, properties, 'Properties fetched', {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// @desc    Get single property by id or slug + related properties
// @route   GET /api/properties/:idOrSlug
// @access  Public
const getPropertyByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

  const property = await Property.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate(
    'listedBy',
    'name role avatar phone email'
  );

  if (!property) throw new ApiError(404, 'Property not found');

  // Only bump views for public viewers, not the owner browsing their own listing
  if (!req.user || String(req.user._id) !== String(property.listedBy._id)) {
    property.views += 1;
    await property.save({ validateBeforeSave: false });
  }

  const related = await Property.find({
    _id: { $ne: property._id },
    status: 'Approved',
    propertyType: property.propertyType,
    'location.city': property.location.city,
  })
    .limit(4)
    .select('title slug price images location bedrooms bathrooms area listingType');

  res.status(200).json(new ApiResponse(200, { property, related }, 'Property fetched'));
});

// @desc    Get properties listed by the logged-in user
// @route   GET /api/properties/mine
// @access  Private
const getMyProperties = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { listedBy: req.user._id };
  if (status) filter.status = status;

  const properties = await Property.find(filter)
    .populate('listedBy', 'name role avatar')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, properties, 'Your properties fetched'));
});

const createPropertyInquiry = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property || property.status !== 'Approved') {
    throw new ApiError(404, 'Approved property not found');
  }
  if (String(property.listedBy) === String(req.user._id)) {
    throw new ApiError(400, 'You cannot send an inquiry for your own property');
  }

  const message = String(req.body.message || '').trim();
  if (!message) throw new ApiError(400, 'Please add a message with your inquiry');
  if (message.length > 2000) throw new ApiError(400, 'Message cannot exceed 2000 characters');

  let preferredVisitDate;
  if (req.body.preferredVisitDate) {
    const dateValue = req.body.preferredVisitDate;
    if (typeof dateValue !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      throw new ApiError(400, 'Preferred visit date must be a valid date');
    }
    preferredVisitDate = new Date(`${dateValue}T00:00:00.000Z`);
    if (Number.isNaN(preferredVisitDate.getTime()) || preferredVisitDate.toISOString().slice(0, 10) !== dateValue) {
      throw new ApiError(400, 'Preferred visit date must be a valid date');
    }
    if (dateValue < new Date().toISOString().slice(0, 10)) {
      throw new ApiError(400, 'Preferred visit date cannot be in the past');
    }
  }

  const existingInquiry = await PropertyInquiry.findOne({
    property: property._id,
    requester: req.user._id,
    status: 'Pending',
  });
  if (existingInquiry) throw new ApiError(409, 'You already have a pending inquiry for this property');

  const inquiry = await PropertyInquiry.create({
    property: property._id,
    requester: req.user._id,
    requesterModel: req.user.role === 'contractor' ? 'ContractorUser' : 'User',
    owner: property.listedBy,
    ownerModel: property.listedByModel,
    preferredVisitDate,
    message,
  });

  res.status(201).json(new ApiResponse(201, inquiry, 'Property inquiry sent'));
});

const getReceivedPropertyInquiries = asyncHandler(async (req, res) => {
  const ownerModel = req.user.role === 'contractor' ? 'ContractorUser' : 'User';
  const inquiries = await PropertyInquiry.find({ owner: req.user._id, ownerModel })
    .populate('property', 'title slug location.city price listingType images')
    .populate('requester', 'name email phone role avatar')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, inquiries, 'Property inquiries fetched'));
});

const updatePropertyInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Accepted', 'Declined'].includes(status)) {
    throw new ApiError(400, 'Status must be Accepted or Declined');
  }

  const ownerModel = req.user.role === 'contractor' ? 'ContractorUser' : 'User';
  const inquiry = await PropertyInquiry.findOne({
    _id: req.params.inquiryId,
    owner: req.user._id,
    ownerModel,
  });
  if (!inquiry) throw new ApiError(404, 'Property inquiry not found');
  if (inquiry.status !== 'Pending') throw new ApiError(409, 'This inquiry has already been handled');

  inquiry.status = status;
  await inquiry.save();
  res.status(200).json(new ApiResponse(200, inquiry, `Property inquiry ${status.toLowerCase()}`));
});

// @desc    Update own property (resets to Pending if content changes after rejection)
// @route   PUT /api/properties/:id
// @access  Private (owner only)
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, 'Property not found');

  if (String(property.listedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to edit this property');
  }

  const body = req.body;
  const updatable = [
    'title',
    'description',
    'propertyType',
    'listingType',
    'price',
    'priceUnit',
    'bedrooms',
    'bathrooms',
    'parking',
    'furnishing',
  ];
  updatable.forEach((field) => {
    if (body[field] !== undefined) property[field] = body[field];
  });

  if (body.area) property.area = { value: body.area, unit: body.areaUnit || property.area.unit };
  if (body.amenities) {
    property.amenities = Array.isArray(body.amenities) ? body.amenities : [body.amenities];
  }
  if (body.address || body.city || body.state || body.pincode) {
    property.location = {
      address: body.address || property.location.address,
      city: body.city || property.location.city,
      state: body.state || property.location.state,
      pincode: body.pincode || property.location.pincode,
      lat: body.lat || property.location.lat,
      lng: body.lng || property.location.lng,
    };
  }

  if (body.existingImages !== undefined) {
    let retainedImageUrls;
    try {
      retainedImageUrls = JSON.parse(body.existingImages);
    } catch (error) {
      throw new ApiError(400, 'Existing property images data is invalid');
    }
    if (!Array.isArray(retainedImageUrls)) throw new ApiError(400, 'Existing property images data is invalid');
    const retainedUrls = new Set(retainedImageUrls);
    property.images = property.images.filter((image) => retainedUrls.has(image.url));
  }

  if (req.files && req.files.length) {
    const newImages = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    property.images = [...property.images, ...newImages];
  }

  // Any substantive edit by a non-admin sends it back through moderation
  if (req.user.role !== 'admin') {
    property.status = 'Pending';
    property.rejectionReason = '';
  }

  await property.save();
  res.status(200).json(new ApiResponse(200, property, 'Property updated'));
});

// @desc    Delete own property
// @route   DELETE /api/properties/:id
// @access  Private (owner or admin)
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, 'Property not found');

  if (String(property.listedBy) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'You are not authorized to delete this property');
  }

  await property.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Property deleted'));
});

// @desc    Admin: get properties by status (moderation queue)
// @route   GET /api/properties/admin/all
// @access  Private/Admin
const adminGetProperties = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('listedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, properties, 'Properties fetched', {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// @desc    Admin: approve or reject a property
// @route   PUT /api/properties/:id/moderate
// @access  Private/Admin
const moderateProperty = asyncHandler(async (req, res) => {
  const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'
  const property = await Property.findById(req.params.id);
  if (!property) throw new ApiError(404, 'Property not found');

  if (action === 'approve') {
    property.status = 'Approved';
    property.rejectionReason = '';
  } else if (action === 'reject') {
    property.status = 'Rejected';
    property.rejectionReason = rejectionReason || 'Did not meet platform guidelines';
  } else {
    throw new ApiError(400, "Action must be 'approve' or 'reject'");
  }

  await property.save();

  res.status(200).json(new ApiResponse(200, property, `Property ${action}d successfully`));
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyByIdOrSlug,
  getMyProperties,
  createPropertyInquiry,
  getReceivedPropertyInquiries,
  updatePropertyInquiryStatus,
  updateProperty,
  deleteProperty,
  adminGetProperties,
  moderateProperty,
};
