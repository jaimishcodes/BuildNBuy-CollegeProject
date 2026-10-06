const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getContractors,
  getContractorById,
  adminGetContractors,
  verifyContractor,
} = require('../controllers/contractorController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadContractorMedia } = require('../config/cloudinary');

router.get('/admin/all', protect, authorize('admin'), adminGetContractors);
router.put('/:id/verify', protect, authorize('admin'), verifyContractor);

router.get('/me', protect, authorize('contractor'), getMyProfile);
router.put(
  '/me',
  protect,
  authorize('contractor'),
  uploadContractorMedia.any(),
  updateMyProfile,
);

router.get('/', getContractors);
router.get('/:id', optionalAuth, getContractorById);

module.exports = router;
