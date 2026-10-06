const mongoose = require('mongoose');
const createAccountSchema = require('./accountSchema');

module.exports = mongoose.model('User', createAccountSchema('customer'), 'users');
