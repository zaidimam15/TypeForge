const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const adminGuard = [protect, authorize('admin')];

router.get('/stats', adminGuard, adminController.getAdminStats);
router.get('/users', adminGuard, adminController.getUsers);
router.put('/users/:id/ban', adminGuard, adminController.toggleBan);
router.delete('/users/:id', adminGuard, adminController.deleteUser);

module.exports = router;
