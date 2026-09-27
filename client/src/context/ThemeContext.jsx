import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

const themes = {
  dark: {
    name: 'Dark',
    bg: '#0d1117',
    surface: '#161b22',
    text: '#e6edf3',
    muted: '#7d8590',
  },
  amoled: {
    name: 'AMOLED',
    bg: '#000000',
    surface: '#0a0a0a',
    text: '#ffffff',
    muted: '#6b7280',
  },
  light: {
    name: 'Light',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
  },
  'high-contrast': {
    name: 'High Contrast',
    bg: '#000000',
    surface: '#1a1a1a',
    text: '#ffffff',
    muted: '#aaaaaa',
  },
}

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth()
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('typeforge_theme') || 'dark'
  })

  // Sync theme with user preferences
  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme)
    }
  }, [user?.preferences?.theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    const t = themes[theme] || themes.dark

    root.style.setProperty('--color-bg', t.bg)
    root.style.setProperty('--color-surface', t.surface)
    root.style.setProperty('--color-text', t.text)
    root.style.setProperty('--color-text-muted', t.muted)

    document.body.style.backgroundColor = t.bg
    document.body.style.color = t.text

    // Toggle light class
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }

    localStorage.setItem('typeforge_theme', theme)
  }, [theme])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
