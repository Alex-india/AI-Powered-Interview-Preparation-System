import React, { useState, useEffect, useCallback } from 'react';
import { Play, ClipboardList, Target, Award, BarChart3, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import ServerAlert from '../components/ServerAlert';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard({ setView, setSelectedType, onSelectInterviewId }) {
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchDashboardData = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      }
      setError('');
      // Fetch analytics
      const analyticsRes = await api.getAnalytics();
      setData(analyticsRes.analytics);

      // Fetch recent interviews
      const interviewsRes = await api.getInterviews();
      setRecentInterviews(interviewsRes.interviews.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleQuickStart = (type) => {
    setSelectedType(type);
    setView('setup');
  };

  const handleViewResult = (id) => {
    onSelectInterviewId(id);
    setView('result');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="space-y-4 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your profile dashboard...</p>
        </div>
      </div>
    );
  }

  // Format type labels
  const formatType = (type) => {
    if (type === 'hr') return 'HR';
    if (type === 'coding') return 'Coding / DSA';
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  };

  const hasData = data && data.total_completed > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Header and Welcome */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back, {user.name || 'User'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Prepare for your next career move by reviewing your performance metrics and scheduling a practice run.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <ServerAlert
          error={error}
          onRetry={() => fetchDashboardData(true)}
          onDismiss={() => setError('')}
          isRetrying={isRetrying}
        />
      )}

      {/* Quick Start Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start a New Mock Interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[
            { type: 'coding', label: 'Coding / DSA', desc: 'Algorithms, data structures & live coding', color: 'sky' },
            { type: 'technical', label: 'Technical', desc: 'Architecture, core CS & tech concepts', color: 'indigo' },
            { type: 'behavioral', label: 'Behavioral', desc: 'Conflict resolution & leadership', color: 'violet' },
            { type: 'hr', label: 'HR / Motivation', desc: 'Company values & background', color: 'emerald' },
            { type: 'mixed', label: 'Mixed Practice', desc: 'Hybrid evaluation of all parameters', color: 'amber' }
          ].map((item) => (
            <button
              key={item.type}
              onClick={() => handleQuickStart(item.type)}
              className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md bg-slate-50/50 dark:bg-slate-950/40 text-left transition-all hover:scale-[1.01] group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:animate-ping"></span>
                <Play className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <span className="text-sm font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-500 transition-colors">{item.label}</span>
              <span className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Overview KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Average Score', value: hasData ? `${data.avg_score}%` : '--', icon: Award, desc: 'Across completed runs' },
          { label: 'Completed Runs', value: hasData ? data.total_completed : 0, icon: ClipboardList, desc: 'Completed mock tests' },
          { label: 'Questions Solved', value: hasData ? data.total_questions_answered : 0, icon: Target, desc: 'Individually graded answers' },
          { label: 'Highest Score', value: hasData ? `${data.best_score}%` : '--', icon: BarChart3, desc: 'Personal records mark' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider truncate mr-1">{kpi.label}</span>
                <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white truncate">{kpi.value}</div>
                <div className="text-3xs text-slate-400 dark:text-slate-500 truncate">{kpi.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Table Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Trend Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performance Score History</h2>
            <span className="text-2xs text-slate-450">Scale (0-100%)</span>
          </div>

          {hasData ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.score_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                      borderColor: '#475569',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '11px'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#15803d', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs italic">
              Complete your first interview to generate the history graph.
            </div>
          )}
        </div>

        {/* Recent Interviews List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Mock Sessions</h2>
          
          {recentInterviews.length > 0 ? (
            <div className="space-y-3">
              {recentInterviews.map((i) => (
                <div
                  key={i.id}
                  onClick={() => handleViewResult(i.id)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 cursor-pointer transition-all"
                >
                  <div className="space-y-0.5 text-left">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-150 max-w-[160px] truncate">{i.role}</div>
                    <div className="text-2xs text-slate-500 dark:text-slate-400">
                      {formatType(i.interview_type)} &middot; {i.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    {i.overall_score !== null ? (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        i.overall_score >= 80
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : i.overall_score >= 60
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                      }`}>
                        {i.overall_score}%
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                        In Progress
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[264px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center space-y-2">
              <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-700" />
              <div className="text-xs font-bold text-slate-700 dark:text-slate-355">No interviews recorded</div>
              <p className="text-2xs text-slate-400 dark:text-slate-500 leading-normal max-w-xs">
                You haven't conducted any practice session yet. Click Technical or Behavioral above to begin.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
