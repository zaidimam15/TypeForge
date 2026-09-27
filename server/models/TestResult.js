const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Test configuration
  mode: {
    type: String,
    enum: ['time', 'words', 'custom'],
    required: true,
  },
  duration: { type: Number }, // seconds (for time mode)
  wordCount: { type: Number }, // (for words mode)
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  category: {
    type: String,
    default: 'english',
  },

  // Core results
  wpm: { type: Number, required: true, min: 0 },
  rawWpm: { type: Number, required: true, min: 0 },
  accuracy: { type: Number, required: true, min: 0, max: 100 },
  consistency: { type: Number, default: 0 },

  // Character counts
  correctCharacters: { type: Number, default: 0 },
  incorrectCharacters: { type: Number, default: 0 },
  extraCharacters: { type: Number, default: 0 },
  missedCharacters: { type: Number, default: 0 },
  totalCharacters: { type: Number, default: 0 },

  // Word counts
  correctWords: { type: Number, default: 0 },
  incorrectWords: { type: Number, default: 0 },

  // Keystrokes
  keystrokes: { type: Number, default: 0 },
  correctKeystrokes: { type: Number, default: 0 },
  incorrectKeystrokes: { type: Number, default: 0 },
  backspaces: { type: Number, default: 0 },
  errors: { type: Number, default: 0 },

  // Time
  timeTaken: { type: Number, required: true }, // actual seconds

  // Analytics
  wpmHistory: [{ time: Number, wpm: Number }], // time-series data
  accuracyHistory: [{ time: Number, accuracy: Number }],

  // Error analysis
  keyErrors: {
    type: Map,
    of: Number,
    default: {},
  },
  difficultWords: [{ word: String, mistakes: Number }],

  // Passage used
  passage: { type: String },
  passageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },

  // Anti-cheat
  isValid: { type: Boolean, default: true },
  flaggedReason: { type: String },

  // Personal best flag
  isPersonalBest: { type: Boolean, default: false },

  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Indexes for faster queries
testResultSchema.index({ userId: 1, completedAt: -1 });
testResultSchema.index({ wpm: -1 });
testResultSchema.index({ completedAt: -1 });

module.exports = mongoose.model('TestResult', testResultSchema);
