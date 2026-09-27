const { validationResult } = require('express-validator');

// Validate request using express-validator
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// Anti-cheat: validate test result on server-side
exports.validateTestResult = (req, res, next) => {
  const { wpm, rawWpm, accuracy, timeTaken, correctCharacters, mode, duration, wordCount } = req.body;

  // Basic sanity checks
  if (wpm < 0 || wpm > 300) {
    return res.status(400).json({ success: false, message: 'Suspicious WPM value detected', flagged: true });
  }

  if (accuracy < 0 || accuracy > 100) {
    return res.status(400).json({ success: false, message: 'Invalid accuracy value', flagged: true });
  }

  if (rawWpm < wpm) {
    return res.status(400).json({ success: false, message: 'Raw WPM cannot be less than net WPM', flagged: true });
  }

  // Time-based validation
  if (mode === 'time' && duration) {
    const maxPossibleWpm = 350; // world record is ~217
    const expectedMinTime = (correctCharacters / 5) / maxPossibleWpm * 60;
    if (timeTaken < expectedMinTime * 0.8) {
      req.body.isValid = false;
      req.body.flaggedReason = 'Completion time too fast for given character count';
    }
  }

  // Server-side WPM recalculation
  if (correctCharacters && timeTaken) {
    const serverWpm = Math.round((correctCharacters / 5) / (timeTaken / 60));
    const deviation = Math.abs(serverWpm - wpm);
    if (deviation > 10) {
      req.body.isValid = false;
      req.body.flaggedReason = `WPM mismatch: client=${wpm}, server=${serverWpm}`;
    }
  }

  next();
};
