const Passage = require('../models/Passage');

/**
 * @route   GET /api/passages
 * @desc    Get passages with optional filters
 * @access  Public
 */
exports.getPassages = async (req, res, next) => {
  try {
    const { category, difficulty, count = 1, random = true } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    let passages;
    if (random === 'true' || random === true) {
      const total = await Passage.countDocuments(query);
      const randomSkip = Math.max(0, Math.floor(Math.random() * total) - parseInt(count));
      passages = await Passage.find(query).skip(randomSkip).limit(parseInt(count));

      if (passages.length < parseInt(count)) {
        passages = await Passage.find(query).limit(parseInt(count));
      }
    } else {
      passages = await Passage.find(query).limit(parseInt(count));
    }

    res.json({ success: true, passages, count: passages.length });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/passages
 * @desc    Create a new passage (admin only)
 * @access  Private/Admin
 */
exports.createPassage = async (req, res, next) => {
  try {
    const { title, content, category, difficulty, language, author, source } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const passage = await Passage.create({ title, content, category, difficulty, language, author, source });
    res.status(201).json({ success: true, passage });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/passages/:id
 * @desc    Update a passage (admin only)
 * @access  Private/Admin
 */
exports.updatePassage = async (req, res, next) => {
  try {
    const passage = await Passage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!passage) return res.status(404).json({ success: false, message: 'Passage not found' });
    res.json({ success: true, passage });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/passages/:id
 * @desc    Delete a passage (admin only)
 * @access  Private/Admin
 */
exports.deletePassage = async (req, res, next) => {
  try {
    const passage = await Passage.findByIdAndDelete(req.params.id);
    if (!passage) return res.status(404).json({ success: false, message: 'Passage not found' });
    res.json({ success: true, message: 'Passage deleted' });
  } catch (error) {
    next(error);
  }
};
