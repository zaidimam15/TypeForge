import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Keyboard, BarChart2, Trophy, History, ChevronDown,
  User, Settings, LogOut, Menu, X, Zap, Target, Moon, Sun
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, changeTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navLinks = [
    { to: '/test', label: 'Test', icon: <Keyboard size={16} /> },
    { to: '/practice', label: 'Practice', icon: <Target size={16} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={16} /> },
    ...(isAuthenticated ? [
      { to: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={16} /> },
      { to: '/history', label: 'History', icon: <History size={16} /> },
    ] : []),
  ]

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center shadow-glow-orange group-hover:scale-110 transition-transform duration-200">
              <Keyboard size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="gradient-text">Type</span>
              <span className="text-white">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-surface-2 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  id="profile-menu-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-2 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-dark-200 group-hover:text-white">
                    {user?.username}
                  </span>
                  <ChevronDown size={14} className={`text-dark-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass rounded-2xl border border-dark-600/50 shadow-card overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-dark-700/50">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-dark-400">@{user?.username}</p>
                        {user?.bestWpm > 0 && (
                          <p className="text-xs text-forge-400 mt-1">Best: {user.bestWpm} WPM</p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-surface-2 transition-colors"
                        >
                          <User size={15} /> Profile
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-dark-300 hover:text-white hover:bg-surface-2 transition-colors"
                        >
                          <Settings size={15} /> Settings
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-forge-400 hover:text-forge-300 hover:bg-surface-2 transition-colors"
                          >
                            <Zap size={15} /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-dark-700/50 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm text-dark-300 hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-surface-2 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-dark-700/40 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 bg-dark-900/95">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-forge-400 bg-forge-500/10' : 'text-dark-300 hover:text-white'
                    }`
                  }
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setProfileOpen(false)} />
      )}
    </nav>
  )
}

export default Navbar
