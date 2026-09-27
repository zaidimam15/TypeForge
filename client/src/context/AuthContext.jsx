import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/apiServices'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem('typeforge_token')
    const savedUser = localStorage.getItem('typeforge_user')

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('typeforge_token')
        localStorage.removeItem('typeforge_user')
      }
    }

    setLoading(false)
  }, [])

  const login = useCallback(async (identifier, password) => {
    const data = await authService.login(identifier, password)

    localStorage.setItem('typeforge_token', data.token)
    localStorage.setItem('typeforge_user', JSON.stringify(data.user))

    setUser(data.user)

    return data
  }, [])

  const register = useCallback(async (name, username, email, password) => {
    const data = await authService.register(
      name,
      username,
      email,
      password
    )

    localStorage.setItem('typeforge_token', data.token)
    localStorage.setItem('typeforge_user', JSON.stringify(data.user))

    setUser(data.user)

    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('typeforge_token')
    localStorage.removeItem('typeforge_user')

    setUser(null)

    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }

      localStorage.setItem(
        'typeforge_user',
        JSON.stringify(updated)
      )

      return updated
    })
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe()

      setUser(data.user)

      localStorage.setItem(
        'typeforge_user',
        JSON.stringify(data.user)
      )
    } catch (err) {
      // Token expired or invalid
      logout()
    }
  }, [logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}