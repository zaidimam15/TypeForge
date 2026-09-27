/**
 * WPM Calculation
 * Standard formula: (correct characters / 5) / minutes elapsed
 */
export const calcWpm = (correctChars, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds === 0) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

/**
 * Raw WPM (total characters typed, including errors)
 */
export const calcRawWpm = (totalChars, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds === 0) return 0
  return Math.round((totalChars / 5) / (elapsedSeconds / 60))
}

/**
 * Accuracy percentage
 */
export const calcAccuracy = (correctChars, totalChars) => {
  if (!totalChars || totalChars === 0) return 100
  return Math.round((correctChars / totalChars) * 1000) / 10 // 1 decimal place
}

/**
 * Consistency: 100 - CV (coefficient of variation) of WPM samples
 * Lower variation = higher consistency
 */
export const calcConsistency = (wpmSamples) => {
  if (!wpmSamples || wpmSamples.length < 2) return 100
  const validSamples = wpmSamples.filter(w => w > 0)
  if (validSamples.length < 2) return 100

  const avg = validSamples.reduce((a, b) => a + b, 0) / validSamples.length
  const variance = validSamples.reduce((sum, w) => sum + Math.pow(w - avg, 2), 0) / validSamples.length
  const stdDev = Math.sqrt(variance)
  const cv = avg > 0 ? (stdDev / avg) * 100 : 0
  return Math.min(100, Math.max(0, Math.round((100 - cv) * 10) / 10))
}

/**
 * Error rate per 100 keystrokes
 */
export const calcErrorRate = (errors, totalKeystrokes) => {
  if (!totalKeystrokes || totalKeystrokes === 0) return 0
  return Math.round((errors / totalKeystrokes) * 100 * 10) / 10
}

/**
 * Characters per minute
 */
export const calcCpm = (correctChars, elapsedSeconds) => {
  if (!elapsedSeconds || elapsedSeconds === 0) return 0
  return Math.round(correctChars / (elapsedSeconds / 60))
}

/**
 * Format seconds to mm:ss
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
}

/**
 * Format large numbers with K suffix
 */
export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return Math.round(num).toString()
}

/**
 * Format seconds to human-readable duration
 */
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds) return '0s'
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

/**
 * Get performance message based on WPM
 */
export const getPerformanceMessage = (wpm, isPersonalBest) => {
  if (isPersonalBest) return { text: 'New Personal Best!', color: 'text-forge-400', icon: '🏆' }
  if (wpm >= 150) return { text: 'Legendary!', color: 'text-purple-400', icon: '🦅' }
  if (wpm >= 120) return { text: 'Incredible!', color: 'text-blue-400', icon: '💎' }
  if (wpm >= 100) return { text: 'Excellent!', color: 'text-yellow-400', icon: '⭐' }
  if (wpm >= 80) return { text: 'Great job!', color: 'text-green-400', icon: '🎯' }
  if (wpm >= 60) return { text: 'Well done!', color: 'text-emerald-400', icon: '👍' }
  if (wpm >= 40) return { text: 'Good effort!', color: 'text-teal-400', icon: '💪' }
  if (wpm >= 20) return { text: 'Keep practicing!', color: 'text-dark-300', icon: '📈' }
  return { text: 'Just getting started!', color: 'text-dark-400', icon: '🌱' }
}

/**
 * Get insight messages based on test results
 */
export const generateInsights = (currentTest, previousTest) => {
  const insights = []

  if (!previousTest) {
    insights.push({ type: 'info', icon: '⌨️', text: 'Complete more tests to see personalized insights!' })
    return insights
  }

  const wpmChange = currentTest.wpm - previousTest.wpm
  const accChange = currentTest.accuracy - previousTest.accuracy

  if (wpmChange > 5) {
    insights.push({ type: 'positive', icon: '⚡', text: `Your speed improved by ${wpmChange} WPM!` })
  } else if (wpmChange < -5) {
    insights.push({ type: 'neutral', icon: '📉', text: `Speed decreased by ${Math.abs(wpmChange)} WPM. Keep practicing!` })
  }

  if (accChange > 2) {
    insights.push({ type: 'positive', icon: '🎯', text: `Accuracy improved by ${accChange.toFixed(1)}%!` })
  } else if (accChange < -2) {
    insights.push({ type: 'warning', icon: '⚠️', text: 'Accuracy decreased. Slow down and focus on precision.' })
  }

  if (currentTest.consistency >= 90) {
    insights.push({ type: 'positive', icon: '🔥', text: 'Your consistency was excellent!' })
  } else if (currentTest.consistency < 70) {
    insights.push({ type: 'neutral', icon: '📊', text: 'Try to maintain a steadier typing pace.' })
  }

  if (currentTest.errors > 10) {
    insights.push({ type: 'warning', icon: '⌨️', text: `You made ${currentTest.errors} errors. Focus on accuracy!` })
  }

  return insights.slice(0, 4)
}

/**
 * Color for WPM value display
 */
export const wpmColor = (wpm) => {
  if (wpm >= 100) return 'text-purple-400'
  if (wpm >= 80) return 'text-blue-400'
  if (wpm >= 60) return 'text-green-400'
  if (wpm >= 40) return 'text-yellow-400'
  return 'text-dark-300'
}

/**
 * Color for accuracy value display
 */
export const accuracyColor = (acc) => {
  if (acc >= 99) return 'text-purple-400'
  if (acc >= 95) return 'text-green-400'
  if (acc >= 90) return 'text-yellow-400'
  if (acc >= 80) return 'text-orange-400'
  return 'text-red-400'
}
