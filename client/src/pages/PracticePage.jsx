import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Keyboard, Hash, Zap, ArrowRight, RotateCcw } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import TypingDisplay from '../components/typing/TypingDisplay'
import LiveStats from '../components/typing/LiveStats'
import ResultScreen from '../components/typing/ResultScreen'
import useTypingEngine from '../hooks/useTypingEngine'
import { WORDS_EASY, WORDS_MEDIUM, WORDS_HARD, PROGRAMMING_SNIPPETS } from '../data/wordLists'
import { CountdownOverlay } from '../components/ui'

const PRACTICE_MODES = [
  {
    id: 'weak-keys',
    label: 'Weak Keys',
    icon: '⌨️',
    description: 'Practice letters you frequently miss',
    difficulty: 'medium',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
  },
  {
    id: 'accuracy',
    label: 'Accuracy Focus',
    icon: '🎯',
    description: 'Slow down and focus on zero mistakes',
    difficulty: 'easy',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    id: 'speed',
    label: 'Speed Burst',
    icon: '⚡',
    description: 'Short high-speed challenges',
    difficulty: 'medium',
    color: 'text-forge-400',
    bg: 'bg-forge-500/10 border-forge-500/20',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    icon: '🔢',
    description: 'Practice numeric sequences',
    difficulty: 'medium',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'punctuation',
    label: 'Punctuation',
    icon: '!?;:',
    description: 'Master special characters and symbols',
    difficulty: 'hard',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'programming',
    label: 'Programming',
    icon: '< />',
    description: 'Code snippets and technical syntax',
    difficulty: 'expert',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
]

const NUMBER_SEQUENCES = [
  '123 456 789 012 345 678 901 234 567 890',
  '3.14 2.71 1.41 1.73 2.23 3.61 4.12 5.00',
  '100 200 300 400 500 600 700 800 900 1000',
  '2024 2025 2026 1990 1999 2000 2001 2010',
]

const PUNCTUATION_TEXTS = [
  'Hello, world! How are you? I\'m fine, thanks. Let\'s go: ready, set, go!',
  'Wait... what? Are you sure? Yes! No, I\'m not. Well, maybe.',
  'Type: fast; accurate; consistent. These are the key qualities.',
  'It\'s not the load that breaks you down, it\'s the way you carry it.',
]

const generatePracticeText = (modeId) => {
  switch (modeId) {
    case 'accuracy':
      const easyWords = Array.from({ length: 30 }, () => WORDS_EASY[Math.floor(Math.random() * WORDS_EASY.length)])
      return easyWords.join(' ')
    case 'speed':
      const medWords = Array.from({ length: 25 }, () => WORDS_MEDIUM[Math.floor(Math.random() * WORDS_MEDIUM.length)])
      return medWords.join(' ')
    case 'numbers':
      return NUMBER_SEQUENCES[Math.floor(Math.random() * NUMBER_SEQUENCES.length)]
    case 'punctuation':
      return PUNCTUATION_TEXTS[Math.floor(Math.random() * PUNCTUATION_TEXTS.length)]
    case 'programming':
      return PROGRAMMING_SNIPPETS[Math.floor(Math.random() * PROGRAMMING_SNIPPETS.length)]
    case 'weak-keys':
    default:
      const words = Array.from({ length: 30 }, () => WORDS_MEDIUM[Math.floor(Math.random() * WORDS_MEDIUM.length)])
      return words.join(' ')
  }
}

const PracticePage = () => {
  const [selectedMode, setSelectedMode] = useState(null)
  const [practiceText, setPracticeText] = useState('')
  const [results, setResults] = useState(null)

  const engine = useTypingEngine({
    text: practiceText,
    mode: 'words',
    wordCount: 30,
    duration: 60,
  })

  const startPractice = (mode) => {
    setSelectedMode(mode)
    const text = generatePracticeText(mode.id)
    setPracticeText(text)
    setResults(null)
    engine.reset()
  }

  const handleRestart = () => {
    const text = generatePracticeText(selectedMode.id)
    setPracticeText(text)
    setResults(null)
    engine.reset()
  }

  const handleBack = () => {
    setSelectedMode(null)
    setResults(null)
    engine.reset()
  }

  useEffect(() => {
    if (engine.status === 'finished' && !results) {
      setResults(engine.getResults())
    }
  }, [engine.status])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (results) {
        if (e.key === 'Tab') { e.preventDefault(); handleRestart() }
        return
      }
      if (selectedMode) engine.handleKeyDown(e)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [engine.handleKeyDown, results, selectedMode])

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Target size={28} className="text-forge-400" />
            <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
          </div>
          <p className="text-dark-400">Target your weaknesses and build lasting skills.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedMode ? (
            <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRACTICE_MODES.map((mode, i) => (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => startPractice(mode)}
                    className={`card text-left hover:scale-[1.02] transition-all duration-200 border ${mode.bg} group`}
                  >
                    <div className="text-3xl mb-3 font-mono">{mode.icon}</div>
                    <h3 className={`font-bold text-lg mb-1 ${mode.color}`}>{mode.label}</h3>
                    <p className="text-sm text-dark-400">{mode.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-dark-500">
                      <span className="capitalize">{mode.difficulty}</span>
                      <ArrowRight size={12} className={`group-hover:translate-x-1 transition-transform ${mode.color}`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : results ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-6 flex items-center gap-3">
                <button onClick={handleBack} className="btn btn-ghost btn-sm">← Back to Modes</button>
                <span className="text-dark-400">|</span>
                <span className="text-sm text-forge-400">{selectedMode.label} Practice</span>
              </div>
              <ResultScreen
                results={results}
                isPersonalBest={false}
                mode="words"
                wordCount={30}
                onRestart={handleRestart}
              />
            </motion.div>
          ) : (
            <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Practice header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={handleBack} className="btn btn-ghost btn-sm">← Modes</button>
                  <div className={`flex items-center gap-2 font-medium ${selectedMode.color}`}>
                    <span className="text-lg">{selectedMode.icon}</span>
                    {selectedMode.label}
                  </div>
                </div>
                <button onClick={handleRestart} className="btn btn-secondary btn-sm">
                  <RotateCcw size={13} /> New Text
                </button>
              </div>

              {/* Stats */}
              {engine.status === 'running' && (
                <div className="mb-6">
                  <LiveStats
                    wpm={engine.wpm}
                    accuracy={engine.accuracy}
                    errors={engine.errors}
                    timeElapsed={engine.timeElapsed}
                    timeRemaining={engine.timeRemaining}
                    mode="words"
                    progress={(engine.currentIndex / practiceText.length) * 100}
                  />
                </div>
              )}

              {/* Text */}
              <div className="card relative">
                <AnimatePresence>
                  {engine.status === 'countdown' && <CountdownOverlay count={engine.countdown} />}
                </AnimatePresence>
                {practiceText && (
                  <TypingDisplay
                    text={practiceText}
                    charStates={engine.charStates}
                    currentIndex={engine.currentIndex}
                  />
                )}
                {engine.status === 'idle' && (
                  <p className="text-center text-dark-500 text-sm mt-4">Start typing to begin practice</p>
                )}
              </div>

              <p className="text-center text-xs text-dark-600 mt-4">
                <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-500 font-mono">Tab</kbd> new text
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}

export default PracticePage
