const TestResult = require('../models/TestResult');
const User = require('../models/User');
const { UserAchievement } = require('../models/Achievement');
const { calculateConsistency, updateUserStats, checkPersonalBest } = require('../utils/helpers');
const { checkAchievements, ACHIEVEMENTS } = require('../services/achievementService');

/**
 * @route   POST /api/tests
 * @desc    Submit a completed test result
 * @access  Private
 */
exports.submitTest = async (req, res, next) => {
  try {
    const {
      mode, duration, wordCount, difficulty, category,
      wpm, rawWpm, accuracy, correctCharacters, incorrectCharacters,
      extraCharacters, totalCharacters, correctWords, incorrectWords,
      keystrokes, correctKeystrokes, incorrectKeystrokes, backspaces,
      errors, timeTaken, wpmHistory, accuracyHistory, keyErrors,
      difficultWords, passage, passageId, isValid, flaggedReason,
    } = req.body;

    // Server-side recalculation for consistency
    const consistency = calculateConsistency(wpmHistory);

    const testResult = await TestResult.create({
      userId: req.user._id,
      mode, duration, wordCount, difficulty, category,
      wpm, rawWpm, accuracy, consistency,
      correctCharacters, incorrectCharacters, extraCharacters,
      missedCharacters: 0, totalCharacters,
      correctWords, incorrectWords,
      keystrokes, correctKeystrokes, incorrectKeystrokes, backspaces,
      errors, timeTaken,
      wpmHistory, accuracyHistory,
      keyErrors: keyErrors || {},
      difficultWords: difficultWords || [],
      passage, passageId,
      isValid: isValid !== false,
      flaggedReason: flaggedReason || '',
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    const { isPB } = checkPersonalBest(user, testResult);
    testResult.isPersonalBest = isPB;
    await testResult.save();

    await updateUserStats(user, testResult);

    // Check achievements
    const updatedUser = await User.findById(req.user._id);
    const achievementKeys = checkAchievements(updatedUser, testResult);
    const newlyUnlocked = [];

    for (const key of achievementKeys) {
      const achievement = ACHIEVEMENTS.find(a => a.key === key);
      if (!achievement) continue;

      // Find achievement doc or use inline data
      try {
        const alreadyUnlocked = await UserAchievement.findOne({
          userId: req.user._id,
          'achievementKey': key,
        });
        if (!alreadyUnlocked) {
          newlyUnlocked.push(achievement);
        }
      } catch {
        // Achievement model might not be seeded, skip
      }
    }

    res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      test: testResult,
      isPersonalBest: isPB,
      newAchievements: newlyUnlocked,
      updatedStats: {
        bestWpm: updatedUser.bestWpm,
        averageWpm: updatedUser.averageWpm,
        totalTests: updatedUser.totalTests,
        currentStreak: updatedUser.currentStreak,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tests/history
 * @desc    Get user's test history with filtering
 * @access  Private
 */
exports.getHistory = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, mode, difficulty, category,
      sortBy = 'completedAt', sortOrder = 'desc', search,
    } = req.query;

    const query = { userId: req.user._id };
    if (mode) query.mode = mode;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const total = await TestResult.countDocuments(query);
    const tests = await TestResult.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-wpmHistory -accuracyHistory -keyErrors -passage');

    res.json({
      success: true,
      tests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tests/:id
 * @desc    Get a specific test result
 * @access  Private
 */
exports.getTest = async (req, res, next) => {
  try {
    const test = await TestResult.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    res.json({ success: true, test });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tests/:id
 * @desc    Delete a test result
 * @access  Private
 */
exports.deleteTest = async (req, res, next) => {
  try {
    const test = await TestResult.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    res.json({ success: true, message: 'Test deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tests
 * @desc    Delete all test history for user
 * @access  Private
 */
exports.clearHistory = async (req, res, next) => {
  try {
    await TestResult.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'History cleared successfully' });
  } catch (error) {
    next(error);
  }
};
