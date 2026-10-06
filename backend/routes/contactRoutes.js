const express = require('express');
const { createContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, authorize('admin'), getContactMessages);

module.exports = router;