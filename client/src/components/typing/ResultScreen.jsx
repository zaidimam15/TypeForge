import { motion } from 'framer-motion'
import { RotateCcw, Share2, ChevronRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import ResultCharts from './ResultCharts'
import { getPerformanceMessage, formatTime, formatDuration, generateInsights, accuracyColor, wpmColor } from '../../utils/typingUtils'
import { useAuth } from '../../context/AuthContext'

const ResultScreen = ({ results, isPersonalBest, mode, duration, wordCount, onRestart, newAchievements = [] }) => {
  const { isAuthenticated } = useAuth()
  const performanceMsg = getPerformanceMessage(results.wpm, isPersonalBest)

  const mainStats = [
    { label: 'Raw WPM', value: results.rawWpm, sub: 'unfiltered speed' },
    { label: 'Accuracy', value: `${results.accuracy}%`, sub: `${results.correctCharacters} correct`, color: accuracyColor(results.accuracy) },
    { label: 'Consistency', value: `${results.consistency}%`, sub: 'typing steadiness', color: results.consistency >= 90 ? 'text-green-400' : 'text-yellow-400' },
    { label: 'Time', value: formatTime(results.timeTaken), sub: mode === 'time' ? `${duration}s test` : `${wordCount} words` },
  ]

  const detailStats = [
    { label: 'Correct Characters', value: results.correctCharacters },
    { label: 'Incorrect Characters', value: results.incorrectCharacters, color: results.incorrectCharacters > 0 ? 'text-red-400' : 'text-green-400' },
    { label: 'Correct Words', value: results.correctWords },
    { label: 'Errors', value: results.errors, color: results.errors > 0 ? 'text-red-400' : 'text-green-400' },
    { label: 'Keystrokes', value: results.keystrokes },
    { label: 'Backspaces', value: results.backspaces },
    { label: 'Correct KPS', value: results.correctKeystrokes },
    { label: 'Error Rate', value: `${Math.round((results.errors / (results.keystrokes || 1)) * 100)}%` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Personal Best Banner */}
      {isPersonalBest && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center py-3 px-6 rounded-2xl bg-gradient-to-r from-forge-500/20 to-yellow-500/10 border border-forge-500/30"
        >
          <p className="text-forge-300 font-bold text-lg">🏆 New Personal Best!</p>
        </motion.div>
      )}

      {/* Main WPM Score */}
      <div className="text-center space-y-2">
        <motion.p
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`text-7xl md:text-8xl font-black font-mono tabular-nums ${wpmColor(results.wpm)}`}
        >
          {results.wpm}
        </motion.p>
        <p className="text-dark-400 text-sm uppercase tracking-widest">words per minute</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-lg font-semibold ${performanceMsg.color}`}
        >
          {performanceMsg.icon} {performanceMsg.text}
        </motion.p>
      </div>

      {/* 4 Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mainStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="stat-card text-center"
          >
            <span className={`text-2xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-sub">{stat.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {(results.wpmHistory?.length > 1) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Performance Graph</h3>
          <ResultCharts wpmHistory={results.wpmHistory} accuracyHistory={results.accuracyHistory} />
        </motion.div>
      )}

      {/* Detail Stats Grid */}
      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-4">Detailed Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {detailStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className={`text-lg font-bold ${stat.color || 'text-white'}`}>{stat.value}</span>
              <span className="text-xs text-dark-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="card border-forge-500/30 bg-forge-500/5"
        >
          <h3 className="text-sm font-semibold text-forge-400 mb-3">🎉 Achievement Unlocked!</h3>
          <div className="flex flex-wrap gap-3">
            {newAchievements.map(a => (
              <div key={a.key} className="flex items-center gap-2 bg-dark-800 rounded-xl px-3 py-2">
                <span className="text-xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{a.name}</p>
                  <p className="text-xs text-dark-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Guest prompt */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="card border-forge-500/20 bg-forge-500/5 text-center"
        >
          <p className="text-dark-300 text-sm mb-3">
            Create a free account to save your results, track progress, and compete on leaderboards!
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register" className="btn btn-primary btn-sm">
              Create Account <ChevronRight size={14} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={onRestart} className="btn btn-primary">
          <RotateCcw size={16} /> Try Again
        </button>
        {isAuthenticated && (
          <Link to="/history" className="btn btn-secondary">
            View History <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <p className="text-center text-xs text-dark-600">
        Press <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-400 text-xs font-mono">Tab</kbd> to restart
      </p>
    </motion.div>
  )
}

export default ResultScreen
