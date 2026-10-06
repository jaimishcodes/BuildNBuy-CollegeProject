const asyncHandler = require('express-async-handler');
const validator = require('validator');
const ContactMessage = require('../models/ContactMessage');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const createContactMessage = asyncHandler(async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (!name || !email || !message) {
    throw new ApiError(400, 'Please provide your name, email, and message.');
  }
  if (name.length > 120 || email.length > 254 || message.length > 5000) {
    throw new ApiError(400, 'One or more fields exceed the allowed length.');
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }

  const contactMessage = await ContactMessage.create({ name, email, message });
  res.status(201).json(new ApiResponse(201, contactMessage, 'Message sent successfully'));
});

const getContactMessages = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 15));
  const [messages, total] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ContactMessage.countDocuments(),
  ]);

  res.status(200).json(new ApiResponse(200, messages, 'Contact messages fetched', {
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
  }));
});

module.exports = { createContactMessage, getContactMessages };