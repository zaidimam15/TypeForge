import { motion } from 'framer-motion'
import { RotateCcw, Play, Pause, Trophy } from 'lucide-react'

const TestControls = ({ status, onRestart, onPause, onResume }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {status === 'running' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onPause}
          className="btn btn-secondary btn-sm"
          title="Pause (Esc)"
        >
          <Pause size={14} /> Pause
        </motion.button>
      )}

      {status === 'paused' && (
        <motion.button
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={onResume}
          className="btn btn-primary btn-sm"
          title="Resume"
        >
          <Play size={14} /> Resume
        </motion.button>
      )}

      <button
        onClick={onRestart}
        className="btn btn-ghost btn-sm group"
        title="Restart (Tab)"
      >
        <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-300" />
        {status === 'idle' ? 'New Test' : 'Restart'}
      </button>
    </div>
  )
}

export default TestControls
