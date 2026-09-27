const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  passageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage' },
  passageContent: { type: String, required: true },
  targetWpm: { type: Number, default: 60 },
  targetAccuracy: { type: Number, default: 95 },
  duration: { type: Number, default: 60 },
  participants: { type: Number, default: 0 },
}, { timestamps: true });

const dailyChallengeResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyChallenge', required: true },
  date: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  metTarget: { type: Boolean, default: false },
  completedAt: { type: Date, default: Date.now },
});

dailyChallengeResultSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = {
  DailyChallenge: mongoose.model('DailyChallenge', dailyChallengeSchema),
  DailyChallengeResult: mongoose.model('DailyChallengeResult', dailyChallengeResultSchema),
};
