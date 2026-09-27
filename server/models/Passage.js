const mongoose = require('mongoose');

const passageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'english', 'quotes', 'literature', 'technology', 'programming',
      'javascript', 'python', 'java', 'react', 'science', 'business',
      'motivational', 'general', 'numbers', 'punctuation', 'custom', 'web'
    ],
    default: 'english',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium',
  },
  language: { type: String, default: 'en' },
  wordCount: { type: Number },
  characterCount: { type: Number },
  isActive: { type: Boolean, default: true },
  author: { type: String, default: '' },
  source: { type: String, default: '' },
}, { timestamps: true });

passageSchema.pre('save', function (next) {
  this.wordCount = this.content.trim().split(/\s+/).length;
  this.characterCount = this.content.length;
  next();
});

passageSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Passage', passageSchema);
