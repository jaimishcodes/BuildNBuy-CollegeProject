const User = require('../models/User');
const ContractorUser = require('../models/ContractorUser');
const Admin = require('../models/Admin');

const accountModels = { customer: User, contractor: ContractorUser, admin: Admin };

const findAccountsByEmail = async (email, includePassword = false) => {
  const queries = Object.values(accountModels).map((Model) => {
    const query = Model.findOne({ email });
    return includePassword ? query.select('+password') : query;
  });

  const matches = (await Promise.all(queries)).filter(Boolean);
  if (matches.length <= 1) return matches;

  const adminMatch = matches.find((account) => account.role === 'admin' && account.constructor.modelName === 'Admin')
    || matches.find((account) => account.role === 'admin');
  if (adminMatch) return [adminMatch];

  return matches;
};

const findAccountById = async (id, role) => {
  if (role && accountModels[role]) return accountModels[role].findById(id);
  const accounts = await Promise.all(Object.values(accountModels).map((Model) => Model.findById(id)));
  return accounts.find(Boolean) || null;
};

const moveLegacyAccount = async (account) => {
  const TargetModel = accountModels[account.role];
  if (!TargetModel || account.constructor.modelName !== 'User') return account;

  const conflictingAccount = await TargetModel.findOne({
    $or: [{ _id: account._id }, { email: account.email }],
  });
  if (conflictingAccount) {
    const ApiError = require('./ApiError');
    throw new ApiError(409, 'This account exists in multiple collections. Contact support.');
  }

  const legacyAccount = account.toObject();
  await TargetModel.collection.insertOne(legacyAccount);
  const deleted = await account.constructor.collection.deleteOne({ _id: account._id });
  if (!deleted.deletedCount) {
    await TargetModel.collection.deleteOne({ _id: account._id });
    throw new Error('Could not move the legacy account to its role collection');
  }

  if (account.role === 'contractor') {
    const Property = require('../models/Property');
    const ConstructionRequirement = require('../models/ConstructionRequirement');
    await Promise.all([
      Property.updateMany({ listedBy: account._id, listedByRole: 'contractor' }, { listedByModel: 'ContractorUser' }),
      ConstructionRequirement.updateMany(
        { messages: { $elemMatch: { sender: account._id, senderRole: 'contractor' } } },
        { $set: { 'messages.$[message].senderModel': 'ContractorUser' } },
        { arrayFilters: [{ 'message.sender': account._id, 'message.senderRole': 'contractor' }] }
      ),
    ]);
  }

  return TargetModel.findById(account._id);
};

module.exports = { accountModels, findAccountsByEmail, findAccountById, moveLegacyAccount };