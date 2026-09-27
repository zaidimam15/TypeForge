const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Standard WPM calculation
 * WPM = (Correct Characters / 5) / Minutes
 */
const calculateWpm = (correctChars, timeSeconds) => {
  if (!timeSeconds || timeSeconds === 0) return 0;
  return Math.round((correctChars / 5) / (timeSeconds / 60));
};

/**
 * Raw WPM = (Total Typed Characters / 5) / Minutes
 */
const calculateRawWpm = (totalChars, timeSeconds) => {
  if (!timeSeconds || timeSeconds === 0) return 0;
  return Math.round((totalChars / 5) / (timeSeconds / 60));
};

/**
 * Accuracy = (Correct Characters / Total Typed) * 100
 */
const calculateAccuracy = (correctChars, totalChars) => {
  if (!totalChars || totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100 * 10) / 10;
};

/**
 * Consistency = 100 - (Standard Deviation of WPM intervals / Average WPM * 100)
 * Based on WPM variation over time segments
 */
const calculateConsistency = (wpmHistory) => {
  if (!wpmHistory || wpmHistory.length < 2) return 100;
  const wpms = wpmHistory.map(h => h.wpm).filter(w => w > 0);
  if (wpms.length < 2) return 100;

  const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  const variance = wpms.reduce((sum, w) => sum + Math.pow(w - avg, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  const cv = avg > 0 ? (stdDev / avg) * 100 : 0;
  const consistency = Math.max(0, Math.round((100 - cv) * 10) / 10);
  return Math.min(100, consistency);
};

/**
 * Check if a result is a personal best for a user
 */
const checkPersonalBest = (user, testResult) => {
  const { mode, duration, wordCount, wpm, accuracy } = testResult;
  let isPB = false;
  let pbKey = null;

  if (mode === 'time' && duration) {
    pbKey = `time${duration}`;
  } else if (mode === 'words' && wordCount) {
    pbKey = `words${wordCount}`;
  }

  if (pbKey && user.personalBests[pbKey]) {
    if (wpm > user.personalBests[pbKey].wpm) {
      isPB = true;
    }
  }

  if (wpm > user.bestWpm) isPB = true;

  return { isPB, pbKey };
};

/**
 * Update user stats after a test
 */
const updateUserStats = async (user, testResult) => {
  const { wpm, rawWpm, accuracy, consistency, timeTaken, correctCharacters, mode, duration, wordCount } = testResult;

  // Update best WPM
  if (wpm > user.bestWpm) user.bestWpm = wpm;
  if (rawWpm > user.bestRawWpm) user.bestRawWpm = rawWpm;
  if (accuracy > user.bestAccuracy) user.bestAccuracy = accuracy;
  if (consistency > user.bestConsistency) user.bestConsistency = consistency;

  // Update personal bests per mode
  let pbKey = null;
  if (mode === 'time' && duration) pbKey = `time${duration}`;
  else if (mode === 'words' && wordCount) pbKey = `words${wordCount}`;

  if (pbKey && user.personalBests[pbKey] !== undefined) {
    if (wpm > user.personalBests[pbKey].wpm) {
      user.personalBests[pbKey].wpm = wpm;
      user.personalBests[pbKey].accuracy = accuracy;
    }
  }

  // Update totals
  user.totalTests += 1;
  user.totalTypingTime += timeTaken || 0;
  user.totalCharactersTyped += correctCharacters || 0;

  // Recalculate averages
  const allTests = user.totalTests;
  user.averageWpm = Math.round(((user.averageWpm * (allTests - 1)) + wpm) / allTests);
  user.averageAccuracy = Math.round(((user.averageAccuracy * (allTests - 1)) + accuracy) / allTests * 10) / 10;

  // Update streak
  const today = new Date().toDateString();
  const lastTest = user.lastTestDate ? new Date(user.lastTestDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastTest === today) {
    // Already tested today, streak unchanged
  } else if (lastTest === yesterday) {
    user.currentStreak += 1;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
  } else {
    user.currentStreak = 1;
  }
  user.lastTestDate = new Date();

  await user.save();
  return user;
};

module.exports = {
  generateToken,
  calculateWpm,
  calculateRawWpm,
  calculateAccuracy,
  calculateConsistency,
  checkPersonalBest,
  updateUserStats,
};
