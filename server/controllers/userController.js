const User = require('../models/User');
const TestResult = require('../models/TestResult');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -resetPasswordToken -resetPasswordExpire');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
      .select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences/settings
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const preferences = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({ success: true, message: 'Preferences saved', preferences: user.preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:username
 * @desc    Get public profile by username
 * @access  Public
 */
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('name username avatar bio bestWpm averageWpm bestAccuracy totalTests totalTypingTime currentStreak longestStreak createdAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get recent tests
    const recentTests = await TestResult.find({ userId: user._id })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('wpm accuracy mode duration wordCount completedAt difficulty');

    res.json({ success: true, user, recentTests });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stats
 * @desc    Get comprehensive user statistics
 * @access  Private
 */
exports.getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Aggregate stats from test history
    const stats = await TestResult.aggregate([
      { $match: { userId, isValid: true } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          avgWpm: { $avg: '$wpm' },
          maxWpm: { $max: '$wpm' },
          avgAccuracy: { $avg: '$accuracy' },
          maxAccuracy: { $max: '$accuracy' },
          avgConsistency: { $avg: '$consistency' },
          totalTime: { $sum: '$timeTaken' },
          totalChars: { $sum: '$correctCharacters' },
        },
      },
    ]);

    // WPM over last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const wpmTrend = await TestResult.find({
      userId,
      completedAt: { $gte: thirtyDaysAgo },
      isValid: true,
    })
      .sort({ completedAt: 1 })
      .select('wpm accuracy consistency completedAt mode');

    // Daily activity for heatmap (last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const dailyActivity = await TestResult.aggregate([
      { $match: { userId, completedAt: { $gte: ninetyDaysAgo }, isValid: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
          avgWpm: { $avg: '$wpm' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Key error analysis
    const keyErrorAgg = await TestResult.aggregate([
      { $match: { userId, isValid: true } },
      { $project: { keyErrorsArr: { $objectToArray: '$keyErrors' } } },
      { $unwind: '$keyErrorsArr' },
      {
        $group: {
          _id: '$keyErrorsArr.k',
          totalErrors: { $sum: '$keyErrorsArr.v' },
        },
      },
      { $sort: { totalErrors: -1 } },
      { $limit: 15 },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalTests: 0, avgWpm: 0, maxWpm: 0, avgAccuracy: 0,
        maxAccuracy: 0, avgConsistency: 0, totalTime: 0, totalChars: 0,
      },
      user: {
        bestWpm: user.bestWpm,
        averageWpm: user.averageWpm,
        bestAccuracy: user.bestAccuracy,
        bestConsistency: user.bestConsistency,
        totalTests: user.totalTests,
        totalTypingTime: user.totalTypingTime,
        totalCharactersTyped: user.totalCharactersTyped,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        personalBests: user.personalBests,
      },
      wpmTrend,
      dailyActivity,
      keyErrors: keyErrorAgg,
    });
  } catch (error) {
    next(error);
  }
};
