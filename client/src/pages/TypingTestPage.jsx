import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import MainLayout from '../components/layout/MainLayout'
import TestConfig from '../components/typing/TestConfig'
import TypingDisplay from '../components/typing/TypingDisplay'
import LiveStats from '../components/typing/LiveStats'
import TestControls from '../components/typing/TestControls'
import ResultScreen from '../components/typing/ResultScreen'
import { CountdownOverlay, Modal, Spinner } from '../components/ui'

import useTypingEngine from '../hooks/useTypingEngine'
import { generateText } from '../data/wordLists'
import { passageService, testService } from '../services/apiServices'
import { useAuth } from '../context/AuthContext'

const DEFAULT_CONFIG = {
  mode: 'time',
  duration: 60,
  wordCount: 50,
  difficulty: 'medium',
  category: 'english',
}

const TypingTestPage = () => {
  const { isAuthenticated, updateUser } = useAuth()

  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [text, setText] = useState('')
  const [testKey, setTestKey] = useState(0)
  const [loadingText, setLoadingText] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Result state
  const [results, setResults] = useState(null)
  const [isPersonalBest, setIsPersonalBest] = useState(false)
  const [newAchievements, setNewAchievements] = useState([])
  const [submitting, setSubmitting] = useState(false)

  // Generate/fetch text
  const loadText = useCallback(async (cfg = config) => {
    setLoadingText(true)

    try {
      // Try to get passage from backend
      const data = await passageService.get({
        category: cfg.category,
        difficulty: cfg.difficulty,
        count: 1,
        random: true,
      })

      if (data.passages && data.passages.length > 0) {
        let passageText = data.passages[0].content

        // For word mode, trim to word count
        if (cfg.mode === 'words') {
          const words = passageText.split(' ')
          passageText = words.slice(0, cfg.wordCount).join(' ')

          // If not enough words, generate locally
          if (words.length < cfg.wordCount) {
            passageText = generateText({
              difficulty: cfg.difficulty,
              wordCount: cfg.wordCount,
              category: cfg.category,
            })
          }
        }

        setText(passageText)
      } else {
        throw new Error('No passages found')
      }
    } catch {
      // Fallback to local generation
      const localText = generateText({
        difficulty: cfg.difficulty,
        wordCount: cfg.mode === 'words' ? cfg.wordCount : 80,
        category: cfg.category,
      })

      setText(localText)
    } finally {
      setLoadingText(false)
    }
  }, [config])

  // Load initial text
  useEffect(() => {
    loadText()
  }, [])

  // Config change handler
  const handleConfigChange = useCallback((changes) => {
    const newConfig = { ...config, ...changes }
    setConfig(newConfig)
  }, [config])

  // Typing engine
  const engine = useTypingEngine({
    text,
    mode: config.mode,
    duration: config.duration,
    wordCount: config.wordCount,
  })

  // Handle test completion
  const handleFinish = useCallback(async () => {
    const resultData = engine.getResults()
    setResults(resultData)

    if (!isAuthenticated) return

    // Submit to backend
    setSubmitting(true)

    try {
      const payload = {
        ...resultData,
        mode: config.mode,
        duration: config.mode === 'time' ? config.duration : undefined,
        wordCount: config.mode === 'words' ? config.wordCount : undefined,
        difficulty: config.difficulty,
        category: config.category,
        passage: text.slice(0, 500),
      }

      const response = await testService.submit(payload)

      if (response.isPersonalBest) {
        setIsPersonalBest(true)
        toast.success('🏆 New Personal Best!')
      }

      if (response.newAchievements?.length > 0) {
        setNewAchievements(response.newAchievements)
        toast.success(
          `🎉 ${response.newAchievements[0].name} achievement unlocked!`
        )
      }

      if (response.updatedStats) {
        updateUser(response.updatedStats)
      }
    } catch (err) {
      // Test save failed silently — results still shown locally
    } finally {
      setSubmitting(false)
    }
  }, [engine, config, text, isAuthenticated, updateUser])

  // Watch for finished status
  useEffect(() => {
    if (engine.status === 'finished' && !results) {
      handleFinish()
    }
  }, [engine.status, results, handleFinish])

  // Restart handler
  const handleRestart = useCallback(async () => {
    setResults(null)
    setIsPersonalBest(false)
    setNewAchievements([])
    engine.reset()

    // Generate new text
    await loadText()
    setTestKey(k => k + 1)
  }, [engine, loadText])

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (results) {
        if (e.key === 'Tab') {
          e.preventDefault()
          handleRestart()
        }
        return
      }

      engine.handleKeyDown(e)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [engine.handleKeyDown, results, handleRestart])

  const isRunning =
    engine.status === 'running' || engine.status === 'countdown'

  const progress =
    config.mode === 'words'
      ? (engine.currentIndex / text.length) * 100
      : config.mode === 'time'
        ? ((config.duration - engine.timeRemaining) / config.duration) * 100
        : 0

  return (
    <MainLayout noFooter>
      <div className="min-h-screen flex flex-col">

        {/* Page Header */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-8">
          {!results && (
            <div className="mb-8">
              <TestConfig
                config={config}
                onChange={(changes) => {
                  handleConfigChange(changes)

                  // Auto-reload text when config changes
                  if (
                    engine.status === 'idle' ||
                    engine.status === 'finished'
                  ) {
                    const newCfg = { ...config, ...changes }
                    setTimeout(() => loadText(newCfg), 100)
                  }
                }}
                disabled={isRunning}
              />
            </div>
          )}
        </div>

        {/* Main Test Area */}
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-10">
          <div className="max-w-5xl w-full">

            <AnimatePresence mode="wait">

              {results ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ResultScreen
                    results={results}
                    isPersonalBest={isPersonalBest}
                    mode={config.mode}
                    duration={config.duration}
                    wordCount={config.wordCount}
                    onRestart={handleRestart}
                    newAchievements={newAchievements}
                  />
                </motion.div>
              ) : (

                <motion.div
                  key="test"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >

                  {/* Stats Bar */}
                  {(isRunning || engine.status === 'paused') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <LiveStats
                        wpm={engine.wpm}
                        rawWpm={engine.rawWpm}
                        accuracy={engine.accuracy}
                        errors={engine.errors}
                        timeRemaining={engine.timeRemaining}
                        timeElapsed={engine.timeElapsed}
                        mode={config.mode}
                        duration={config.duration}
                        progress={progress}
                      />
                    </motion.div>
                  )}

                  {/* =====================================================
                      LARGE TYPING AREA
                      ===================================================== */}
                  <div
                    className="
                      card
                      relative
                      w-full
                      min-h-[560px]
                      h-[560px]
                      px-8
                      sm:px-10
                      py-10
                      overflow-hidden
                    "
                  >

                    {/* Loading overlay */}
                    {loadingText && (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface/80 rounded-2xl z-10">
                        <Spinner size="lg" />
                      </div>
                    )}

                    {/* Countdown overlay */}
                    <AnimatePresence>
                      {engine.status === 'countdown' && (
                        <CountdownOverlay count={engine.countdown} />
                      )}
                    </AnimatePresence>

                    {/* Paused overlay */}
                    <AnimatePresence>
                      {engine.status === 'paused' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-surface/90 rounded-2xl z-20"
                        >
                          <div className="text-center">
                            <p className="text-2xl font-bold text-white mb-2">
                              Paused
                            </p>

                            <p className="text-dark-400 text-sm">
                              Press{' '}
                              <kbd className="kbd">Esc</kbd>{' '}
                              or click Resume
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Typing Text */}
                    {text && (
                      <div className="w-full h-full">
                        <TypingDisplay
                          key={testKey}
                          text={text}
                          charStates={engine.charStates}
                          currentIndex={engine.currentIndex}
                        />
                      </div>
                    )}

                    {/* Start hint */}
                    {engine.status === 'idle' && !loadingText && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-dark-500 text-sm mt-6"
                      >
                        Start typing to begin the test
                      </motion.p>
                    )}
                  </div>

                  {/* Controls */}
                  <TestControls
                    status={engine.status}
                    onRestart={handleRestart}
                    onPause={engine.pauseTest}
                    onResume={engine.resumeTest}
                  />

                  {/* Keyboard Shortcuts hint */}
                  <div className="text-center space-x-4 text-xs text-dark-600">
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-500 font-mono text-xs">
                        Tab
                      </kbd>{' '}
                      restart
                    </span>

                    <span>
                      <kbd className="px-1.5 py-0.5 rounded bg-dark-700 text-dark-500 font-mono text-xs">
                        Esc
                      </kbd>{' '}
                      pause
                    </span>

                    <button
                      onClick={() => setShowHelp(true)}
                      className="text-dark-600 hover:text-dark-400 transition-colors"
                    >
                      <HelpCircle size={12} className="inline" /> shortcuts
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-3">
          {[
            { key: 'Tab', action: 'Restart test' },
            { key: 'Ctrl + Enter', action: 'Restart test' },
            { key: 'Esc', action: 'Pause / unpause' },
            { key: 'Backspace', action: 'Delete last character' },
          ].map(s => (
            <div
              key={s.key}
              className="flex items-center justify-between"
            >
              <kbd className="px-2.5 py-1.5 rounded-lg bg-dark-700 text-dark-200 font-mono text-sm">
                {s.key}
              </kbd>

              <span className="text-dark-400 text-sm">
                {s.action}
              </span>
            </div>
          ))}
        </div>
      </Modal>

    </MainLayout>
  )
}

export default TypingTestPage