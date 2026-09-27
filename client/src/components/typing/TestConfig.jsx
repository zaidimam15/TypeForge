import { useState } from 'react'
import { Clock, Hash, Edit, ChevronDown } from 'lucide-react'
import { TIME_OPTIONS, WORD_OPTIONS, CATEGORIES, DIFFICULTIES } from '../../data/wordLists'

const TestConfig = ({ config, onChange, disabled }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { mode, duration, wordCount, difficulty, category } = config

  return (
    <div className="space-y-4">
      {/* Mode Tabs */}
      <div className="flex items-center justify-center gap-1 bg-dark-800 rounded-xl p-1 w-fit mx-auto">
        {[
          { value: 'time', label: 'Time', icon: <Clock size={14} /> },
          { value: 'words', label: 'Words', icon: <Hash size={14} /> },
          { value: 'custom', label: 'Custom', icon: <Edit size={14} /> },
        ].map(m => (
          <button
            key={m.value}
            disabled={disabled}
            onClick={() => onChange({ mode: m.value })}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
              mode === m.value
                ? 'bg-forge-500 text-white shadow-glow-orange'
                : 'text-dark-400 hover:text-white'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Duration / Word Count Options */}
      {mode === 'time' && (
        <div className="flex items-center justify-center flex-wrap gap-2">
          {TIME_OPTIONS.map(t => (
            <button
              key={t}
              disabled={disabled}
              onClick={() => onChange({ duration: t })}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                duration === t
                  ? 'bg-forge-500/20 text-forge-400 border border-forge-500/40'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      )}

      {mode === 'words' && (
        <div className="flex items-center justify-center flex-wrap gap-2">
          {WORD_OPTIONS.map(w => (
            <button
              key={w}
              disabled={disabled}
              onClick={() => onChange({ wordCount: w })}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                wordCount === w
                  ? 'bg-forge-500/20 text-forge-400 border border-forge-500/40'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {/* Advanced Options Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-dark-500 hover:text-dark-300 transition-colors"
        >
          <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          {showAdvanced ? 'Hide' : 'More'} options
        </button>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-dark-700/40">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-500 uppercase tracking-wider">Difficulty:</span>
            <div className="flex gap-1">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  disabled={disabled}
                  onClick={() => onChange({ difficulty: d.value })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                    difficulty === d.value
                      ? `${d.color} bg-dark-700 border border-dark-500`
                      : 'text-dark-500 hover:text-dark-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-500 uppercase tracking-wider">Category:</span>
            <select
              value={category}
              disabled={disabled}
              onChange={e => onChange({ category: e.target.value })}
              className="bg-dark-800 border border-dark-600 rounded-lg text-xs text-dark-200 px-2 py-1 outline-none focus:border-forge-500 disabled:opacity-50"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestConfig
