const User = require('../models/User');
const TestResult = require('../models/TestResult');

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Private/Admin
 */
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalTests = await TestResult.countDocuments();
    const suspiciousTests = await TestResult.countDocuments({ isValid: false });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
    const todayTests = await TestResult.countDocuments({ completedAt: { $gte: today } });

    const statsAgg = await TestResult.aggregate([
      { $match: { isValid: true } },
      {
        $group: {
          _id: null,
          avgWpm: { $avg: '$wpm' },
          maxWpm: { $max: '$wpm' },
          totalTime: { $sum: '$timeTaken' },
        },
      },
    ]);

    // Daily registrations last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers, bannedUsers, totalTests, suspiciousTests,
        todayUsers, todayTests,
        avgWpm: Math.round(statsAgg[0]?.avgWpm || 0),
        maxWpm: statsAgg[0]?.maxWpm || 0,
        totalTypingHours: Math.round((statsAgg[0]?.totalTime || 0) / 3600),
        dailyRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({ success: true, users, total, pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/users/:id/ban
 * @desc    Ban or unban a user
 * @access  Private/Admin
 */
exports.toggleBan = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ success: true, message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`, isBanned: user.isBanned });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user and their data
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await TestResult.deleteMany({ userId: req.params.id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
