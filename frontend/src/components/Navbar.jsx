import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Briefcase, BarChart2, History, User, LogOut, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ currentView, setView, theme, toggleTheme, currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = currentUser || (() => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  })();
  const isAuthenticated = Boolean(currentUser || localStorage.getItem('token'));

  const handleNav = (viewName) => {
    setView(viewName);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      api.logout();
    }
  };

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', view: 'dashboard', icon: Briefcase },
        { name: 'Practice', view: 'setup', icon: User },
        { name: 'History', view: 'history', icon: History },
        { name: 'Analytics', view: 'analytics', icon: BarChart2 },
        { name: 'Profile', view: 'profile', icon: User },
      ]
    : [
        { name: 'Home', view: 'landing', icon: Briefcase },
      ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'landing')}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <span className="ml-3 font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              Interview<span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1 text-sm uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.view)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.name}
                </button>
              );
            })}
          </div>

          {/* Actions (Theme toggle + Login/Logout) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                  Hi, {user?.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 text-sm font-semibold transition-all hover:scale-[1.02] cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNav(link.view)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.name}
                </button>
              );
            })}
            
            {isAuthenticated ? (
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 px-4 space-y-3">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Logged in as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-950/20 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 px-2 space-y-2 flex flex-col">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full px-4 py-2.5 text-center border border-slate-200 rounded-lg text-slate-700 dark:border-slate-700 dark:text-slate-300 text-sm font-medium cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full px-4 py-2.5 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
