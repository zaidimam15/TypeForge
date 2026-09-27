import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Keyboard, Mail, Lock, Eye, EyeOff, User, AtSign, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.username.trim()) errs.username = 'Username is required'
    else if (form.username.length < 3) errs.username = 'At least 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Letters, numbers, underscores only'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'At least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await register(form.name, form.username, form.email, form.password)
      toast.success('Account created! Welcome to TypeForge! 🎉')
      navigate('/test')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = (() => {
    const p = form.password
    if (!p) return 0
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  })()

  const pwColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500']
  const pwLabels = ['', 'Very weak', 'Weak', 'Fair', 'Good', 'Strong']

  const fields = [
    { id: 'name', label: 'Full Name', placeholder: 'John Doe', icon: <User size={16} />, key: 'name', type: 'text', autoComplete: 'name' },
    { id: 'username', label: 'Username', placeholder: 'speedtyper99', icon: <AtSign size={16} />, key: 'username', type: 'text', autoComplete: 'username' },
    { id: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: <Mail size={16} />, key: 'email', type: 'email', autoComplete: 'email' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-forge-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="card">
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

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-dark-400 text-sm mb-8">Join thousands of typists improving their speed.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.id}>
                <label className="label" htmlFor={`register-${f.id}`}>{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500">{f.icon}</span>
                  <input
                    id={`register-${f.id}`}
                    type={f.type}
                    placeholder={f.placeholder}
                    className={`input pl-10 ${errors[f.key] ? 'border-red-500' : ''}`}
                    value={form[f.key]}
                    autoComplete={f.autoComplete}
                    onChange={e => {
                      setForm(prev => ({ ...prev, [f.key]: e.target.value }))
                      setErrors(prev => ({ ...prev, [f.key]: '' }))
                    }}
                  />
                </div>
                {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="label" htmlFor="register-password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  value={form.password}
                  autoComplete="new-password"
                  onChange={e => {
                    setForm(f => ({ ...f, password: e.target.value }))
                    setErrors(e => ({ ...e, password: '' }))
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}

              {/* Password strength */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pwStrength ? pwColors[pwStrength] : 'bg-dark-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-dark-500">{pwLabels[pwStrength]}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="register-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500" />
                <input
                  id="register-confirm"
                  type="password"
                  placeholder="••••••••"
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : form.confirmPassword && form.password === form.confirmPassword ? 'border-green-500' : ''}`}
                  value={form.confirmPassword}
                  autoComplete="new-password"
                  onChange={e => {
                    setForm(f => ({ ...f, confirmPassword: e.target.value }))
                    setErrors(e => ({ ...e, confirmPassword: '' }))
                  }}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-400" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-dark-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-forge-400 hover:text-forge-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage
