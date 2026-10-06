const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const { findAccountById } = require('../utils/accountModels');

// Verifies JWT (from Authorization header or cookie) and attaches req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findAccountById(decoded.id, decoded.role);

    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists');
    }
    if (user.isBlocked) {
      throw new ApiError(403, 'Your account has been blocked. Contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, 'Not authorized, token invalid or expired');
  }
});

// Restricts access to specific roles. Usage: authorize('admin', 'contractor')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const message = roles.length === 1
        ? `This action is only available to ${roles[0]} accounts.`
        : 'You do not have permission to perform this action.';
      throw new ApiError(403, message);
    }
    next();
  };
};

// Attaches req.user if a valid token is present, but does not fail if absent.
// Useful for public routes that behave slightly differently for logged-in users.
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findAccountById(decoded.id, decoded.role);
    if (user && !user.isBlocked) req.user = user;
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
});

module.exports = { protect, authorize, optionalAuth };
