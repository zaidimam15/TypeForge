import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, ChevronDown, ChevronUp, Filter, Search, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import MainLayout from '../components/layout/MainLayout'
import { testService } from '../services/apiServices'
import { Spinner, EmptyState, Modal } from '../components/ui'
import { Link } from 'react-router-dom'
import { formatTime, wpmColor, accuracyColor } from '../utils/typingUtils'

const HistoryPage = () => {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ mode: '', difficulty: '', sortBy: 'completedAt', sortOrder: 'desc' })
  const [selectedTest, setSelectedTest] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['testHistory', page, filters],
    queryFn: () => testService.getHistory({ page, limit: 20, ...filters }),
    keepPreviousData: true,
  })

  const tests = data?.tests || []
  const pagination = data?.pagination || {}

  const handleDelete = async (id) => {
    if (!confirm('Delete this test result?')) return
    setDeleting(id)
    try {
      await testService.deleteTest(id)
      toast.success('Test deleted')
      refetch()
    } catch {
      toast.error('Failed to delete test')
    } finally {
      setDeleting(null)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Delete ALL test history? This cannot be undone.')) return
    try {
      await testService.clearHistory()
      toast.success('All history cleared')
      refetch()
    } catch {
      toast.error('Failed to clear history')
    }
  }

  const modeLabel = (test) => {
    if (test.mode === 'time') return `${test.duration}s`
    if (test.mode === 'words') return `${test.wordCount}w`
    return 'Custom'
  }

  const difficultyColors = {
    easy: 'text-green-400', medium: 'text-yellow-400',
    hard: 'text-orange-400', expert: 'text-red-400'
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History size={28} className="text-forge-400" />
              <h1 className="text-3xl font-bold text-white">Test History</h1>
            </div>
            {tests.length > 0 && (
              <button onClick={handleClearAll} className="btn btn-danger btn-sm">
                <Trash2 size={14} /> Clear All
              </button>
            )}
          </div>
          <p className="text-dark-400 mt-1">Your complete typing test history.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={filters.mode}
            onChange={e => { setFilters(f => ({ ...f, mode: e.target.value })); setPage(1) }}
            className="bg-dark-800 border border-dark-600 rounded-xl text-sm text-dark-200 px-3 py-2 outline-none focus:border-forge-500"
          >
            <option value="">All Modes</option>
            <option value="time">Time</option>
            <option value="words">Words</option>
            <option value="custom">Custom</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={e => { setFilters(f => ({ ...f, difficulty: e.target.value })); setPage(1) }}
            className="bg-dark-800 border border-dark-600 rounded-xl text-sm text-dark-200 px-3 py-2 outline-none focus:border-forge-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={e => {
              const [sortBy, sortOrder] = e.target.value.split('-')
              setFilters(f => ({ ...f, sortBy, sortOrder }))
            }}
            className="bg-dark-800 border border-dark-600 rounded-xl text-sm text-dark-200 px-3 py-2 outline-none focus:border-forge-500"
          >
            <option value="completedAt-desc">Newest First</option>
            <option value="completedAt-asc">Oldest First</option>
            <option value="wpm-desc">Highest WPM</option>
            <option value="accuracy-desc">Best Accuracy</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-dark-700/50 text-xs text-dark-500 uppercase tracking-wider">
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Mode</div>
            <div className="col-span-2 text-center">WPM</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-2 text-center">Errors</div>
            <div className="col-span-1"></div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : tests.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No tests yet"
              description="Complete a typing test to see your history here."
              action={<Link to="/test" className="btn btn-primary btn-sm">Take Your First Test</Link>}
            />
          ) : (
            <div className="divide-y divide-dark-700/30">
              {tests.map((test, idx) => (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-surface-2 transition-colors group ${
                    test.isPersonalBest ? 'border-l-2 border-yellow-500' : ''
                  }`}
                >
                  <div className="col-span-3 text-sm text-dark-300">
                    {new Date(test.completedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: '2-digit' })}
                    {test.isPersonalBest && <span className="ml-2 text-yellow-400 text-xs">🏆 PB</span>}
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-mono text-dark-400">{modeLabel(test)}</span>
                    <span className={`ml-2 text-xs ${difficultyColors[test.difficulty] || 'text-dark-500'}`}>
                      {test.difficulty?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`font-bold font-mono ${wpmColor(test.wpm)}`}>{test.wpm}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-sm font-medium ${accuracyColor(test.accuracy)}`}>{test.accuracy}%</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-sm ${test.errors === 0 ? 'text-green-400' : test.errors > 10 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {test.errors}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-surface-3 transition-colors"
                      title="View details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      disabled={deleting === test._id}
                      className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      {deleting === test._id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-dark-400 px-4">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="btn btn-secondary btn-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* Test Detail Modal */}
        <Modal isOpen={!!selectedTest} onClose={() => setSelectedTest(null)} title="Test Details">
          {selectedTest && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className={`text-5xl font-black font-mono ${wpmColor(selectedTest.wpm)}`}>{selectedTest.wpm}</p>
                <p className="text-sm text-dark-400 mt-1">WPM</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Raw WPM', v: selectedTest.rawWpm },
                  { l: 'Accuracy', v: `${selectedTest.accuracy}%` },
                  { l: 'Consistency', v: `${selectedTest.consistency}%` },
                  { l: 'Errors', v: selectedTest.errors },
                  { l: 'Correct Chars', v: selectedTest.correctCharacters },
                  { l: 'Keystrokes', v: selectedTest.keystrokes },
                  { l: 'Time', v: `${selectedTest.timeTaken}s` },
                  { l: 'Mode', v: modeLabel(selectedTest) },
                ].map(item => (
                  <div key={item.l} className="bg-dark-800 rounded-xl px-3 py-2.5">
                    <p className="text-xs text-dark-500">{item.l}</p>
                    <p className="text-lg font-bold text-white">{item.v}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-dark-500 text-center">
                {new Date(selectedTest.completedAt).toLocaleString()}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  )
}

export default HistoryPage
