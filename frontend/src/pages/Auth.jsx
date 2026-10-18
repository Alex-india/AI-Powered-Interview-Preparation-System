import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, KeyRound, AlertCircle, ArrowRight, Sparkles, Terminal, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function Auth({ setView, initialMode = 'login', onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');

  // Keep isLogin in sync if initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
    clearErrors();
  }, [initialMode]);

  const clearErrors = () => {
    setError('');
    setErrorDetails(null);
    setFieldErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!isLogin) {
      if (!name.trim()) {
        errors.name = 'Full name is required.';
      } else if (name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters.';
      }
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email format (e.g., yourname@example.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required.';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match. Please re-enter identical passwords.';
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      setError(firstError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await api.login(email.trim(), password);
        onAuthSuccess(data.user);
        setView('dashboard');
      } else {
        const data = await api.register(
          name.trim(),
          email.trim(),
          password,
          confirmPassword,
          targetRole,
          experienceLevel
        );
        onAuthSuccess(data.user);
        setView('dashboard');
      }
    } catch (err) {
      const msg = err.message || 'An unexpected error occurred during authentication.';
      setError(msg);

      // Analyze error message to associate with specific fields and give actionable guidance
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes('backend server is not running') || lowerMsg.includes('cannot connect') || lowerMsg.includes('unreachable')) {
        setErrorDetails({
          type: 'server_offline',
          title: 'Backend Server Offline',
          instruction: 'Run this command in a new terminal to start the backend:',
          command: 'python backend/main.py',
        });
      } else if (lowerMsg.includes('already registered')) {
        setFieldErrors((prev) => ({ ...prev, email: 'This email is already in use.' }));
        setErrorDetails({
          type: 'already_registered',
          title: 'Account Already Exists',
          message: 'An account with this email address is already registered.',
        });
      } else if (lowerMsg.includes('incorrect') || lowerMsg.includes('credentials') || lowerMsg.includes('password')) {
        setFieldErrors((prev) => ({ ...prev, password: 'Incorrect credentials. Please verify your email and password.' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200">
      <div className="relative w-full max-w-md">
        
        {/* Glow effect background */}
        <div className="absolute inset-0 -m-4 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 rounded-3xl filter blur-xl"></div>
        
        {/* Card Body */}
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 text-left space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isLogin
                ? 'Sign in to access your interview dashboard and history'
                : 'Register to start customized mock sessions and receive study plans'}
            </p>
          </div>

          {/* Validation / Server Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 rounded-xl space-y-2 text-red-700 dark:text-red-300 text-xs">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 w-full">
                  <div className="font-bold text-red-700 dark:text-red-300 text-sm">
                    {errorDetails ? errorDetails.title : (isLogin ? 'Sign In Failed' : 'Registration Failed')}
                  </div>
                  <div className="text-red-600 dark:text-red-300/90 leading-relaxed font-medium">
                    {error}
                  </div>
                </div>
              </div>

              {errorDetails?.type === 'already_registered' && (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Already created this account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      clearErrors();
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors text-center cursor-pointer"
                  >
                    Switch to Sign In →
                  </button>
                </div>
              )}

              {errorDetails?.type === 'server_offline' && (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900/50 space-y-2.5">
                  <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center">
                    <Terminal className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {errorDetails.instruction}
                  </p>
                  <code className="block px-2.5 py-1.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] select-all">
                    {errorDetails.command}
                  </code>
                  
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Retry Connection
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const demoUser = {
                          id: Date.now(),
                          name: name.trim() || 'Demo Candidate',
                          email: email.trim() || 'candidate@interviewai.local',
                          target_role: targetRole || 'Software Developer',
                          experience_level: experienceLevel || 'Fresher',
                          is_demo: true,
                        };
                        localStorage.setItem('token', 'demo-token-interviewai');
                        localStorage.setItem('user', JSON.stringify(demoUser));
                        onAuthSuccess(demoUser);
                        setView('dashboard');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-slate-700 shadow-sm transition-colors"
                    >
                      Continue in Offline Demo Mode →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-3 w-4 h-4 ${fieldErrors.name ? 'text-red-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                      if (error) setError('');
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                      fieldErrors.name
                        ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500'
                    }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 inline" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-3 w-4 h-4 ${fieldErrors.email ? 'text-red-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                    if (error) setError('');
                  }}
                  placeholder="name@domain.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                    fieldErrors.email
                      ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 inline" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-3 w-4 h-4 ${fieldErrors.password ? 'text-red-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
                    if (error) setError('');
                  }}
                  placeholder="Min 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                    fieldErrors.password
                      ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 inline" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm Password</label>
                <div className="relative">
                  <KeyRound className={`absolute left-3.5 top-3 w-4 h-4 ${fieldErrors.confirmPassword ? 'text-red-500' : 'text-slate-400'}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
                      if (error) setError('');
                    }}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none ${
                      fieldErrors.confirmPassword
                        ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20 text-red-900 dark:text-red-100 focus:ring-1 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 inline" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Target Role & Exp Level (Sign Up only) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                  >
                    <option value="Software Developer">Software Dev</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="HR Specialist">HR Specialist</option>
                    <option value="Customer Support">Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Experience</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {isLogin ? 'Sign In' : 'Register Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                clearErrors();
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
