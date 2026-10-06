const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyByIdOrSlug,
  getMyProperties,
  createPropertyInquiry,
  getReceivedPropertyInquiries,
  getPropertyInquiries,
  updatePropertyInquiryStatus,
  updateProperty,
  deleteProperty,
  adminGetProperties,
  moderateProperty,
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { uploadPropertyImages } = require('../config/cloudinary');

// Admin moderation (must come before /:idOrSlug)
router.get('/admin/all', protect, authorize('admin'), adminGetProperties);
router.put('/:id/moderate', protect, authorize('admin'), moderateProperty);

router.get('/mine', protect, getMyProperties);
router.get('/inquiries', protect, authorize('customer', 'contractor'), getPropertyInquiries);
router.get('/inquiries/received', protect, authorize('customer', 'contractor'), getReceivedPropertyInquiries);
router.put('/inquiries/:inquiryId/status', protect, authorize('customer', 'contractor'), updatePropertyInquiryStatus);

router.route('/')
  .get(optionalAuth, getProperties)
  .post(protect, authorize('customer'), uploadPropertyImages.array('images', 10), createProperty);

router.route('/:id')
  .put(protect, authorize('customer', 'admin'), uploadPropertyImages.array('images', 10), updateProperty)
  .delete(protect, deleteProperty);

router.post('/:id/inquiries', protect, authorize('customer', 'contractor'), createPropertyInquiry);
router.get('/:idOrSlug', optionalAuth, getPropertyByIdOrSlug);

module.exports = router;
