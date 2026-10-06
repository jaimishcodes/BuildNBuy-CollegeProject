const mongoose = require('mongoose');
const createAccountSchema = require('./accountSchema');

module.exports = mongoose.model('ContractorUser', createAccountSchema('contractor'), 'contractor_users');