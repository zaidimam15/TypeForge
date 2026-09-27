import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Keyboard, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ identifier: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.identifier.trim()) errs.identifier = 'Email or username required'
    if (!form.password) errs.password = 'Password required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(form.identifier, form.password)
      toast.success('Welcome back! 🎉')
      navigate('/test')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-forge-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="card">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center shadow-glow-orange">
              <Keyboard size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">
                <span className="gradient-text">Type</span>
                <span className="text-white">Forge</span>
              </p>
              <p className="text-xs text-dark-500">Measure. Practice. Master.</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-dark-400 text-sm mb-8">Sign in to continue your typing journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="label" htmlFor="login-identifier">Email or Username</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="login-identifier"
                  type="text"
                  placeholder="you@example.com or username"
                  className={`input pl-10 ${errors.identifier ? 'border-red-500' : ''}`}
                  value={form.identifier}
                  onChange={e => { setForm(f => ({ ...f, identifier: e.target.value })); setErrors(e => ({ ...e, identifier: '' })) }}
                  autoComplete="username"
                />
              </div>
              {errors.identifier && <p className="text-red-400 text-xs mt-1">{errors.identifier}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(e => ({ ...e, password: '' })) }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-forge-400 hover:text-forge-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-forge-400 hover:text-forge-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-dark-700/50">
            <Link to="/test" className="block text-center text-xs text-dark-500 hover:text-dark-300 transition-colors">
              Continue as guest (limited features)
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
