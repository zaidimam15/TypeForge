import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Keyboard, Zap, Target, BarChart2, Trophy, ArrowRight, Star, CheckCircle } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'

// Animated typing demo text
const DEMO_WORDS = ['Speed.', 'Accuracy.', 'Consistency.', 'Mastery.']

const AnimatedTypingDemo = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const word = DEMO_WORDS[wordIndex]
    let timeout

    if (!isDeleting && charIndex < word.length) {
      timeout = setTimeout(() => setCharIndex(i => i + 1), 120)
    } else if (!isDeleting && charIndex === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1500)
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(i => i - 1), 60)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setWordIndex(i => (i + 1) % DEMO_WORDS.length)
    }

    setDisplayText(word.slice(0, charIndex))
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, wordIndex])

  return (
    <span className="gradient-text">
      {displayText}
      <span className="typing-cursor inline-block" />
    </span>
  )
}

const features = [
  {
    icon: <Zap className="text-forge-400" size={24} />,
    title: 'Real-time Analytics',
    description: 'Live WPM, accuracy, and consistency tracking as you type. See exactly how you perform.',
  },
  {
    icon: <Target className="text-green-400" size={24} />,
    title: 'Multiple Modes',
    description: 'Time mode, word count mode, and custom challenges. Find the mode that works for you.',
  },
  {
    icon: <BarChart2 className="text-blue-400" size={24} />,
    title: 'Progress Dashboard',
    description: 'Beautiful charts showing your improvement over time. Track streaks and personal bests.',
  },
  {
    icon: <Trophy className="text-yellow-400" size={24} />,
    title: 'Leaderboard',
    description: 'Compete globally with daily, weekly, and all-time rankings. Climb to the top.',
  },
  {
    icon: <Keyboard className="text-purple-400" size={24} />,
    title: 'Practice Mode',
    description: 'Target your weak keys and difficult words. Personalized practice based on your errors.',
  },
  {
    icon: <Star className="text-pink-400" size={24} />,
    title: 'Achievements',
    description: 'Unlock badges for speed, accuracy, streaks, and milestones. Gamify your progress.',
  },
]

const stats = [
  { value: '50K+', label: 'Tests Taken' },
  { value: '5K+', label: 'Active Typists' },
  { value: '150', label: 'WPM Record' },
  { value: '99%', label: 'Top Accuracy' },
]

const LandingPage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forge-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 badge-orange mb-8 text-sm"
          >
            <Zap size={14} /> Professional Typing Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight text-balance"
          >
            Type Faster.
            <br />
            <AnimatedTypingDemo />
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-dark-400 max-w-2xl mx-auto text-balance"
          >
            Measure your typing speed, improve your accuracy, and become a faster,
            more confident typist with real-time analytics and personalized practice.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/test" id="hero-start-test"
              className="btn btn-primary btn-xl group shadow-glow-orange">
              <Keyboard size={20} />
              Start Typing Test
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-xl">
              <Trophy size={20} /> View Leaderboard
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-dark-500"
          >
            No account required to start. Join 5,000+ typists improving daily.
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-dark-700/40 bg-surface/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-sm text-dark-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Everything you need to master typing
          </motion.h2>
          <p className="text-dark-400 mt-3 text-lg">
            Not just a test — a complete typing improvement platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Test Modes Preview */}
      <section className="bg-surface/30 border-y border-dark-700/40 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Multiple test modes
                <br />
                <span className="gradient-text">for every goal</span>
              </motion.h2>
              <div className="space-y-4">
                {[
                  { mode: '⏱️ Time Mode', desc: '15s, 30s, 60s, 120s, 300s — test under pressure' },
                  { mode: '📝 Word Mode', desc: '10, 25, 50, 100, 250 words — finish at your pace' },
                  { mode: '⚙️ Custom Mode', desc: 'Your text, your time, your rules' },
                ].map((item, i) => (
                  <motion.div
                    key={item.mode}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle size={20} className="text-forge-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white text-sm">{item.mode}</p>
                      <p className="text-dark-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mini typing demo visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex items-center gap-6 mb-6">
                {[{ l: 'WPM', v: '78', c: 'text-forge-400' }, { l: 'Accuracy', v: '96%', c: 'text-green-400' }, { l: 'Time', v: '32s', c: 'text-white' }].map(s => (
                  <div key={s.l}>
                    <p className={`text-2xl font-bold font-mono ${s.c}`}>{s.v}</p>
                    <p className="text-xs text-dark-500 uppercase">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="font-mono text-sm leading-loose select-none">
                <span className="text-green-400">The quick brown fox</span>
                <span className="text-red-400 underline"> jmps</span>
                <span className="text-green-400"> over the lazy dog. </span>
                <span className="border-b-2 border-forge-400 text-white">P</span>
                <span className="text-dark-600">ack my box with five dozen liquor jugs.</span>
              </div>
              <div className="mt-4 progress-bar">
                <div className="progress-fill" style={{ width: '62%' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card border-forge-500/20 bg-gradient-to-br from-forge-500/5 to-transparent"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to improve your typing?
          </h2>
          <p className="text-dark-400 mb-8 text-lg">
            Join thousands of typists who use TypeForge to measure, practice, and master their typing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" id="cta-signup" className="btn btn-primary btn-xl shadow-glow-orange">
              Create Free Account
            </Link>
            <Link to="/test" className="btn btn-ghost btn-xl">
              Try Without Account
            </Link>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  )
}

export default LandingPage
