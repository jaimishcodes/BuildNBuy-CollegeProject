const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const cookieOptions = () => {
  const days = Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  };
};

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id, user.role);

  res.status(statusCode).cookie('token', token, cookieOptions()).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    },
  });
};

module.exports = { generateToken, sendTokenResponse, cookieOptions };
