import { useMemo } from 'react'

const TypingDisplay = ({
  text,
  charStates,
  currentIndex,
  fontSize = 'large',
}) => {
  const fontSizeClass = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
    xlarge: 'text-3xl',
  }[fontSize] || 'text-2xl'

  const chars = useMemo(() => text.split(''), [text])

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      aria-label="Typing text area"
      style={{
        minHeight: '450px',
      }}
    >
      <p
        className={`font-mono ${fontSizeClass} tracking-wide select-none`}
        style={{
          lineHeight: '2.15',
          letterSpacing: '0.03em',
          margin: 0,
          padding: '12px 4px',

          // Keep normal word wrapping
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'normal',
        }}
      >
        {chars.map((char, idx) => {
          const state = charStates[idx] || 'untyped'
          const isCurrent = idx === currentIndex

          let className = 'typing-char '

          switch (state) {
            case 'correct':
              className += 'typing-char-correct'
              break

            case 'incorrect':
              className += 'typing-char-incorrect'
              break

            case 'current':
              className += 'typing-char-current'
              break

            default:
              className += 'typing-char-untyped'
          }

          return (
            <span
              key={idx}
              className={className}
              data-idx={idx}
              style={{
                position: 'relative',
              }}
            >
              {/* Cursor stays BEFORE current character */}
              {isCurrent && <span className="typing-cursor" />}

              {/* Normal space so words can wrap to next line */}
              {char}
            </span>
          )
        })}
      </p>
    </div>
  )
}

export default TypingDisplay