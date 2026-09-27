import { motion } from 'framer-motion'

// Loading spinner
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }
  return (
    <div className={`${sizes[size]} border-2 border-dark-600 border-t-forge-500 rounded-full animate-spin ${className}`} />
  )
}

// Full page loading
export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <Spinner size="xl" />
    <p className="text-dark-400 text-sm animate-pulse">Loading TypeForge...</p>
  </div>
)

// Skeleton line
export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded-lg ${className}`} />
)

// Skeleton card
export const SkeletonCard = ({ lines = 3 }) => (
  <div className="card space-y-3">
    <SkeletonLine className="w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonLine key={i} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
    ))}
  </div>
)

// Empty state
export const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 gap-4 text-center"
  >
    {icon && <div className="text-5xl mb-2">{icon}</div>}
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description && <p className="text-dark-400 text-sm max-w-xs">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </motion.div>
)

// Stat card
export const StatCard = ({ label, value, sub, icon, color = 'text-white', trend }) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <span className="stat-label">{label}</span>
        <span className={`stat-value mt-1 block ${color}`}>{value}</span>
        {sub && <span className="stat-sub mt-0.5 block">{sub}</span>}
      </div>
      {icon && <div className="text-dark-500 mt-1">{icon}</div>}
    </div>
    {trend !== undefined && (
      <div className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-dark-400'}`}>
        {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)}
      </div>
    )}
  </div>
)

// Badge
export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    orange: 'badge-orange', green: 'badge-green', red: 'badge-red',
    blue: 'badge-blue', purple: 'badge-purple', gray: 'badge-gray',
  }
  return <span className={variants[variant] || 'badge-gray'}>{children}</span>
}

// Countdown overlay
export const CountdownOverlay = ({ count }) => (
  <motion.div
    key={count}
    initial={{ scale: 2, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-2xl z-20"
  >
    <span className="text-8xl font-black text-forge-400">{count}</span>
  </motion.div>
)

// Modal
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative card max-w-lg w-full max-h-[90vh] overflow-y-auto z-10"
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-dark-400 hover:text-white transition-colors">✕</button>
          </div>
        )}
        {children}
      </motion.div>
    </div>
  )
}

// Protected route wrapper
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const token = localStorage.getItem('typeforge_token')
  if (!token) {
    window.location.href = redirectTo
    return null
  }
  return children
}
