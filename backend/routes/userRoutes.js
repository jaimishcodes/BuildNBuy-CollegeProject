const express = require('express');
const router = express.Router();
const { updateProfile, getUsers, getUserById, toggleBlockUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');
const validate = require('../middleware/validate');

router.put('/me', protect, uploadAvatar.single('avatar'), validate({ name: 'name', phone: 'phone' }), updateProfile);

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/block', protect, authorize('admin'), toggleBlockUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
