import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Trash2, Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import ServerAlert from '../components/ServerAlert';

export default function InterviewHistory({ setView, onSelectInterviewId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interviews, setInterviews] = useState([]);
  
  // Filter states
  const [searchRole, setSearchRole] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  
  // Delete states
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setError('');
      const res = await api.getInterviews({
        role: searchRole,
        type: filterType,
        difficulty: filterDifficulty
      });
      setInterviews(res.interviews);
    } catch (err) {
      setError(err.message || 'Failed to load history list.');
    } finally {
      setLoading(false);
    }
  }, [searchRole, filterType, filterDifficulty]);

  useEffect(() => {
    // Fetch with slight debounce on search if typed
    const delayDebounceFn = setTimeout(() => {
      fetchHistory();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    try {
      await api.deleteInterview(id);
      setDeleteConfirmId(null);
      // Refresh list
      fetchHistory();
    } catch (err) {
      setError(err.message || 'Failed to delete record.');
    }
  };

  const handleViewResult = (id) => {
    onSelectInterviewId(id);
    setView('result');
  };

  const formatType = (type) => {
    if (type === 'hr') return 'HR';
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  };

  const getScoreBadge = (sc) => {
    if (sc === null) return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    if (sc >= 80) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250/20';
    if (sc >= 60) return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-250/20';
    return 'bg-red-50 text-red-650 dark:bg-red-950/20 dark:text-red-400 border border-red-250/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Interview History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review, analyze, and manage your past practice sessions and score assessments.
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-left space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center text-red-650">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Delete Record?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This action is permanent and will delete this interview record, answers transcript, and custom study plan from database.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              placeholder="Search by target role..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="relative md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            >
              <option value="">All Types</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="hr">HR / Motivational</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="relative md:col-span-3">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
            >
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Clear Filters Indicator */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              onClick={() => {
                setSearchRole('');
                setFilterType('');
                setFilterDifficulty('');
              }}
              className="text-2xs font-semibold text-indigo-650 hover:underline dark:text-indigo-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <ServerAlert
          error={error}
          onRetry={fetchHistory}
          onDismiss={() => setError('')}
        />
      )}

      {/* Main List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-semibold text-slate-500">Querying history logs...</span>
        </div>
      ) : interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((i) => (
            <div
              key={i.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              {/* Left detail */}
              <div className="space-y-1.5 text-left">
                <div className="flex flex-wrap gap-1.5 items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{i.role}</h3>
                  <span className="inline-block px-2 py-0.5 text-4xs font-bold rounded bg-indigo-50 border border-indigo-250/20 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50 uppercase">
                    {formatType(i.interview_type)}
                  </span>
                  <span className="inline-block px-2 py-0.5 text-4xs font-bold rounded bg-slate-105 border border-slate-200 text-slate-650 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700 capitalize">
                    {i.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3 text-3xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(i.started_at).toLocaleDateString()}
                  </span>
                  <span>&middot;</span>
                  <span>{i.total_questions} Questions</span>
                </div>
              </div>

              {/* Right score / action */}
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2.5">
                  <span className={`px-3 py-1 rounded-lg text-xs font-extrabold ${getScoreBadge(i.overall_score)}`}>
                    {i.overall_score !== null ? `${i.overall_score}%` : 'In Progress'}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  {i.overall_score !== null && (
                    <button
                      onClick={() => handleViewResult(i.id)}
                      className="px-3 py-1.5 text-2xs font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/20 rounded-lg flex items-center transition-colors cursor-pointer"
                    >
                      Report
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirmId(i.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-slate-350 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No mock runs match criteria</h3>
          <p className="text-xs text-slate-450 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search criteria, clearing your filter settings, or starting a new practice run.
          </p>
        </div>
      )}

    </div>
  );
}
