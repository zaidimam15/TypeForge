const express = require('express');
const router = express.Router();
const passageController = require('../controllers/passageController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', passageController.getPassages);
router.post('/', protect, authorize('admin'), passageController.createPassage);
router.put('/:id', protect, authorize('admin'), passageController.updatePassage);
router.delete('/:id', protect, authorize('admin'), passageController.deletePassage);

module.exports = router;
