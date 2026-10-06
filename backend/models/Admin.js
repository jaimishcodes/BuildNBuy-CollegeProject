const mongoose = require('mongoose');
const createAccountSchema = require('./accountSchema');

module.exports = mongoose.model('Admin', createAccountSchema('admin'), 'Admin');