const asyncHandler = require('express-async-handler');
const ConstructionRequirement = require('../models/ConstructionRequirement');
const ContractorProfile = require('../models/ContractorProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Submit a construction requirement (optionally targeted at one contractor)
// @route   POST /api/construction-requirements
// @access  Private/customer
const createRequirement = asyncHandler(async (req, res) => {
  const body = req.body;
  const preferredStartDate = body.preferredStartDate || undefined;

  if (preferredStartDate !== undefined) {
    if (typeof preferredStartDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(preferredStartDate)) {
      throw new ApiError(400, 'Preferred start date must be a valid date.');
    }
    const parsedDate = new Date(`${preferredStartDate}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== preferredStartDate) {
      throw new ApiError(400, 'Preferred start date must be a valid date.');
    }
    if (preferredStartDate < new Date().toISOString().slice(0, 10)) {
      throw new ApiError(400, 'Preferred start date cannot be in the past.');
    }
  }

  const requirement = await ConstructionRequirement.create({
    customer: req.user._id,
    contractor: body.contractor || null,
    title: body.title,
    location: body.location,
    plotArea: { value: body.plotArea, unit: body.plotAreaUnit || 'sqft' },
    houseType: body.houseType,
    floors: body.floors,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    approxBudget: body.approxBudget,
    preferredStartDate,
    description: body.description,
    additionalRequirements: body.additionalRequirements,
  });

  if (body.contractor) {
    await ContractorProfile.findOneAndUpdate({ user: body.contractor }, { $inc: { inquiryCount: 1 } });
  }

  res.status(201).json(new ApiResponse(201, requirement, 'Construction requirement submitted'));
});

// @desc    Get requirements submitted by the logged-in customer
// @route   GET /api/construction-requirements/mine
// @access  Private/customer
const getMyRequirements = asyncHandler(async (req, res) => {
  const requirements = await ConstructionRequirement.find({ customer: req.user._id })
    .populate('contractor', 'name avatar phone email')
    .populate('messages.sender', 'name role avatar')
    .sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, requirements, 'Your construction requirements fetched'));
});

// @desc    Get requirements received by the logged-in contractor (targeted + open ones in their city)
// @route   GET /api/construction-requirements/received
// @access  Private/contractor
const getReceivedRequirements = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { contractor: req.user._id };
  if (status) filter.status = status;

  const requirements = await ConstructionRequirement.find(filter)
    .populate('customer', 'name avatar phone email')
    .populate('messages.sender', 'name role avatar')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, requirements, 'Received requirements fetched'));
});

// @desc    Update requirement status (contractor responds / accepts)
// @route   PUT /api/construction-requirements/:id/status
// @access  Private/contractor
const updateRequirementStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Accepted', 'Rejected'];
  if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status value');

  const requirement = await ConstructionRequirement.findById(req.params.id);
  if (!requirement) throw new ApiError(404, 'Requirement not found');

  if (String(requirement.contractor) !== String(req.user._id)) {
    throw new ApiError(403, 'Not authorized to update this requirement');
  }
  if (!['Open', 'Responded', 'In Discussion'].includes(requirement.status)) {
    throw new ApiError(409, 'This requirement has already been handled');
  }

  requirement.status = status;
  await requirement.save();

  res.status(200).json(new ApiResponse(200, requirement, 'Requirement status updated'));
});

const sendRequirementMessage = asyncHandler(async (req, res) => {
  const text = String(req.body.text || '').trim();
  if (!text) throw new ApiError(400, 'Message cannot be empty');
  if (text.length > 2000) throw new ApiError(400, 'Message cannot exceed 2000 characters');

  const requirement = await ConstructionRequirement.findById(req.params.id);
  if (!requirement) throw new ApiError(404, 'Requirement not found');

  const isCustomer = req.user.role === 'customer' && String(requirement.customer) === String(req.user._id);
  const isContractor = req.user.role === 'contractor' && String(requirement.contractor) === String(req.user._id);
  if (!isCustomer && !isContractor) throw new ApiError(403, 'You are not authorized to message on this requirement');

  requirement.messages.push({
    sender: req.user._id,
    senderRole: req.user.role,
    senderModel: req.user.role === 'contractor' ? 'ContractorUser' : 'User',
    text,
  });
  await requirement.save();
  await requirement.populate('messages.sender', 'name role avatar');

  res.status(201).json(new ApiResponse(201, requirement.messages[requirement.messages.length - 1], 'Message sent'));
});

module.exports = {
  createRequirement,
  getMyRequirements,
  getReceivedRequirements,
  updateRequirementStatus,
  sendRequirementMessage,
};
