import { motion } from 'framer-motion'
import { Clock, Zap, Target, AlertTriangle } from 'lucide-react'
import { formatTime } from '../../utils/typingUtils'

const LiveStats = ({ wpm, accuracy, errors, timeRemaining, timeElapsed, mode, duration, progress = 0 }) => {
  const stats = [
    {
      id: 'time',
      label: mode === 'time' ? 'Time' : 'Elapsed',
      value: mode === 'time' ? formatTime(timeRemaining) : formatTime(timeElapsed),
      icon: <Clock size={14} />,
      color: timeRemaining <= 10 && mode === 'time' ? 'text-red-400' : 'text-dark-300',
      urgent: timeRemaining <= 10 && mode === 'time',
    },
    {
      id: 'wpm',
      label: 'WPM',
      value: wpm,
      icon: <Zap size={14} />,
      color: wpm >= 80 ? 'text-forge-400' : wpm >= 60 ? 'text-green-400' : 'text-dark-200',
    },
    {
      id: 'accuracy',
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: <Target size={14} />,
      color: accuracy >= 95 ? 'text-green-400' : accuracy >= 85 ? 'text-yellow-400' : 'text-red-400',
    },
    {
      id: 'errors',
      label: 'Errors',
      value: errors,
      icon: <AlertTriangle size={14} />,
      color: errors === 0 ? 'text-green-400' : errors <= 5 ? 'text-yellow-400' : 'text-red-400',
    },
  ]

  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="flex items-center justify-center gap-6 md:gap-12">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            className="flex flex-col items-center gap-0.5"
            animate={stat.urgent ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className={`text-2xl md:text-3xl font-bold font-mono tabular-nums transition-colors duration-300 ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-xs text-dark-500 uppercase tracking-wider flex items-center gap-1">
              {stat.icon} {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar (for word mode or time mode) */}
      {progress > 0 && (
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}

export default LiveStats
