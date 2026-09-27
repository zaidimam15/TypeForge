import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 text-xs border border-dark-600">
        <p className="text-dark-400">Time: {label}s</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value}
            {p.dataKey === 'accuracy' ? '%' : ' WPM'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ResultCharts = ({ wpmHistory = [], accuracyHistory = [] }) => {
  // Merge and normalize data
  const data = wpmHistory.map((entry, idx) => ({
    time: entry.time,
    wpm: entry.wpm,
    accuracy: accuracyHistory[idx]?.accuracy || 100,
  }))

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-dark-500 text-sm">
        Not enough data for graph (test was too short)
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* WPM Chart */}
      <div>
        <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-forge-500" />
          WPM Over Time
        </h4>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#7d8590', fontSize: 11 }} tickLine={false} axisLine={false} unit="s" />
            <YAxis tick={{ fill: '#7d8590', fontSize: 11 }} tickLine={false} axisLine={false} width={35} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="wpm" name="WPM" stroke="#f97316" strokeWidth={2}
              fill="url(#wpmGradient)" dot={false} activeDot={{ r: 4, fill: '#f97316' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy Chart */}
      <div>
        <h4 className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          Accuracy Over Time
        </h4>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#7d8590', fontSize: 11 }} tickLine={false} axisLine={false} unit="s" />
            <YAxis domain={[80, 100]} tick={{ fill: '#7d8590', fontSize: 11 }} tickLine={false} axisLine={false} width={35} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="accuracy" name="Accuracy" stroke="#22c55e" strokeWidth={2}
              fill="url(#accGradient)" dot={false} activeDot={{ r: 4, fill: '#22c55e' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ResultCharts
