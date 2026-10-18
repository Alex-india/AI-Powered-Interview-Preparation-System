import React, { useState } from 'react';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Clock, 
  Mic, 
  BarChart3, 
  Shield, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Briefcase, 
  Award, 
  Zap, 
  Building2,
  Code2,
  Users,
  Compass,
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';

export default function LandingPage({ setView, currentUser, setSelectedType }) {
  const isAuthenticated = Boolean(currentUser || localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'coding'

  const handleStartPractice = (type = 'technical') => {
    if (setSelectedType) {
      setSelectedType(type);
    }
    setView(isAuthenticated ? 'setup' : 'register');
  };

  const handleDirectSetup = (type = 'technical') => {
    if (setSelectedType) {
      setSelectedType(type);
    }
    setView('setup');
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-200 dark:border-slate-800/80">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          

          {/* Main Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Master Technical & HR Interviews with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">
                AI Deliberate Practice
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
              Experience realistic mock interviews under a 120-second timer. Dictate answers using real-time speech recognition, receive granular 4-dimensional scoring, and follow a personalized 7-day study plan.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
            <button
              onClick={() => handleStartPractice('technical')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Practice Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleDirectSetup('technical')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-4 h-4 text-indigo-500 fill-current" />
              <span>Launch Mock Session</span>
            </button>
          </div>

          {/* Key Specs Pills */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { label: '120s Question Timer', desc: 'Timed circular countdown', icon: Clock },
              { label: 'Voice & Speech Dictation', desc: 'Native browser speech API', icon: Mic },
              { label: '4-Measure Scoring', desc: 'Correctness, Clarity, Depth', icon: Award },
              { label: 'Dual AI Engines', desc: 'Gemini live & offline bank', icon: Zap }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-1 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <div className="text-3xs text-slate-500 dark:text-slate-400 truncate">{item.desc}</div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================== QUICK PRACTICE ROUND LAUNCHER ===================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Instant Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Choose Your Interview Track
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Select an interview round type below to jump directly into the interview configuration chamber.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              type: 'technical',
              title: 'Technical Round',
              desc: 'Core Computer Science, system architecture, OS, and database concepts.',
              color: 'from-blue-600 to-indigo-600',
              icon: Layers
            },
            {
              type: 'coding',
              title: 'Coding & DSA',
              desc: 'Hands-on programming, algorithms, data structures & complexity analysis.',
              color: 'from-emerald-600 to-teal-600',
              icon: Code2
            },
            {
              type: 'behavioral',
              title: 'Behavioral Round',
              desc: 'Leadership, situational questions, conflict resolution with STAR method.',
              color: 'from-violet-600 to-purple-600',
              icon: Users
            },
            {
              type: 'hr',
              title: 'HR & Motivation',
              desc: 'Self introduction, career aspirations, workplace fit, and company culture.',
              color: 'from-amber-500 to-orange-600',
              icon: Compass
            },
            {
              type: 'mixed',
              title: 'Mixed Practice',
              desc: 'Comprehensive multi-parameter practice combining technical and behavioral.',
              color: 'from-rose-500 to-pink-600',
              icon: Sparkles
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.type}
                onClick={() => handleDirectSetup(item.type)}
                className="group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between text-left hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-2xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-2xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Start Round</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================== 4-STEP WORKFLOW (PDF Section 5.2.1 & Figure 5.1) ===================== */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              System Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Interview Journey in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              How candidate input is turned into timed questions, instant evaluations, and customized study plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Session Configuration',
                desc: 'Select from 9 supported roles or type a custom domain. Choose round type, difficulty level, 5/10/15 question counts, and optional resume and JD tailoring.',
                icon: Briefcase
              },
              {
                step: '02',
                title: 'Timed Interview Chamber',
                desc: 'Face one question at a time with a 120-second circular SVG countdown. Listen to questions read aloud via Web Speech synthesis and dictate answers using microphone speech-to-text.',
                icon: Clock
              },
              {
                step: '03',
                title: 'Four-Measure Evaluation',
                desc: 'Every submitted answer is immediately scored across 4 dimensions: Correctness, Relevance, Clarity, and Completeness (Eq 3.1), with feedback and an ideal answer.',
                icon: Award
              },
              {
                step: '04',
                title: '7-Day Study Roadmap',
                desc: 'On completion, receive your overall percentage, identified key strengths, target areas to improve, and a personalized 7-day study plan stored in your persistent history.',
                icon: BookOpen
              }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{s.step}</span>
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================== 9 SUPPORTED ROLES GRID (PDF Section 1.5 & 4.8.4) ===================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Domain Coverage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Supported Job Roles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Nine job roles provided with curated questions and AI prompt tailoring. Click any role to configure practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { role: 'Software Developer', desc: 'Operating systems, memory allocation, multi-threading, databases, and OOP architecture.' },
            { role: 'Python Developer', desc: 'Decorators, generators, asyncio, GIL mechanics, typing, and standard library internals.' },
            { role: 'Java Developer', desc: 'JVM memory model, garbage collection, multithreading, Spring Boot, and microservices.' },
            { role: 'Web Developer (Full Stack)', desc: 'DOM, React component lifecycle, REST APIs, CSS layouts, Node.js event loop, and caching.' },
            { role: 'Data Analyst', desc: 'SQL window functions, indexing, ETL pipelines, outlier detection, and hypothesis testing.' },
            { role: 'Data Scientist', desc: 'Regression, classification, feature engineering, loss functions, and model validation.' },
            { role: 'UI/UX Designer', desc: 'Design systems, WCAG 2.1 AA accessibility, heuristics, and user journey workflows.' },
            { role: 'HR Specialist', desc: 'Workplace culture, behavioral conflict resolution, team onboarding, and recruitment pipelines.' },
            { role: 'Other (Custom Role)', desc: 'Type any custom position with optional Job Description to calibrate questions dynamically.' }
          ].map((item) => (
            <div
              key={item.role}
              onClick={() => handleDirectSetup('technical')}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.role}
                </span>
                <span className="text-3xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Ready
                </span>
              </div>
              <p className="text-2xs text-slate-500 dark:text-slate-400 leading-normal">
                {item.desc}
              </p>
              <div className="pt-1 flex items-center gap-1 text-2xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Configure Role</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SAMPLE 4-MEASURE GRADING CARD (PDF Section 5.3 & Fig 5.3) ===================== */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Objective Grading
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Instant 4-Measure Evaluation Card
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Every answer is evaluated across 4 academic criteria based on Equation 3.1: Sq = (C + R + L + P) / 4.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-2xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 mr-2">
                  Question 1 of 5
                </span>
                <span className="text-xs text-slate-500">Software Developer &middot; Technical Round</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Question Score:</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border border-emerald-200 dark:border-emerald-900/30">
                  8.5 / 10 (85%)
                </span>
              </div>
            </div>

            {/* Question & Answer */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">Question Prompt</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Explain the difference between a process and a thread, and when to use multi-threading over multi-processing.
                </h4>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">Candidate Submitted Answer</span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  "A process is an executing instance of a program with its own private virtual memory address space. A thread is a lightweight unit of execution within a process that shares memory and file descriptors with peer threads. Use multi-threading for I/O-bound tasks where fast context switching and shared state are vital; use multi-processing for CPU-bound tasks to bypass language locks and provide fault isolation."
                </div>
              </div>
            </div>

            {/* 4 Dimension Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Correctness', score: '8.5 / 10', pct: '85%', desc: 'Factual precision of memory isolation vs shared heap' },
                { label: 'Relevance', score: '9.0 / 10', pct: '90%', desc: 'Directly addressed definitions and selection criteria' },
                { label: 'Clarity', score: '8.0 / 10', pct: '80%', desc: 'Structured logical explanation and concise terminology' },
                { label: 'Completeness', score: '8.5 / 10', pct: '85%', desc: 'Covered virtual address spaces, context switching & CPU/IO trade-offs' }
              ].map((m) => (
                <div key={m.label} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{m.score}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: m.pct }} />
                  </div>
                  <div className="text-3xs text-slate-500 dark:text-slate-400">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Feedback & Model Answer */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Evaluator Feedback
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Strong definition of virtual memory spaces and context-switching overhead. To reach top percentile, mention IPC overheads and race condition synchronization primitives like mutexes.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Model Ideal Answer
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "Processes represent autonomous OS execution units with isolated page tables. Threads share the parent process's heap and open handles while retaining distinct stack pointers and registers. Multi-threading minimizes context-switch latency; multi-processing utilizes multi-core hardware safely without shared-state memory corruption."
                </p>
              </div>
            </div>

            {/* CTA inside card */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDirectSetup('technical')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Try Live Practice Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ===================== FINAL CALL TO ACTION ===================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white space-y-6 shadow-xl shadow-indigo-600/20">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Placement Preparation?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto leading-relaxed">
            Create your account in seconds, select your target role, and experience structured interview simulation with instant feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleStartPractice('technical')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-600 hover:bg-slate-100 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start Practice Free →
            </button>
            <button
              onClick={() => setView('login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white/10 font-semibold text-sm transition-colors cursor-pointer"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* ===================== PLATFORM FOOTER ===================== */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
        <div className="flex items-center justify-center space-x-2 font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>InterviewAI &mdash; Intelligent Mock Interview & Analytics Platform</span>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-[11px]">
          &copy; {new Date().getFullYear()} InterviewAI. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
