import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Keyboard } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'

const NotFoundPage = () => {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <p className="text-8xl font-black gradient-text mb-4">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-dark-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              <Home size={16} /> Go Home
            </Link>
            <Link to="/test" className="btn btn-secondary">
              <Keyboard size={16} /> Start Typing
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default NotFoundPage
