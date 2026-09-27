const TestResult = require('../models/TestResult');
const User = require('../models/User');

/**
 * @route   GET /api/leaderboard
 * @desc    Get leaderboard data
 * @access  Public
 */
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', mode = 'time', duration, limit = 50 } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === 'daily') {
      dateFilter = { completedAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) } };
    } else if (period === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { completedAt: { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { completedAt: { $gte: monthAgo } };
    }

    const matchQuery = { isValid: true, ...dateFilter };
    if (mode) matchQuery.mode = mode;
    if (duration) matchQuery.duration = parseInt(duration);

    // Get top scores (one per user — best score)
    const leaderboard = await TestResult.aggregate([
      { $match: matchQuery },
      { $sort: { wpm: -1 } },
      {
        $group: {
          _id: '$userId',
          wpm: { $first: '$wpm' },
          accuracy: { $first: '$accuracy' },
          consistency: { $first: '$consistency' },
          mode: { $first: '$mode' },
          duration: { $first: '$duration' },
          wordCount: { $first: '$wordCount' },
          completedAt: { $first: '$completedAt' },
        },
      },
      { $sort: { wpm: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          name: '$user.name',
          avatar: '$user.avatar',
          wpm: 1,
          accuracy: 1,
          consistency: 1,
          mode: 1,
          duration: 1,
          wordCount: 1,
          completedAt: 1,
        },
      },
    ]);

    // Add rank
    const ranked = leaderboard.map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    // Find current user's rank if authenticated
    let userRank = null;
    if (req.user) {
      const userBest = await TestResult.findOne({
        userId: req.user._id,
        isValid: true,
        ...dateFilter,
        ...(mode ? { mode } : {}),
        ...(duration ? { duration: parseInt(duration) } : {}),
      }).sort({ wpm: -1 });

      if (userBest) {
        const betterCount = await TestResult.aggregate([
          { $match: { ...matchQuery } },
          { $group: { _id: '$userId', maxWpm: { $max: '$wpm' } } },
          { $match: { maxWpm: { $gt: userBest.wpm } } },
          { $count: 'count' },
        ]);
        userRank = (betterCount[0]?.count || 0) + 1;
      }
    }

    res.json({ success: true, leaderboard: ranked, userRank });
  } catch (error) {
    next(error);
  }
};
