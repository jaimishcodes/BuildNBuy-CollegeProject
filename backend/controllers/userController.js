const asyncHandler = require('express-async-handler');
const { accountModels, findAccountById } = require('../utils/accountModels');
const ContractorProfile = require('../models/ContractorProfile');
const Property = require('../models/Property');
const ConstructionRequirement = require('../models/ConstructionRequirement');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Update own profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await accountModels[req.user.role].findById(req.user._id);
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;

  if (req.file) {
    user.avatar = { url: req.file.path, publicId: req.file.filename };
  }

  await user.save();
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});

// @desc    Get all users (search + pagination)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20, status } = req.query;
  const filter = {};

  if (status === 'blocked') filter.isBlocked = true;
  if (status === 'active') filter.isBlocked = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const models = role && accountModels[role] ? [accountModels[role]] : Object.values(accountModels);
  const groupedUsers = await Promise.all(models.map((Model) => Model.find(filter).sort({ createdAt: -1 })));
  const allUsers = groupedUsers.flat().sort((first, second) => second.createdAt - first.createdAt);
  const skip = (Number(page) - 1) * Number(limit);
  const users = allUsers.slice(skip, skip + Number(limit));
  const total = allUsers.length;

  res.status(200).json(
    new ApiResponse(200, users, 'Users fetched', {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  );
});

// @desc    Get single user detail
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await findAccountById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, user, 'User fetched'));
});

// @desc    Block or unblock a user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = asyncHandler(async (req, res) => {
  const { blockReason } = req.body;
  const user = await findAccountById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot block an admin account');

  user.isBlocked = !user.isBlocked;
  user.blockReason = user.isBlocked ? blockReason || 'Violation of platform policy' : '';
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`));
});

// @desc    delete a user
// @route   PUT /api/users/:id/delete 
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await findAccountById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Admin accounts cannot be deleted here');

  await Promise.all([
    Property.deleteMany({ listedBy: user._id }),
    ConstructionRequirement.deleteMany({ $or: [{ customer: user._id }, { contractor: user._id }] }),
    ContractorProfile.deleteOne({ user: user._id }),
  ]);
  await user.deleteOne();

  res.status(200).json(new ApiResponse(200, null, 'User and related data deleted'));
});

module.exports = { updateProfile, getUsers, getUserById, toggleBlockUser, deleteUser };
