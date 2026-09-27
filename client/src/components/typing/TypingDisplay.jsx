import { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Renders the typing text with character-level state coloring
 */
const TypingDisplay = ({ text, charStates, currentIndex, fontSize = 'medium' }) => {
  const containerRef = useRef(null)
  const currentCharRef = useRef(null)

  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl',
  }[fontSize] || 'text-xl'

  // Auto-scroll to keep current char visible
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const container = containerRef.current
      const char = currentCharRef.current
      const charTop = char.offsetTop
      const charBottom = charTop + char.offsetHeight
      const containerScrollTop = container.scrollTop
      const containerBottom = containerScrollTop + container.clientHeight

      if (charTop < containerScrollTop + 40) {
        container.scrollTop = Math.max(0, charTop - 40)
      } else if (charBottom > containerBottom - 40) {
        container.scrollTop = charBottom - container.clientHeight + 40
      }
    }
  }, [currentIndex])

  const chars = useMemo(() => text.split(''), [text])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ maxHeight: '180px' }}
      aria-label="Typing text area"
    >
      {/* Fade mask at top and bottom */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />

      <p
        className={`font-mono ${fontSizeClass} leading-relaxed tracking-wide select-none`}
        style={{ lineHeight: '2.2', letterSpacing: '0.02em' }}
      >
        {chars.map((char, idx) => {
          const state = charStates[idx] || 'untyped'
          const isCurrent = idx === currentIndex

          let className = 'typing-char '
          switch (state) {
            case 'correct': className += 'typing-char-correct'; break
            case 'incorrect': className += 'typing-char-incorrect'; break
            case 'current': className += 'typing-char-current'; break
            default: className += 'typing-char-untyped'
          }

          return (
            <span
              key={idx}
              ref={isCurrent ? currentCharRef : null}
              className={className}
              data-idx={idx}
            >
              {char}
              {isCurrent && (
                <span className="typing-cursor absolute" style={{ marginLeft: '-1px' }} />
              )}
            </span>
          )
        })}
      </p>
    </div>
  )
}

export default TypingDisplay
