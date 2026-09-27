/**
 * Achievement definitions and checker service
 */

const ACHIEVEMENTS = [
  {
    key: 'first_test',
    name: 'First Keystroke',
    description: 'Complete your very first typing test.',
    icon: '⌨️',
    category: 'milestone',
    rarity: 'common',
    condition: { type: 'tests', value: 1 },
    order: 1,
  },
  {
    key: 'ten_tests',
    name: 'Getting Warmed Up',
    description: 'Complete 10 typing tests.',
    icon: '🔥',
    category: 'dedication',
    rarity: 'common',
    condition: { type: 'tests', value: 10 },
    order: 2,
  },
  {
    key: 'fifty_tests',
    name: 'Dedicated Typist',
    description: 'Complete 50 typing tests.',
    icon: '💪',
    category: 'dedication',
    rarity: 'uncommon',
    condition: { type: 'tests', value: 50 },
    order: 3,
  },
  {
    key: 'hundred_tests',
    name: 'Century Typist',
    description: 'Complete 100 typing tests.',
    icon: '💯',
    category: 'dedication',
    rarity: 'rare',
    condition: { type: 'tests', value: 100 },
    order: 4,
  },
  {
    key: 'wpm_40',
    name: 'Above Average',
    description: 'Reach 40 WPM.',
    icon: '📈',
    category: 'speed',
    rarity: 'common',
    condition: { type: 'wpm', value: 40 },
    order: 10,
  },
  {
    key: 'wpm_60',
    name: 'Smooth Typist',
    description: 'Reach 60 WPM.',
    icon: '⚡',
    category: 'speed',
    rarity: 'common',
    condition: { type: 'wpm', value: 60 },
    order: 11,
  },
  {
    key: 'wpm_80',
    name: 'Speed Demon',
    description: 'Reach 80 WPM.',
    icon: '🏎️',
    category: 'speed',
    rarity: 'uncommon',
    condition: { type: 'wpm', value: 80 },
    order: 12,
  },
  {
    key: 'wpm_100',
    name: 'Typing Master',
    description: 'Reach 100 WPM.',
    icon: '🌟',
    category: 'speed',
    rarity: 'rare',
    condition: { type: 'wpm', value: 100 },
    order: 13,
  },
  {
    key: 'wpm_120',
    name: 'Elite Typist',
    description: 'Reach 120 WPM.',
    icon: '💎',
    category: 'speed',
    rarity: 'epic',
    condition: { type: 'wpm', value: 120 },
    order: 14,
  },
  {
    key: 'wpm_150',
    name: 'Legendary Fingers',
    description: 'Reach 150 WPM.',
    icon: '🦅',
    category: 'speed',
    rarity: 'legendary',
    condition: { type: 'wpm', value: 150 },
    order: 15,
  },
  {
    key: 'accuracy_95',
    name: 'Sharp Eye',
    description: 'Complete a test with 95% accuracy.',
    icon: '🎯',
    category: 'accuracy',
    rarity: 'common',
    condition: { type: 'accuracy', value: 95 },
    order: 20,
  },
  {
    key: 'accuracy_99',
    name: 'Accuracy King',
    description: 'Complete a test with 99% accuracy.',
    icon: '👑',
    category: 'accuracy',
    rarity: 'rare',
    condition: { type: 'accuracy', value: 99 },
    order: 21,
  },
  {
    key: 'perfect_run',
    name: 'Perfect Run',
    description: 'Complete a test with 100% accuracy.',
    icon: '✨',
    category: 'accuracy',
    rarity: 'epic',
    condition: { type: 'accuracy', value: 100 },
    order: 22,
  },
  {
    key: 'consistency_90',
    name: 'Steady Hands',
    description: 'Achieve 90% consistency in a test.',
    icon: '📊',
    category: 'consistency',
    rarity: 'uncommon',
    condition: { type: 'consistency', value: 90 },
    order: 30,
  },
  {
    key: 'consistency_95',
    name: 'Consistency Pro',
    description: 'Achieve 95% consistency in a test.',
    icon: '🎼',
    category: 'consistency',
    rarity: 'rare',
    condition: { type: 'consistency', value: 95 },
    order: 31,
  },
  {
    key: 'streak_3',
    name: 'Habit Forming',
    description: 'Maintain a 3-day typing streak.',
    icon: '🔥',
    category: 'dedication',
    rarity: 'common',
    condition: { type: 'streak', value: 3 },
    order: 40,
  },
  {
    key: 'streak_7',
    name: '7-Day Warrior',
    description: 'Maintain a 7-day typing streak.',
    icon: '📅',
    category: 'dedication',
    rarity: 'uncommon',
    condition: { type: 'streak', value: 7 },
    order: 41,
  },
  {
    key: 'streak_30',
    name: 'Monthly Champion',
    description: 'Maintain a 30-day typing streak.',
    icon: '🏆',
    category: 'dedication',
    rarity: 'legendary',
    condition: { type: 'streak', value: 30 },
    order: 42,
  },
];

/**
 * Check which achievements a user has unlocked after a test
 */
const checkAchievements = (user, testResult) => {
  const unlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    const { type, value } = achievement.condition;

    switch (type) {
      case 'tests':
        if (user.totalTests >= value) unlocked.push(achievement.key);
        break;
      case 'wpm':
        if (testResult.wpm >= value) unlocked.push(achievement.key);
        break;
      case 'accuracy':
        if (testResult.accuracy >= value) unlocked.push(achievement.key);
        break;
      case 'consistency':
        if (testResult.consistency >= value) unlocked.push(achievement.key);
        break;
      case 'streak':
        if (user.currentStreak >= value) unlocked.push(achievement.key);
        break;
    }
  }

  return unlocked;
};

module.exports = { ACHIEVEMENTS, checkAchievements };
