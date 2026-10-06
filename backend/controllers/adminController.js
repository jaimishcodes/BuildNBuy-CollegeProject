const asyncHandler = require('express-async-handler');
const { accountModels } = require('../utils/accountModels');
const Property = require('../models/Property');
const ContractorProfile = require('../models/ContractorProfile');
const ConstructionRequirement = require('../models/ConstructionRequirement');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get platform-wide dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalCustomers,
    totalContractors,
    verifiedContractors,
    pendingContractors,
    totalProperties,
    pendingProperties,
    approvedProperties,
    rejectedProperties,
    totalConstructionInquiries,
    recentProperties,
    recentUsers,
  ] = await Promise.all([
    accountModels.customer.countDocuments(),
    accountModels.contractor.countDocuments(),
    ContractorProfile.countDocuments({ verificationStatus: 'verified' }),
    ContractorProfile.countDocuments({ verificationStatus: 'pending' }),
    Property.countDocuments(),
    Property.countDocuments({ status: 'Pending' }),
    Property.countDocuments({ status: 'Approved' }),
    Property.countDocuments({ status: 'Rejected' }),
    ConstructionRequirement.countDocuments(),
    Property.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt listedBy').populate('listedBy', 'name'),
    Promise.all([
      accountModels.customer.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      accountModels.contractor.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
    ]).then((groups) => groups.flat().sort((first, second) => second.createdAt - first.createdAt).slice(0, 5)),
  ]);
  const totalUsers = totalCustomers + totalContractors;

  res.status(200).json(
    new ApiResponse(200, {
      users: { total: totalUsers, customers: totalCustomers, contractors: totalContractors },
      contractors: { verified: verifiedContractors, pending: pendingContractors },
      properties: {
        total: totalProperties,
        pending: pendingProperties,
        approved: approvedProperties,
        rejected: rejectedProperties,
      },
      constructionInquiries: totalConstructionInquiries,
      recentProperties,
      recentUsers,
    }, 'Dashboard stats fetched')
  );
});

module.exports = { getDashboardStats };
