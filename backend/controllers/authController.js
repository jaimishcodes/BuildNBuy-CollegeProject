const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { accountModels, findAccountsByEmail, moveLegacyAccount } = require('../utils/accountModels');
const ContractorProfile = require('../models/ContractorProfile');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { sendTokenResponse, cookieOptions } = require('../utils/generateToken');

// @desc    Register a new account
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, city, adminRegistrationKey } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, 'Name, email, phone and password are required');
  }

  if (!/(?=.*[A-Za-z])(?=.*\d).{6,}/.test(password)) {
    throw new ApiError(400, 'Password must be at least 6 characters with a letter and a number');
  }

  const normalizedPhone = String(phone).replace(/\D/g, '');
  if (!/^\d{10}$/.test(normalizedPhone)) {
    throw new ApiError(400, 'Phone must be a valid 10-digit mobile number');
  }

  const allowedRoles = ['customer', 'contractor', 'admin'];
  const finalRole = role || 'customer';
  if (!allowedRoles.includes(finalRole)) {
    throw new ApiError(400, 'Role must be customer, contractor, or admin');
  }
  if (finalRole === 'admin' && (!process.env.ADMIN_REGISTRATION_KEY || adminRegistrationKey !== process.env.ADMIN_REGISTRATION_KEY)) {
    throw new ApiError(403, 'Admin registration is not authorized');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findAccountsByEmail(normalizedEmail);
  if (existing.length) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await accountModels[finalRole].create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    phone: normalizedPhone,
    role: finalRole,
  });

  if (finalRole === 'contractor') {
    try {
      await ContractorProfile.create({
        user: user._id,
        location: { city: city?.trim() || 'Not specified' },
      });
    } catch (error) {
      await user.deleteOne();
      throw error;
    }
  }

  sendTokenResponse(user, 201, res, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const matchingAccounts = await findAccountsByEmail(email.trim().toLowerCase(), true);
  if (matchingAccounts.length > 1) {
    throw new ApiError(409, 'Multiple accounts use this email. Contact support.');
  }
  let user = matchingAccounts[0];
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user = await moveLegacyAccount(user);
  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been blocked. Contact support.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Logout user - clears cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { ...cookieOptions(), expires: new Date(Date.now() + 10 * 1000) });
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await accountModels[req.user.role].findById(req.user._id);
  res.status(200).json(new ApiResponse(200, user, 'Current user fetched'));
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }

  const user = await accountModels[req.user.role].findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Forgot password - generates reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const matchingAccounts = await findAccountsByEmail((email || '').trim().toLowerCase(), true);

  // Always respond the same way to avoid leaking which emails are registered
  const genericMessage = 'If that email is registered, a reset link has been sent';

  if (!matchingAccounts.length) {
    return res.status(200).json(new ApiResponse(200, null, genericMessage));
  }
  if (matchingAccounts.length > 1) throw new ApiError(409, 'Multiple accounts use this email. Contact support.');
  const user = await moveLegacyAccount(matchingAccounts[0]);

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // In production this would be emailed. For now we return it so the frontend/demo can use it.
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  res.status(200).json(
    new ApiResponse(200, process.env.NODE_ENV === 'development' ? { resetUrl, resetToken } : null, genericMessage)
  );
});

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const matches = await Promise.all(Object.values(accountModels).map((Model) => Model.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  })));
  const user = matches.find(Boolean);

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  if (!req.body.password) {
    throw new ApiError(400, 'New password is required');
  }

  if (!/(?=.*[A-Za-z])(?=.*\d).{6,}/.test(req.body.password)) {
    throw new ApiError(400, 'Password must be at least 6 characters with a letter and a number');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
};
