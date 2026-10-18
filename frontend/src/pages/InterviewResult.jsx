import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  Compass, 
  ClipboardCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Home, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

const renderFormattedAnswer = (text) => {
  if (!text) return <span className="text-slate-400 italic">No model answer provided.</span>;
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('```')) {
      const firstLineEnd = part.indexOf('\n');
      const lang = firstLineEnd !== -1 ? part.slice(3, firstLineEnd).trim() : '';
      const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3).trim() : part.slice(3, -3).trim();
      return (
        <div key={idx} className="my-2.5 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
          {lang && (
            <div className="px-3 py-1 bg-slate-800 text-3xs font-mono text-emerald-400 border-b border-slate-700 uppercase tracking-wider font-semibold">
              {lang} Solution
            </div>
          )}
          <pre className="p-3 font-mono text-xs text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );
    }
    return (
      <div key={idx} className="whitespace-pre-wrap leading-relaxed space-y-2 text-xs text-slate-700 dark:text-slate-300">
        {part.split('\n\n').map((para, pIdx) => {
          const trimmed = para.trim();
          if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
            return (
              <h5 key={pIdx} className="font-bold text-slate-900 dark:text-white pt-2 text-xs border-b border-slate-200/50 dark:border-slate-800 pb-1">
                {trimmed.replace(/^#+\s*/, '')}
              </h5>
            );
          }
          return <p key={pIdx}>{trimmed}</p>;
        })}
      </div>
    );
  });
};

