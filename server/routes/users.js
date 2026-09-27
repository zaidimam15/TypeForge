const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/preferences', protect, userController.updatePreferences);
router.put('/password', protect, userController.changePassword);
router.get('/stats', protect, userController.getStats);
router.get('/:username', userController.getPublicProfile);

module.exports = router;
