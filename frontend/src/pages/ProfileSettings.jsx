import React, { useState } from 'react';
import { User, ShieldAlert, AlertCircle, Save, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import ServerAlert from '../components/ServerAlert';

export default function ProfileSettings({ theme, toggleTheme }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Input states
  const [name, setName] = useState(user.name || '');
  const [targetRole, setTargetRole] = useState(user.target_role || 'Software Developer');
  const [experienceLevel, setExperienceLevel] = useState(user.experience_level || 'Student');

  // Danger zone modal triggers
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      await api.updateProfile({
        name,
        target_role: targetRole,
        experience_level: experienceLevel
      });
      setSuccess('Profile details updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setLoading(true);
    setError('');
    try {
      await api.deleteInterview();
      setShowClearHistoryModal(false);
      setSuccess('All practice history cleared successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to clear interview records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-left bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile & Preferences</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details, target application specifications, and application preferences.
        </p>
      </div>

      {/* Clear History Modal */}
      {showClearHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-left space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center text-red-650">
              <ShieldAlert className="w-5 h-5 mr-2 text-red-500" />
              Wipe Practice History?
            </h3>
            <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
              This action is permanent. All completed interview records, answers transcript history, strengths assessments, and daily study plans will be wiped from database records.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowClearHistoryModal(false)}
                className="flex-1 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-2 text-xs font-semibold bg-red-650 hover:bg-red-700 text-white rounded-xl"
              >
                Confirm Wipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Notifications */}
      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 rounded-xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs animate-fade-in">
          <CheckCircle className="w-4.5 h-4.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <ServerAlert
          error={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
          <User className="w-4.5 h-4.5 mr-2 text-indigo-500" />
          General Account Details
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Email Address (disabled) */}
            <div className="space-y-1.5 opacity-60">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-405">Email (Cannot be modified)</label>
              <input
                type="email"
                disabled
                value={user.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Default Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="HR Specialist">HR Specialist</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            {/* Experience level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-650 dark:text-slate-400">Default Experience Tier</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
              >
                <option value="Student">Student</option>
                <option value="Fresher">Fresher / Graduate</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-6 py-2.5 bg-indigo-650 text-white hover:bg-indigo-700 rounded-xl font-semibold shadow-md shadow-indigo-600/20 text-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile Details
          </button>
        </form>
      </div>

      {/* Theme preferences card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Interface Display</h3>
        
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">System Theme Layout</div>
            <p className="text-3xs text-slate-500 dark:text-slate-400">Toggle dark mode interface styling for optimization</p>
          </div>
          
          <button
            onClick={toggleTheme}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-2xs font-bold hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors capitalize"
          >
            Switch to {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/40 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Danger Actions Zone</h3>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 gap-4">
          <div className="space-y-0.5 text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Delete Practice Sessions History</div>
            <p className="text-3xs text-slate-500 dark:text-slate-400">Wipe all mock sessions history and statistics. This cannot be undone.</p>
          </div>
          
          <button
            onClick={() => setShowClearHistoryModal(true)}
            className="px-4 py-2 border border-red-200 dark:border-red-950/30 text-red-650 dark:text-red-400 dark:hover:bg-red-950/20 hover:bg-red-50 rounded-xl text-2xs font-bold transition-colors"
          >
            Wipe Database Logs
          </button>
        </div>
      </div>

    </div>
  );
}
