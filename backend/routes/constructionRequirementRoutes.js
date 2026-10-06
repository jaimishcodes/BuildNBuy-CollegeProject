const express = require('express');
const router = express.Router();
const {
  createRequirement,
  getMyRequirements,
  getReceivedRequirements,
  updateRequirementStatus,
  sendRequirementMessage,
} = require('../controllers/constructionRequirementController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), createRequirement);
router.get('/mine', protect, authorize('customer'), getMyRequirements);
router.get('/received', protect, authorize('contractor'), getReceivedRequirements);
router.put('/:id/status', protect, authorize('contractor'), updateRequirementStatus);
router.post('/:id/messages', protect, authorize('customer', 'contractor'), sendRequirementMessage);

module.exports = router;
