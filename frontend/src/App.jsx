import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import InterviewSetup from './pages/InterviewSetup';
import MockInterview from './pages/MockInterview';
import InterviewResult from './pages/InterviewResult';
import PerformanceAnalytics from './pages/PerformanceAnalytics';
import InterviewHistory from './pages/InterviewHistory';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userString = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      return token && userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? 'dashboard' : 'landing';
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  // Active Interview Session Context
  const [activeInterview, setActiveInterview] = useState(null);
  const [firstQuestion, setFirstQuestion] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  
  // Shared config parameters
  const [selectedType, setSelectedType] = useState('technical');

  // Sync theme with body class and local storage
  useEffect(() => {
    const root = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth event listener for token expiration
  useEffect(() => {
    const handleAuthExpired = () => {
      setCurrentUser(null);
      setView('login');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleStartInterview = (interviewObj, questionObj) => {
    setActiveInterview(interviewObj);
    setFirstQuestion(questionObj);
  };

  // Router view switch logic
  const renderView = () => {
    const token = localStorage.getItem('token');
    
    // Protected view boundaries
    const protectedViews = ['dashboard', 'setup', 'interview', 'result', 'history', 'analytics', 'profile'];
    if (protectedViews.includes(view) && !token) {
      return (
        <Auth
          setView={setView}
          initialMode="login"
          onAuthSuccess={(user) => setCurrentUser(user)}
        />
      );
    }

    switch (view) {
      case 'landing':
        return <LandingPage setView={setView} currentUser={currentUser} onLogout={handleLogout} setSelectedType={setSelectedType} />;
      case 'login':
        return (
          <Auth
            key="view-login"
            setView={setView}
            initialMode="login"
            onAuthSuccess={(user) => setCurrentUser(user)}
          />
        );
      case 'register':
        return (
          <Auth
            key="view-register"
            setView={setView}
            initialMode="register"
            onAuthSuccess={(user) => setCurrentUser(user)}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            setView={setView}
            setSelectedType={setSelectedType}
            onSelectInterviewId={setSelectedInterviewId}
          />
        );
      case 'setup':
        return (
          <InterviewSetup
            setView={setView}
            selectedType={selectedType}
            onStartInterview={handleStartInterview}
          />
        );
      case 'interview':
        if (!activeInterview || !firstQuestion) {
          setView('dashboard');
          return null;
        }
        return (
          <MockInterview
            setView={setView}
            interview={activeInterview}
            firstQuestion={firstQuestion}
            onSelectInterviewId={setSelectedInterviewId}
          />
        );
      case 'result':
        return (
          <InterviewResult
            setView={setView}
            interviewId={selectedInterviewId}
          />
        );
      case 'history':
        return (
          <InterviewHistory
            setView={setView}
            onSelectInterviewId={setSelectedInterviewId}
          />
        );
      case 'analytics':
        return (
          <PerformanceAnalytics
            setView={setView}
            onSelectInterviewId={setSelectedInterviewId}
          />
        );
      case 'profile':
        return (
          <ProfileSettings
            setView={setView}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return <LandingPage setView={setView} />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors duration-200">
      <Navbar
        currentView={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderView()}
      </main>
    </div>
  );
}
