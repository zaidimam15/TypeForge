import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Crown, Medal, ChevronUp, ChevronDown, Minus } from 'lucide-react'
import MainLayout from '../components/layout/MainLayout'
import { leaderboardService } from '../services/apiServices'
import { useAuth } from '../context/AuthContext'
import { Spinner, EmptyState } from '../components/ui'

const PERIODS = [
  { value: 'all', label: 'All Time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
]

const DURATIONS = [
  { value: '', label: 'All' },
  { value: '15', label: '15s' },
  { value: '30', label: '30s' },
  { value: '60', label: '60s' },
  { value: '120', label: '2min' },
]

const RankIcon = ({ rank }) => {
  if (rank === 1) return <Crown size={18} className="text-yellow-400" />
  if (rank === 2) return <Medal size={18} className="text-gray-300" />
  if (rank === 3) return <Medal size={18} className="text-amber-600" />
  return <span className="text-dark-400 text-sm font-mono w-5 text-center">{rank}</span>
}

const AccuracyBadge = ({ acc }) => {
  const color = acc >= 99 ? 'text-purple-400' : acc >= 95 ? 'text-green-400' : acc >= 90 ? 'text-yellow-400' : 'text-dark-300'
  return <span className={`font-medium ${color}`}>{acc?.toFixed(1)}%</span>
}

const LeaderboardPage = () => {
  const { user } = useAuth()
  const [period, setPeriod] = useState('all')
  const [mode, setMode] = useState('time')
  const [duration, setDuration] = useState('60')

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaderboard', period, mode, duration],
    queryFn: () => leaderboardService.get({ period, mode, duration: duration || undefined }),
    staleTime: 30000,
  })

  const leaderboard = data?.leaderboard || []
  const userRank = data?.userRank

  const podium = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Trophy size={28} className="text-forge-400" />
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-dark-400">The world's best typists, ranked by speed and accuracy.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Period */}
          <div className="flex bg-dark-800 rounded-xl p-1 gap-1">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p.value ? 'bg-forge-500 text-white' : 'text-dark-400 hover:text-white'}`}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Duration filter */}
          <div className="flex bg-dark-800 rounded-xl p-1 gap-1">
            {DURATIONS.map(d => (
              <button key={d.value} onClick={() => setDuration(d.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${duration === d.value ? 'bg-forge-500/20 text-forge-400 border border-forge-500/30' : 'text-dark-400 hover:text-white'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* User rank badge */}
        {user && userRank && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card border-forge-500/20 bg-forge-500/5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-400">Your current rank</p>
              <p className="text-2xl font-bold text-forge-400">#{userRank}</p>
            </div>
            <Trophy size={32} className="text-forge-500/30" />
          </motion.div>
        )}

        {/* Podium (top 3) */}
        {!isLoading && podium.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* 2nd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card text-center mt-6 border-gray-500/20">
              <Medal size={24} className="text-gray-300 mx-auto mb-2" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-bold mx-auto mb-2">
                {podium[1]?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="font-medium text-white text-sm truncate">{podium[1]?.username || '—'}</p>
              <p className="text-2xl font-black text-white mt-1">{podium[1]?.wpm || 0}</p>
              <p className="text-xs text-dark-500">WPM</p>
            </motion.div>

            {/* 1st */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="card text-center border-yellow-500/30 bg-yellow-500/5 shadow-glow-orange">
              <Crown size={28} className="text-yellow-400 mx-auto mb-2" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-forge-600 flex items-center justify-center text-white font-bold mx-auto mb-2 text-lg shadow-glow-orange">
                {podium[0]?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="font-semibold text-white truncate">{podium[0]?.username || '—'}</p>
              <p className="text-3xl font-black text-yellow-400 mt-1">{podium[0]?.wpm || 0}</p>
              <p className="text-xs text-dark-500">WPM</p>
              <AccuracyBadge acc={podium[0]?.accuracy} />
            </motion.div>

            {/* 3rd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="card text-center mt-8 border-amber-700/20">
              <Medal size={24} className="text-amber-600 mx-auto mb-2" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-bold mx-auto mb-2">
                {podium[2]?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <p className="font-medium text-white text-sm truncate">{podium[2]?.username || '—'}</p>
              <p className="text-2xl font-black text-white mt-1">{podium[2]?.wpm || 0}</p>
              <p className="text-xs text-dark-500">WPM</p>
            </motion.div>
          </div>
        )}

        {/* Rest of leaderboard */}
        <div className="card overflow-hidden p-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-dark-700/50 text-xs text-dark-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">WPM</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-2 text-center hidden sm:block">Mode</div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : leaderboard.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No results yet"
              description="Be the first to appear on the leaderboard!"
            />
          ) : (
            <div className="divide-y divide-dark-700/30">
              {leaderboard.map((entry, idx) => {
                const isCurrentUser = user && entry.username === user.username
                return (
                  <motion.div
                    key={entry._id || idx}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-surface-2 transition-colors ${
                      isCurrentUser ? 'bg-forge-500/5 border-l-2 border-forge-500' : ''
                    }`}
                  >
                    <div className="col-span-1 flex items-center">
                      <RankIcon rank={entry.rank} />
                    </div>
                    <div className="col-span-5 flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                        idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-forge-500'
                        : idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                        : idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800'
                        : 'bg-dark-700'
                      }`}>
                        {entry.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isCurrentUser ? 'text-forge-400' : 'text-white'}`}>
                          {entry.username} {isCurrentUser && <span className="text-xs">(you)</span>}
                        </p>
                        {entry.name && <p className="text-xs text-dark-500">{entry.name}</p>}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-bold font-mono text-lg text-white">{entry.wpm}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <AccuracyBadge acc={entry.accuracy} />
                    </div>
                    <div className="col-span-2 text-center hidden sm:block">
                      <span className="text-xs text-dark-500">
                        {entry.mode === 'time' ? `${entry.duration}s` : `${entry.wordCount}w`}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default LeaderboardPage
