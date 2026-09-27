const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  // Personal Bests
  bestWpm: { type: Number, default: 0 },
  bestRawWpm: { type: Number, default: 0 },
  bestAccuracy: { type: Number, default: 0 },
  bestConsistency: { type: Number, default: 0 },
  averageWpm: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },

  // Personal bests per mode
  personalBests: {
    time15: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    time30: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    time60: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    time120: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    time300: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    words10: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    words25: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    words50: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    words100: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
    words250: { wpm: { type: Number, default: 0 }, accuracy: { type: Number, default: 0 } },
  },

  // Stats
  totalTests: { type: Number, default: 0 },
  totalTypingTime: { type: Number, default: 0 }, // in seconds
  totalCharactersTyped: { type: Number, default: 0 },

  // Streaks
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastTestDate: { type: Date },

  // Preferences
  preferences: {
    theme: { type: String, default: 'dark', enum: ['light', 'dark', 'amoled', 'high-contrast'] },
    fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large', 'xlarge'] },
    fontFamily: { type: String, default: 'mono' },
    soundEnabled: { type: Boolean, default: false },
    soundType: { type: String, default: 'mechanical' },
    smoothAnimations: { type: Boolean, default: true },
    showLiveWpm: { type: Boolean, default: true },
    showAccuracy: { type: Boolean, default: true },
    showTimer: { type: Boolean, default: true },
    showProgress: { type: Boolean, default: true },
    cursorStyle: { type: String, default: 'line', enum: ['line', 'block', 'underline'] },
    reduceMotion: { type: Boolean, default: false },
    liveErrors: { type: Boolean, default: true },
  },

  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
