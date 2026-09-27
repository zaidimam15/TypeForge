import { useState, useEffect, useRef, useCallback } from 'react'
import {
  calcWpm,
  calcRawWpm,
  calcAccuracy,
  calcConsistency
} from '../utils/typingUtils'

import {
  playTypingSound,
  playSpaceSound,
  playBackspaceSound
} from '../utils/typingSound'

/**
 * Core typing engine hook.
 * Manages the complete state of a typing test.
 */
const useTypingEngine = ({ text, mode, duration, wordCount }) => {
  // Typed input state
  const [typed, setTyped] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Test lifecycle
  const [status, setStatus] = useState('idle')
  const [countdown, setCountdown] = useState(3)

  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(duration || 60)

  // Live stats
  const [wpm, setWpm] = useState(0)
  const [rawWpm, setRawWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)

  // Character state tracking
  // 'untyped' | 'correct' | 'incorrect' | 'current'
  const [charStates, setCharStates] = useState(() =>
    text.split('').map(() => 'untyped')
  )

  // Analytics tracking
  const [wpmHistory, setWpmHistory] = useState([])
  const [accuracyHistory, setAccuracyHistory] = useState([])
  const [keyErrors, setKeyErrors] = useState({})
  const [backspaces, setBackspaces] = useState(0)
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0)
  const [incorrectKeystrokes, setIncorrectKeystrokes] = useState(0)

  // Word tracking
  const [correctWords, setCorrectWords] = useState(0)
  const [incorrectWords, setIncorrectWords] = useState(0)

  const timerRef = useRef(null)
  const analyticsRef = useRef(null)
  const startTimeRef = useRef(null)
  const pausedTimeRef = useRef(0)

  // Reset everything
  const reset = useCallback((newText) => {
    clearInterval(timerRef.current)
    clearInterval(analyticsRef.current)

    const resetText = newText || text

    setTyped('')
    setCurrentIndex(0)
    setStatus('idle')
    setCountdown(3)
    setTimeElapsed(0)
    setTimeRemaining(duration || 60)
    setWpm(0)
    setRawWpm(0)
    setAccuracy(100)
    setErrors(0)
    setWpmHistory([])
    setAccuracyHistory([])
    setKeyErrors({})
    setBackspaces(0)
    setCorrectKeystrokes(0)
    setIncorrectKeystrokes(0)
    setCorrectWords(0)
    setIncorrectWords(0)

    setCharStates(
      resetText.split('').map(() => 'untyped')
    )

    startTimeRef.current = null
    pausedTimeRef.current = 0
  }, [text, duration])

  // Finish test
  const finishTest = useCallback(() => {
    clearInterval(timerRef.current)
    clearInterval(analyticsRef.current)

    timerRef.current = null
    analyticsRef.current = null

    setStatus('finished')
  }, [])

  // Start test
  const startTest = useCallback(() => {
    if (timerRef.current) {
      return
    }

    setStatus('running')
    startTimeRef.current = Date.now()

    // Main timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => {
        const newElapsed = prev + 1

        if (mode === 'time') {
          const remaining = (duration || 60) - newElapsed

          setTimeRemaining(Math.max(remaining, 0))

          if (remaining <= 0) {
            finishTest()
          }
        }

        return newElapsed
      })
    }, 1000)

    // Analytics sampling
    analyticsRef.current = setInterval(() => {
      setTimeElapsed(elapsed => {
        setCorrectKeystrokes(correctCount => {
          const currentWpm = calcWpm(
            correctCount,
            elapsed || 1
          )

          setWpmHistory(prev => [
            ...prev,
            {
              time: elapsed,
              wpm: currentWpm
            }
          ])

          setAccuracy(currentAccuracy => {
            setAccuracyHistory(prev => [
              ...prev,
              {
                time: elapsed,
                accuracy: currentAccuracy
              }
            ])

            return currentAccuracy
          })

          return correctCount
        })

        return elapsed
      })
    }, 2000)
  }, [mode, duration, finishTest])

  // Start countdown
  const startCountdown = useCallback(() => {
    if (status !== 'idle') return

    setStatus('countdown')
    setCountdown(3)

    let count = 3

    const countInterval = setInterval(() => {
      count -= 1
      setCountdown(count)

      if (count <= 0) {
        clearInterval(countInterval)
        startTest()
      }
    }, 1000)
  }, [status, startTest])

  // Pause test
  const pauseTest = useCallback(() => {
    if (status !== 'running') return

    clearInterval(timerRef.current)
    clearInterval(analyticsRef.current)

    timerRef.current = null
    analyticsRef.current = null

    pausedTimeRef.current = Date.now()

    setStatus('paused')
  }, [status])

  // Resume test
  const resumeTest = useCallback(() => {
    if (status !== 'paused') return

    setStatus('running')

    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => {
        const newElapsed = prev + 1

        if (mode === 'time') {
          const remaining = (duration || 60) - newElapsed

          setTimeRemaining(Math.max(remaining, 0))

          if (remaining <= 0) {
            finishTest()
          }
        }

        return newElapsed
      })
    }, 1000)
  }, [status, mode, duration, finishTest])

  // Handle keyboard input
  const handleKeyDown = useCallback((e) => {
    if (status === 'finished' || status === 'paused') {
      return
    }

    // IMPORTANT:
    // Prevent browser key-repeat when a key is held down.
    // One physical key press = one sound.
    if (e.repeat) {
      return
    }

    // Escape = pause
    if (e.key === 'Escape') {
      if (status === 'running') {
        pauseTest()
      }

      return
    }

    // Tab = restart
    if (e.key === 'Tab') {
      e.preventDefault()
      reset()
      return
    }

    const key = e.key

    // Ignore modifier keys and other non-typing keys
    if (
      key === 'Enter' ||
      key === 'Shift' ||
      key === 'Control' ||
      key === 'Alt' ||
      key === 'Meta' ||
      key === 'CapsLock' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight'
    ) {
      return
    }

    // Start immediately when the first real typing key is pressed.
    if (status === 'idle') {
      startTest()
    } else if (status !== 'running') {
      return
    }

    // Backspace
    if (key === 'Backspace') {
      e.preventDefault()

      if (currentIndex === 0) {
        return
      }

      // Backspace sound
      playBackspaceSound()

      setBackspaces(prev => prev + 1)

      const newIndex = currentIndex - 1

      setCurrentIndex(newIndex)

      setTyped(prev => prev.slice(0, -1))

      setCharStates(prev => {
        const next = [...prev]

        next[newIndex] = 'current'

        if (newIndex + 1 < next.length) {
          next[newIndex + 1] = 'untyped'
        }

        return next
      })

      return
    }

    // Only process printable characters
    if (key.length !== 1) {
      return
    }

    // Typing sound
    if (key === ' ') {
      playSpaceSound()
    } else {
      playTypingSound()
    }

    const expected = text[currentIndex]

    if (!expected) {
      return
    }

    const isCorrect = key === expected
    const newIndex = currentIndex + 1

    // Keystroke statistics
    if (isCorrect) {
      setCorrectKeystrokes(prev => prev + 1)
    } else {
      setIncorrectKeystrokes(prev => prev + 1)
      setErrors(prev => prev + 1)

      setKeyErrors(prev => ({
        ...prev,
        [expected]: (prev[expected] || 0) + 1
      }))
    }

    // Update typed text
    setTyped(prev => prev + key)
    setCurrentIndex(newIndex)

    // Update character states
    setCharStates(prev => {
      const next = [...prev]

      next[currentIndex] = isCorrect
        ? 'correct'
        : 'incorrect'

      if (newIndex < next.length) {
        next[newIndex] = 'current'
      }

      return next
    })

    // Live statistics
    const totalTyped = currentIndex + 1

    const previousCorrect =
      charStates.filter(
        state => state === 'correct'
      ).length

    const correctCount =
      previousCorrect + (isCorrect ? 1 : 0)

    const currentAccuracy = calcAccuracy(
      correctCount,
      totalTyped
    )

    setAccuracy(currentAccuracy)

    setWpm(
      calcWpm(
        correctCount,
        timeElapsed || 1
      )
    )

    setRawWpm(
      calcRawWpm(
        totalTyped,
        timeElapsed || 1
      )
    )

    // Word completion
    if (key === ' ') {
      const wordStart =
        text.lastIndexOf(' ', currentIndex - 1) + 1

      const expectedWord =
        text.slice(wordStart, currentIndex).trim()

      const typedWord =
        typed.slice(wordStart, currentIndex).trim()

      if (typedWord === expectedWord) {
        setCorrectWords(prev => prev + 1)
      } else {
        setIncorrectWords(prev => prev + 1)
      }
    }

    // Complete test when all characters are typed
    if (newIndex >= text.length) {
      finishTest()
    }
  }, [
    status,
    currentIndex,
    text,
    typed,
    charStates,
    timeElapsed,
    startTest,
    pauseTest,
    finishTest,
    reset
  ])

  // Set initial cursor
  useEffect(() => {
    if (text && charStates.length !== text.length) {
      setCharStates(
        text.split('').map(() => 'untyped')
      )

      setTyped('')
      setCurrentIndex(0)
      setStatus('idle')
    }

    if (text && charStates[0] === 'untyped') {
      setCharStates(prev => {
        const next = [...prev]

        if (next.length > 0) {
          next[0] = 'current'
        }

        return next
      })
    }
  }, [text, charStates.length])

  // Cleanup
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      clearInterval(analyticsRef.current)
    }
  }, [])

  // Compute results
  const getResults = useCallback(() => {
    const correctChars = charStates.filter(
      state => state === 'correct'
    ).length

    const incorrectChars = charStates.filter(
      state => state === 'incorrect'
    ).length

    const totalTyped =
      correctChars + incorrectChars

    const finalWpm = calcWpm(
      correctChars,
      timeElapsed || 1
    )

    const finalRawWpm = calcRawWpm(
      totalTyped,
      timeElapsed || 1
    )

    const finalAccuracy = calcAccuracy(
      correctChars,
      totalTyped
    )

    const finalConsistency = calcConsistency(
      wpmHistory.map(item => item.wpm)
    )

    return {
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      consistency: finalConsistency,
      correctCharacters: correctChars,
      incorrectCharacters: incorrectChars,
      totalCharacters: totalTyped,
      correctWords,
      incorrectWords,
      errors,
      keystrokes: totalTyped + backspaces,
      correctKeystrokes,
      incorrectKeystrokes,
      backspaces,
      timeTaken: timeElapsed,
      wpmHistory,
      accuracyHistory,
      keyErrors
    }
  }, [
    charStates,
    timeElapsed,
    wpmHistory,
    accuracyHistory,
    keyErrors,
    correctWords,
    incorrectWords,
    errors,
    backspaces,
    correctKeystrokes,
    incorrectKeystrokes
  ])

  return {
    // State
    typed,
    currentIndex,
    status,
    countdown,
    timeElapsed,
    timeRemaining,
    wpm,
    rawWpm,
    accuracy,
    errors,
    charStates,
    wpmHistory,
    accuracyHistory,
    keyErrors,
    backspaces,
    correctKeystrokes,
    incorrectKeystrokes,
    correctWords,
    incorrectWords,

    // Actions
    handleKeyDown,
    reset,
    startCountdown,
    startTest,
    pauseTest,
    resumeTest,
    finishTest,
    getResults
  }
}

export default useTypingEngine