export default function InterviewResult({ setView, interviewId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [activeTabMap, setActiveTabMap] = useState({});
  const [copiedMap, setCopiedMap] = useState({});

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setError('');
        const res = await api.getInterviewDetails(interviewId);
        setData(res);
        if (res.questions && res.questions.length > 0) {
          // Open first question detail by default
          setExpandedQuestion(res.questions[0].id);
        }
        // Celebration confetti if overall score is strong (>= 80% as in Table 4.9)
        if (res?.interview?.overall_score >= 80) {
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview performance report');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="space-y-4 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Assembling final performance dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
        <div className="inline-flex p-3 bg-red-50 dark:bg-red-950/20 rounded-full text-red-650">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Report Load Failed</h2>
        <p className="text-sm text-slate-500">{error || 'Could not find details for this interview session.'}</p>
        <button
          onClick={() => setView('dashboard')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-md cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { interview, questions } = data;

  // Parse JSON safe structures
  let strengths = [];
  let weaknesses = [];
  let studyPlan = {};
  
  try {
    strengths = interview.strengths ? JSON.parse(interview.strengths) : [];
  } catch {
    strengths = interview.strengths ? interview.strengths.split(',') : [];
  }
  
  try {
    weaknesses = interview.weaknesses ? JSON.parse(interview.weaknesses) : [];
  } catch {
    weaknesses = interview.weaknesses ? interview.weaknesses.split(',') : [];
  }

  try {
    studyPlan = interview.study_plan ? JSON.parse(interview.study_plan) : {};
  } catch {
    studyPlan = {};
  }

  // Helper score range color class
  const getScoreBadge = (sc) => {
    if (sc >= 80) return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-400 border border-emerald-250/20';
    if (sc >= 60) return 'bg-amber-50 text-amber-600 dark:bg-amber-950/25 dark:text-amber-400 border border-amber-250/20';
    return 'bg-red-50 text-red-600 dark:bg-red-950/25 dark:text-red-400 border border-red-250/20';
  };

  const toggleQuestion = (qId) => {
    setExpandedQuestion(prev => (prev === qId ? null : qId));
  };

  // Calculate proxy categories based on sub answers
  let metrics = { correctness: 0, relevance: 0, clarity: 0, completeness: 0 };
  let validCount = 0;
  questions.forEach(q => {
    if (q.answer) {
      metrics.correctness += q.answer.correctness_score;
      metrics.relevance += q.answer.relevance_score;
      metrics.clarity += q.answer.clarity_score;
      metrics.completeness += q.answer.completeness_score;
      validCount++;
    }
  });

  if (validCount > 0) {
    metrics.correctness = roundScore((metrics.correctness / validCount) * 10);
    metrics.relevance = roundScore((metrics.relevance / validCount) * 10);
    metrics.clarity = roundScore((metrics.clarity / validCount) * 10);
    metrics.completeness = roundScore((metrics.completeness / validCount) * 10);
  }

  function roundScore(sc) {
    return Math.round(sc * 10) / 10;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] transition-colors duration-200">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
            <span>Interview Session #{interview.id}</span>
            <span>&middot;</span>
            <span className="capitalize">{interview.interview_type} Practice</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Assessment Report
          </h1>
        </div>

        <div className="flex space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setView('dashboard')}
            className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setView('setup')}
            className="flex-1 sm:flex-initial flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Practice Again
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Overview Block: Large Score Ring + Key Category Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Large Score Circle */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-2xs font-semibold text-slate-500 uppercase tracking-wider">Overall score</span>
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG circle gauge */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-indigo-600 dark:stroke-indigo-500 transition-all duration-1000"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="389.5"
                strokeDashoffset={389.5 - (389.5 * (interview.overall_score || 0)) / 100}
              />
            </svg>
            <div className="space-y-0.5">
              <div className="text-3xl font-black text-slate-850 dark:text-white">{interview.overall_score || 0}%</div>
              <div className="text-3xs text-slate-400">Total accuracy</div>
            </div>
          </div>
          <div className="text-3xs text-slate-450 italic leading-normal max-w-[180px]">
            *Communication confidence indicator is a proxy measurement derived from sentence construction complexity.
          </div>
        </div>

        {/* Categories grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Grading Criteria Breakdown</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Technical Correctness', val: metrics.correctness, desc: 'Factual accuracy of definitions and workflows' },
              { label: 'Prompt Relevance', val: metrics.relevance, desc: 'Directness in addressing questions asked' },
              { label: 'Syntactic Clarity', val: metrics.clarity, desc: 'Grammatical structure and clear articulation' },
              { label: 'Topic Completeness', val: metrics.completeness, desc: 'Depth of answer and details of edge cases' }
            ].map((m) => (
              <div key={m.label} className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
                  <span className="text-indigo-650 dark:text-indigo-400">{m.val}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${m.val}%` }}
                  ></div>
                </div>
                <p className="text-3xs text-slate-450 leading-normal">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Strengths & Weaknesses Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider flex items-center">
            <ClipboardCheck className="w-4.5 h-4.5 mr-2" />
            Key Strengths Identified
          </h3>
          {strengths.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-slate-650 dark:text-slate-350 list-inside list-disc">
              {strengths.map((str, i) => (
                <li key={i} className="leading-relaxed">{str}</li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 italic">No key strengths generated for this session.</div>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-amber-650 dark:text-amber-400 uppercase tracking-wider flex items-center">
            <Compass className="w-4.5 h-4.5 mr-2" />
            Identified Areas to Improve
          </h3>
          {weaknesses.length > 0 ? (
            <ul className="space-y-2.5 text-xs text-slate-650 dark:text-slate-350 list-inside list-disc">
              {weaknesses.map((weak, i) => (
                <li key={i} className="leading-relaxed">{weak}</li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 italic">No improvement items listed.</div>
          )}
        </div>

      </div>

      {/* 7-Day AI Study Roadmap */}
      {Object.keys(studyPlan).length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider flex items-center">
            <BookOpen className="w-4.5 h-4.5 mr-2 animate-bounce" />
            Personalized 7-Day Study Plan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {Object.entries(studyPlan).map(([day, task]) => (
              <div key={day} className="flex flex-col p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-left">
                <span className="text-2xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{day}</span>
                <p className="text-3xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {task}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Detailed Q&A Transcript Review</h3>
        
        <div className="space-y-3">
          {questions.map((q) => {
            const isExpanded = expandedQuestion === q.id;
            const hasAns = !!q.answer;
            const scoreVal = hasAns ? q.answer.overall_score * 10 : 0;
            const currentTab = activeTabMap[q.id] || 'ideal'; // 'ideal' | 'submission' | 'feedback'

            const getBadgeClass = (score) => {
              if (!hasAns) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700';
              if (score >= 70) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800';
              if (score >= 40) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800';
              return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800';
            };

            const getBadgeLabel = (score) => {
              if (!hasAns) return 'Skipped';
              if (score >= 70) return `Correct • ${score.toFixed(0)}%`;
              if (score >= 40) return `Partial • ${score.toFixed(0)}%`;
              return `Incorrect • ${score.toFixed(0)}%`;
            };

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleQuestion(q.id)}
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors"
                >
                  <div className="space-y-1 pr-4 text-left max-w-2xl">
                    <span className="inline-block px-2 py-0.5 text-3xs font-bold rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-500">
                      Q{q.order_number} &middot; {q.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-100 line-clamp-1 select-none">
                      {q.question_text}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 text-2xs font-bold rounded-lg ${getBadgeClass(scoreVal)}`}>
                      {getBadgeLabel(scoreVal)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Accordion Content Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10 space-y-4 animate-slide-down text-xs text-left">
                    
                    {/* Prompt Info */}
                    <div className="space-y-1.5 p-3.5 bg-slate-100/60 dark:bg-slate-850/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
                      <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-wider">Question Prompt</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question_text}</p>
                    </div>

                    {hasAns && (
                      <div className="space-y-3">
                        {/* Tab Selector */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <button
                            type="button"
                            onClick={() => setActiveTabMap(prev => ({ ...prev, [q.id]: 'ideal' }))}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentTab === 'ideal'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                            Verified Correct Answer (Sahi Answer)
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTabMap(prev => ({ ...prev, [q.id]: 'submission' }))}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentTab === 'submission'
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
                            Your Submitted Answer
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTabMap(prev => ({ ...prev, [q.id]: 'feedback' }))}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentTab === 'feedback'
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <ClipboardCheck className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                            Scores & Feedback
                          </button>
                        </div>

                        {/* TAB 1: Verified Correct Answer */}
                        {currentTab === 'ideal' && (
                          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-3 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                                Recommended Production-Grade Answer
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (q.answer.ideal_answer) {
                                    navigator.clipboard.writeText(q.answer.ideal_answer);
                                    setCopiedMap(prev => ({ ...prev, [q.id]: true }));
                                    setTimeout(() => setCopiedMap(prev => ({ ...prev, [q.id]: false })), 2000);
                                  }
                                }}
                                className="inline-flex items-center px-2 py-1 text-2xs font-semibold rounded bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                              >
                                {copiedMap[q.id] ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1 text-emerald-600" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 mr-1 text-slate-400" />
                                    Copy Answer
                                  </>
                                )}
                              </button>
                            </div>

                            <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans max-h-80 overflow-y-auto pr-1">
                              {renderFormattedAnswer(q.answer.ideal_answer)}
                            </div>
                          </div>
                        )}

                        {/* TAB 2: Candidate's Submitted Answer */}
                        {currentTab === 'submission' && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-left">
                            <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-500">
                              Your Recorded Response
                            </span>
                            <div className="max-h-72 overflow-y-auto">
                              {q.question_type === 'coding' || q.answer.user_answer.includes('```') || q.answer.user_answer.includes('def ') || q.answer.user_answer.includes('function ') || q.answer.user_answer.includes('SELECT ') ? (
                                <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                                  <code>{q.answer.user_answer.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '')}</code>
                                </pre>
                              ) : (
                                <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                  {q.answer.user_answer || '[No text recorded]'}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* TAB 3: Granular Scores & Remarks */}
                        {currentTab === 'feedback' && (
                          <div className="space-y-4">
                            {/* Score Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                              {[
                                { label: 'Correctness', val: q.answer.correctness_score },
                                { label: 'Relevance', val: q.answer.relevance_score },
                                { label: 'Clarity', val: q.answer.clarity_score },
                                { label: 'Completeness', val: q.answer.completeness_score }
                              ].map((a) => (
                                <div key={a.label} className="space-y-0.5">
                                  <div className="text-3xs font-semibold text-slate-400">{a.label}</div>
                                  <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{(a.val * 10).toFixed(0)}%</div>
                                </div>
                              ))}
                            </div>

                            {/* Detailed Feedback */}
                            <div className="space-y-1.5">
                              <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider">AI Evaluation Remarks</span>
                              <div className="p-3.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-slate-700 dark:text-slate-300 font-sans whitespace-pre-wrap">
                                {q.answer.feedback}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!hasAns && (
                      <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-700 dark:text-amber-300 italic">
                        This question was skipped without an answer.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
