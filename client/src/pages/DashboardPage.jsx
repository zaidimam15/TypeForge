import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart2, Zap, Target, Clock, Keyboard, TrendingUp, Calendar, Flame } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import MainLayout from '../components/layout/MainLayout'
import { userService } from '../services/apiServices'
import { StatCard, SkeletonCard, EmptyState } from '../components/ui'
import { formatDuration, formatNumber, wpmColor, accuracyColor } from '../utils/typingUtils'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['userStats'],
    queryFn: userService.getStats,
    staleTime: 60000,
  })

  const stats = data?.user || {}
  const wpmTrend = data?.wpmTrend || []
  const dailyActivity = data?.dailyActivity || []
  const keyErrors = data?.keyErrors || []

  const mainStats = [
    { label: 'Best WPM', value: stats.bestWpm || 0, icon: <Zap size={18} />, color: wpmColor(stats.bestWpm || 0), sub: 'personal record' },
    { label: 'Average WPM', value: stats.averageWpm || 0, icon: <BarChart2 size={18} />, color: 'text-blue-400', sub: 'all tests' },
    { label: 'Best Accuracy', value: `${stats.bestAccuracy || 0}%`, icon: <Target size={18} />, color: accuracyColor(stats.bestAccuracy || 0), sub: 'personal record' },
    { label: 'Total Tests', value: formatNumber(stats.totalTests || 0), icon: <Keyboard size={18} />, color: 'text-white', sub: 'completed' },
    { label: 'Typing Time', value: formatDuration(stats.totalTypingTime || 0), icon: <Clock size={18} />, color: 'text-purple-400', sub: 'total practice' },
    { label: 'Characters', value: formatNumber(stats.totalCharactersTyped || 0), icon: <TrendingUp size={18} />, color: 'text-cyan-400', sub: 'typed correctly' },
  ]

  const personalBests = [
    { label: '15s', key: 'time15' },
    { label: '30s', key: 'time30' },
    { label: '60s', key: 'time60' },
    { label: '2min', key: 'time120' },
    { label: '5min', key: 'time300' },
    { label: '10w', key: 'words10' },
    { label: '25w', key: 'words25' },
    { label: '50w', key: 'words50' },
    { label: '100w', key: 'words100' },
  ]

  // Chart data
  const chartData = wpmTrend.slice(-30).map(t => ({
    date: new Date(t.completedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    wpm: t.wpm,
    accuracy: t.accuracy,
  }))

  // Calendar heatmap (simple)
  const activityMap = {}
  dailyActivity.forEach(d => { activityMap[d._id] = d.count })

  const heatmapDays = Array.from({ length: 84 }, (_, i) => {
    const date = new Date(Date.now() - (83 - i) * 86400000)
    const key = date.toISOString().split('T')[0]
    const count = activityMap[key] || 0
    return { date, key, count }
  })

  const getHeatColor = (count) => {
    if (count === 0) return 'bg-dark-800'
    if (count < 3) return 'bg-forge-900'
    if (count < 6) return 'bg-forge-700'
    if (count < 10) return 'bg-forge-600'
    return 'bg-forge-400'
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-red-400">Failed to load dashboard. Please try again.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-dark-400 mt-1">
                Welcome back, <span className="text-forge-400 font-medium">{user?.username}</span>
              </p>
            </div>
            {/* Streak */}
            {stats.currentStreak > 0 && (
              <div className="card border-orange-500/20 bg-orange-500/5 flex items-center gap-3 py-3 px-4">
                <Flame size={24} className="text-orange-400" />
                <div>
                  <p className="text-2xl font-black text-orange-400">{stats.currentStreak}</p>
                  <p className="text-xs text-dark-500">day streak</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {mainStats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* WPM Trend Chart */}
          <div className="lg:col-span-2">
            <div className="card h-full">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-forge-400" /> WPM Progress (Last 30 Tests)
              </h3>
              {chartData.length < 2 ? (
                <EmptyState
                  icon="📈"
                  title="Not enough data"
                  description="Complete more tests to see your progress chart."
                  action={<Link to="/test" className="btn btn-primary btn-sm">Take a Test</Link>}
                />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dashWpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#7d8590', fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#7d8590', fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid #30363d', borderRadius: '12px', fontSize: 12 }}
                      labelStyle={{ color: '#7d8590' }} itemStyle={{ color: '#f97316' }} />
                    <Area type="monotone" dataKey="wpm" name="WPM" stroke="#f97316" strokeWidth={2}
                      fill="url(#dashWpmGrad)" dot={false} activeDot={{ r: 4, fill: '#f97316' }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Personal Bests */}
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-forge-400" /> Personal Bests
            </h3>
            <div className="space-y-2">
              {personalBests.map(pb => {
                const best = stats.personalBests?.[pb.key]
                return (
                  <div key={pb.key} className="flex items-center justify-between py-1.5 border-b border-dark-700/30 last:border-0">
                    <span className="text-sm text-dark-400 font-mono">{pb.label}</span>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${best?.wpm ? wpmColor(best.wpm) : 'text-dark-600'}`}>
                        {best?.wpm || '—'} {best?.wpm ? 'wpm' : ''}
                      </span>
                      {best?.accuracy > 0 && (
                        <span className="text-xs text-dark-500 ml-2">{best.accuracy}%</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="card mt-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-forge-400" /> Typing Activity (Last 12 Weeks)
          </h3>
          <div className="overflow-x-auto">
            <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, auto)', width: 'max-content' }}>
              {Array.from({ length: 12 }, (_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }, (_, dayIdx) => {
                    const globalIdx = weekIdx * 7 + dayIdx
                    const day = heatmapDays[globalIdx]
                    if (!day) return <div key={dayIdx} className="w-3 h-3" />
                    return (
                      <div
                        key={dayIdx}
                        title={`${day.key}: ${day.count} test${day.count !== 1 ? 's' : ''}`}
                        className={`w-3 h-3 rounded-sm ${getHeatColor(day.count)} transition-all hover:opacity-80`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-dark-500">
            <span>Less</span>
            {['bg-dark-800', 'bg-forge-900', 'bg-forge-700', 'bg-forge-600', 'bg-forge-400'].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Key Error Analysis */}
        {keyErrors.length > 0 && (
          <div className="card mt-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              ⌨️ Most Frequent Key Errors
            </h3>
            <div className="flex flex-wrap gap-3">
              {keyErrors.slice(0, 12).map(k => (
                <div key={k._id} className="flex flex-col items-center gap-1 bg-dark-800 rounded-xl px-4 py-3 min-w-[60px]">
                  <span className="font-mono font-bold text-xl text-red-400">{k._id}</span>
                  <span className="text-xs text-dark-500">{k.totalErrors} errors</span>
                </div>
              ))}
            </div>
            {keyErrors.length > 0 && (
              <p className="text-xs text-dark-500 mt-3">
                💡 Try practicing words containing{' '}
                <strong className="text-dark-400">
                  {keyErrors.slice(0, 3).map(k => `"${k._id}"`).join(', ')}
                </strong>
              </p>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default DashboardPage
