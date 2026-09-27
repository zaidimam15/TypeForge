const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '🏆' },
  category: {
    type: String,
    enum: ['speed', 'accuracy', 'consistency', 'dedication', 'milestone', 'special'],
    default: 'milestone',
  },
  condition: {
    type: { type: String },
    value: Number,
    mode: String,
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Achievement = mongoose.model('Achievement', achievementSchema);

// User Achievement (tracks which achievements a user has unlocked)
const userAchievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  achievementKey: { type: String, required: true },
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' },
  unlockedAt: { type: Date, default: Date.now },
});

userAchievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = { Achievement, UserAchievement };
