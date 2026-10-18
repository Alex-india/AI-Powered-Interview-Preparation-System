import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ServerAlert from '../components/ServerAlert';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart2, Award, ClipboardList, Target } from 'lucide-react';

export default function PerformanceAnalytics({ setView }) {
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) setIsRetrying(true);
      setError('');
      const res = await api.getAnalytics();
      setAnalytics(res.analytics);
    } catch (err) {
      setError(err.message || 'Failed to load performance analytics.');
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="space-y-4 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-650 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyzing database performance history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
        <ServerAlert
          error={error}
          onRetry={() => fetchAnalytics(true)}
          onDismiss={() => setError('')}
          isRetrying={isRetrying}
        />
      </div>
    );
  }

  if (!analytics || analytics.total_completed === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
        <div className="inline-flex p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-full text-indigo-600">
          <BarChart2 className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Performance Analytics Locked</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Complete at least one practice mock interview session to unlock detailed performance grading history.
        </p>
        <button
          onClick={() => setView('setup')}
          className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
        >
          Start Your First Session
        </button>
      </div>
    );
  }

  // Format Recharts data structures
  const trendData = analytics.score_trend;
  
  const skillData = [
    { name: 'Correctness', score: analytics.skills_breakdown.correctness },
    { name: 'Relevance', score: analytics.skills_breakdown.relevance },
    { name: 'Clarity', score: analytics.skills_breakdown.clarity },
    { name: 'Completeness', score: analytics.skills_breakdown.completeness }
  ];

  // Colors for Pie Charts (Vibrant Green & Accents)
  const COLORS = ['#16a34a', '#22c55e', '#10b981', '#14b8a6', '#84cc16', '#06b6d4'];

  // Format distributions for Pie / Cell components
  const typeDistributionData = Object.entries(analytics.types_distribution).map(([type, value]) => ({
    name: type === 'hr' ? 'HR' : type.charAt(0).toUpperCase() + type.slice(1),
    value
  }));

  const roleDistributionData = Object.entries(analytics.roles_distribution).map(([role, value]) => ({
    name: role,
    value
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Analyze historical trends and skill index assessments compiled across all completed mock sessions.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Average Score', value: `${analytics.avg_score}%`, icon: Award, desc: 'Average grade index' },
          { label: 'Sessions Finished', value: analytics.total_completed, icon: ClipboardList, desc: 'Full runs completed' },
          { label: 'Answers Graded', value: analytics.total_questions_answered, icon: Target, desc: 'Individual answers' },
          { label: 'Best Run Score', value: `${analytics.best_score}%`, icon: BarChart2, desc: 'Personal records mark' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider truncate mr-1">{kpi.label}</span>
                <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">{kpi.value}</div>
                <div className="text-3xs text-slate-400 dark:text-slate-500 truncate">{kpi.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical Score Trend (Line chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Session Score Progress</h3>
            <span className="text-3xs text-slate-400">Scale (0-100%)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} tickLine={false} />
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
        </div>

        {/* Skill Breakdown (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Skill Index Breakdown</h3>
            <span className="text-3xs text-slate-400">Competency (0-100%)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    borderColor: '#475569',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="score" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Distribution Splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Practice Type distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Practice Type Distribution</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles practiced distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Practiced Roles Distribution</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
