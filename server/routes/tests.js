const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const { validateTestResult } = require('../middleware/validate');

router.post('/', protect, validateTestResult, testController.submitTest);
router.get('/history', protect, testController.getHistory);
router.delete('/', protect, testController.clearHistory);
router.get('/:id', protect, testController.getTest);
router.delete('/:id', protect, testController.deleteTest);

module.exports = router;
