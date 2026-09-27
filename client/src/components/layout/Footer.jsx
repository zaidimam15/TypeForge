import { Link } from 'react-router-dom'
import { Keyboard, Github, Twitter, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { label: 'Typing Test', to: '/test' },
      { label: 'Practice', to: '/practice' },
      { label: 'Leaderboard', to: '/leaderboard' },
      { label: 'Daily Challenge', to: '/challenge' },
    ],
    account: [
      { label: 'Sign Up', to: '/register' },
      { label: 'Login', to: '/login' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'History', to: '/history' },
    ],
    legal: [
      { label: 'About', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  }

  return (
    <footer className="border-t border-dark-700/40 bg-dark-950/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-500 to-forge-700 flex items-center justify-center shadow-glow-orange">
                <Keyboard size={16} className="text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text">Type</span>
                <span className="text-white">Forge</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed max-w-xs">
              Measure your typing speed, improve your accuracy, and become a faster, more confident typist.
            </p>
            <p className="text-dark-500 text-xs mt-3 font-mono">Measure. Practice. Master.</p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-dark-500 hover:text-white hover:bg-surface-2 transition-all">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-dark-500 hover:text-white hover:bg-surface-2 transition-all">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {links.product.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-dark-400 hover:text-forge-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2.5">
              {links.account.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-dark-400 hover:text-forge-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {links.legal.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-dark-400 hover:text-forge-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {currentYear} TypeForge. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm flex items-center gap-1.5">
            Made with <Heart size={13} className="text-forge-500 fill-forge-500" /> for typists everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
