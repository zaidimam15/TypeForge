const User = require('../models/User');
const { generateToken } = require('../utils/helpers');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');

// Validation rules
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  body('identifier').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = [
  ...exports.registerValidation,
  validate,
  async (req, res, next) => {
    try {
      const { name, username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username: username.toLowerCase() }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }

      const user = await User.create({ name, username: username.toLowerCase(), email, password });
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = [
  ...exports.loginValidation,
  validate,
  async (req, res, next) => {
    try {
      const { identifier, password } = req.body;

      // Find by email or username
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() },
        ],
      }).select('+password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.isBanned) {
        return res.status(403).json({ success: false, message: 'Your account has been banned' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          bestWpm: user.bestWpm,
          averageWpm: user.averageWpm,
          bestAccuracy: user.bestAccuracy,
          totalTests: user.totalTests,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          preferences: user.preferences,
          personalBests: user.personalBests,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client-side token deletion, server-side confirmation)
 * @access  Private
 */
exports.logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
