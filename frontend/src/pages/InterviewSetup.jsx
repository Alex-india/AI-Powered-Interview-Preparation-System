import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  ChevronRight, 
  AlertCircle, 
  Building2, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  Layers, 
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import ServerAlert from '../components/ServerAlert';

const TOP_COMPANIES = [
  { id: 'TCS', name: 'TCS (NQT / Digital / Ninja)', tag: 'MNC', color: 'from-blue-600 to-indigo-600' },
  { id: 'Infosys', name: 'Infosys (InfyTQ / SP)', tag: 'MNC', color: 'from-blue-500 to-cyan-500' },
  { id: 'Wipro', name: 'Wipro (Elite / Turbo)', tag: 'MNC', color: 'from-purple-600 to-indigo-600' },
  { id: 'Accenture', name: 'Accenture / Cognizant', tag: 'MNC', color: 'from-violet-600 to-fuchsia-600' },
  { id: 'Amazon', name: 'Amazon (SDE & Leadership)', tag: 'Big Tech', color: 'from-amber-500 to-orange-600' },
  { id: 'Google', name: 'Google (SDE & Scalability)', tag: 'Big Tech', color: 'from-emerald-500 to-teal-600' },
  { id: 'Microsoft', name: 'Microsoft (LLD & DSA)', tag: 'Big Tech', color: 'from-sky-500 to-blue-600' },
  { id: 'General', name: 'General Tech Company', tag: 'All Companies', color: 'from-slate-600 to-slate-800' }
];

export default function InterviewSetup({ setView, selectedType, onStartInterview }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Setup Mode: 'market' (Real Company & Market Track) vs 'custom' (Custom Questions Studio)
  const [mode, setMode] = useState('market');

  // Market Track states
  const [company, setCompany] = useState('TCS');
  const [role, setRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [type, setType] = useState(selectedType || 'technical');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [count, setCount] = useState(5);
  const [experience, setExperience] = useState('Fresher');
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');

  // Custom Questions states (supports string or object { question, question_type, starter_code, test_cases })
  const [customQuestions, setCustomQuestions] = useState([
    {
      question: "Explain the 4 core pillars of OOPs with real-world project examples.",
      question_type: "technical"
    },
    {
      question: "Two Sum: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      question_type: "coding",
      starter_code: {
        python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass",
        javascript: "function twoSum(nums, target) {\n    // Write your solution here\n}",
        java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write solution\n        return new int[]{};\n    }\n}",
        cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"
      },
      test_cases: [
        { input: "nums = [2,7,11,15], target = 9", expected: "[0, 1]" },
        { input: "nums = [3,2,4], target = 6", expected: "[1, 2]" }
      ]
    },
    {
      question: "Write a SQL query to find the second highest salary from an Employee table.",
      question_type: "coding",
      starter_code: {
        sql: "-- Write your SQL query here\nSELECT \n;\n"
      },
      test_cases: [
        { input: "Employee with salaries [100, 200, 300]", expected: "200" }
      ]
    }
  ]);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('technical');
  const [newQuestionStarterCode, setNewQuestionStarterCode] = useState('');
  const [bulkQuestionsInput, setBulkQuestionsInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [showCodingModal, setShowCodingModal] = useState(false);

  // Real-time market library bank modal / explorer
  const [marketLibrary, setMarketLibrary] = useState([]);
  const [libraryFilter, setLibraryFilter] = useState('ALL');
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load real-time market question library for custom picker
    const fetchLibrary = async () => {
      try {
        setLibraryLoading(true);
        const data = await api.getMarketQuestions('ALL');
        if (data?.questions) {
          setMarketLibrary(data.questions);
        }
      } catch (err) {
        console.error('Failed to load market question library', err);
      } finally {
        setLibraryLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const getQuestionText = (q) => {
    return typeof q === 'string' ? q : q.question;
  };

  const handleAddSingleQuestion = (e) => {
    e?.preventDefault();
    if (!newQuestionInput.trim()) return;
    if (customQuestions.length >= 15) {
      setError('You can add a maximum of 15 custom questions per interview session.');
      return;
    }

    const questionObj = {
      question: newQuestionInput.trim(),
      question_type: newQuestionType,
      ...(newQuestionType === 'coding' && newQuestionStarterCode.trim() ? {
        starter_code: {
          python: newQuestionStarterCode.trim(),
          javascript: newQuestionStarterCode.trim()
        }
      } : {})
    };

    setCustomQuestions([...customQuestions, questionObj]);
    setNewQuestionInput('');
    setNewQuestionStarterCode('');
    setShowCodingModal(false);
    setError('');
  };

  const handleRemoveQuestion = (index) => {
    const updated = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updated);
  };

  const handleMoveQuestion = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= customQuestions.length) return;
    const updated = [...customQuestions];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setCustomQuestions(updated);
  };

  const handleImportBulk = () => {
    const lines = bulkQuestionsInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 5);

    if (lines.length === 0) {
      setError('Please paste at least one valid question.');
      return;
    }

    const mapped = lines.map(text => ({
      question: text,
      question_type: text.toLowerCase().includes('write a program') ||
                     text.toLowerCase().includes('write code') ||
                     text.toLowerCase().includes('implement') ||
                     text.toLowerCase().includes('write a function') ||
                     text.toLowerCase().includes('sql query')
        ? 'coding'
        : 'technical'
    }));

    const combined = [...customQuestions, ...mapped].slice(0, 15);
    setCustomQuestions(combined);
    setBulkQuestionsInput('');
    setShowBulkInput(false);
    setError('');
  };

  const handleAddFromLibrary = (libraryItem) => {
    const qText = libraryItem.question;
    const exists = customQuestions.some(q => getQuestionText(q).toLowerCase() === qText.toLowerCase());
    if (exists) {
      return; // Already added
    }
    if (customQuestions.length >= 15) {
      setError('You can select a maximum of 15 questions per session.');
      return;
    }

    const questionObj = {
      question: libraryItem.question,
      question_type: libraryItem.question_type || (libraryItem.category === 'Coding / DSA' || libraryItem.category === 'SQL' ? 'coding' : 'technical'),
      starter_code: libraryItem.starter_code || null,
      test_cases: libraryItem.test_cases || null
    };

    setCustomQuestions([...customQuestions, questionObj]);
    setError('');
  };

  const handleQuickLoadCompany = (companyId) => {
    const filtered = marketLibrary.filter(
      (q) => q.company?.toLowerCase() === companyId.toLowerCase()
    );
    if (filtered.length > 0) {
      const qObjects = filtered.slice(0, 5).map((q) => ({
        question: q.question,
        question_type: q.question_type || (q.category === 'Coding / DSA' ? 'coding' : 'technical'),
        starter_code: q.starter_code || null,
        test_cases: q.test_cases || null
      }));
      setCustomQuestions(qObjects);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetRole = role === 'Other' ? customRole.trim() : role;
    if (role === 'Other' && !customRole.trim()) {
      setError('Please specify your custom target role.');
      return;
    }

    if (mode === 'custom' && customQuestions.length === 0) {
      setError('Please add at least one question to start your custom interview.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        role: targetRole,
        interview_type: type,
        difficulty: difficulty,
        experience_level: experience,
        total_questions: mode === 'custom' ? customQuestions.length : count,
        company: company === 'General' ? '' : company,
        resume_text: resumeText,
        jd_text: jdText,
        custom_questions: mode === 'custom' ? customQuestions : [],
      };

      const res = await api.createInterview(payload);
      onStartInterview(res.interview, res.first_question);
      setView('interview');
    } catch (err) {
      setError(err.message || 'Failed to generate interview questions. Please try again.');
      setLoading(false);
    }
  };

  const filteredLibraryQuestions = marketLibrary.filter((q) => {
    let matchesCompany = true;
    if (libraryFilter === 'CODING') {
      matchesCompany = q.question_type === 'coding' || q.category === 'Coding / DSA' || q.company === 'Coding Practice';
    } else if (libraryFilter !== 'ALL') {
      matchesCompany = q.company?.toLowerCase() === libraryFilter.toLowerCase();
    }

    const matchesSearch =
      !searchQuery ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)] text-left transition-colors duration-200">
      {/* Loading Overlay */}
      {loading ? (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl animate-fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-indigo-500 animate-pulse" />
                {mode === 'custom' ? 'Configuring Your Session' : 'Generating Questions'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {mode === 'custom'
                  ? `Loading ${customQuestions.length} selected custom interview questions...`
                  : `Preparing realistic ${company} hiring questions for ${role}...`}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Configure Interview Session
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prepare with real-time MNC & Big Tech questions, or curate your own custom question set.
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/50 dark:border-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => { setMode('market'); setError(''); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center ${
                mode === 'market'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Real Company Track
            </button>
            <button
              type="button"
              onClick={() => { setMode('custom'); setError(''); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center ${
                mode === 'custom'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Custom Questions Studio
            </button>
          </div>
        </div>

        {error && (
          <ServerAlert
            error={error}
            onDismiss={() => setError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===================== SHARED ROLE & CALIBRATION ===================== */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-indigo-500" />
                Session Target & Evaluation Calibration
              </span>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {mode === 'custom' ? 'Custom Session' : `${company} Track`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500"
                >
                  <option value="Software Developer">Software Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Web Developer">Web Developer (Full Stack)</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="HR Specialist">HR Specialist</option>
                  <option value="Other">Other (Custom Entry)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Interview Type / Round</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500"
                >
                  <option value="technical">Technical Round</option>
                  <option value="coding">Hands-on Coding & DSA Round</option>
                  <option value="behavioral">Behavioral / Leadership Round</option>
                  <option value="hr">HR Round</option>
                  <option value="mixed">Mixed (Technical + HR)</option>
                </select>
              </div>
            </div>

            {role === 'Other' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Specify Role</label>
                <input
                  type="text"
                  required
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Cloud Engineer, DevOps, Product Manager"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="beginner">Beginner (Foundation)</option>
                  <option value="intermediate">Intermediate (Standard)</option>
                  <option value="advanced">Advanced (Bar Raiser)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {mode === 'custom' ? 'Selected Questions Count' : 'Number of Questions'}
                </label>
                {mode === 'custom' ? (
                  <div className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/60 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {customQuestions.length} Questions Set
                  </div>
                ) : (
                  <select
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5 Questions (~10 mins)</option>
                    <option value={10}>10 Questions (~20 mins)</option>
                    <option value={15}>15 Questions (~30 mins)</option>
                  </select>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Experience Tier</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Fresher">Fresher / College Graduate</option>
                  <option value="1-2 Years">1-2 Years (Junior)</option>
                  <option value="3-5 Years">3-5 Years (Mid-level)</option>
                  <option value="5+ Years">5+ Years (Senior)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===================== MODE 1: REAL COMPANY & MARKET TRACK ===================== */}
          {mode === 'market' && (
            <div className="space-y-5">
              {/* Company Selector Cards */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5 text-indigo-500" />
                    Target Company / MNC Interview Track
                  </label>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    Real Market Questions
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {TOP_COMPANIES.map((comp) => {
                    const isSelected = company === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setCompany(comp.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <span className="text-2xs font-bold text-slate-400 block uppercase tracking-wider">
                          {comp.tag}
                        </span>
                        <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                          {comp.id}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {comp.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resume / Job Context */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                  Resume & Custom Job Description Context (Optional)
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Paste Your Resume Skills or Projects
                    </label>
                    <textarea
                      rows={2}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="e.g. React, Python, Django, AWS, SQL, projects worked on..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Target Company Job Description / Requirements
                    </label>
                    <textarea
                      rows={2}
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="e.g. Key qualifications, tech stack requirements from job posting..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== MODE 2: CUSTOM QUESTIONS STUDIO ===================== */}
          {mode === 'custom' && (
            <div className="space-y-6">
              {/* Question list & Custom Input */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-indigo-500" />
                      Your Selected Interview Questions ({customQuestions.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Curate theory and coding questions, reorder with arrows, or pick from MNC libraries below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer self-start sm:self-auto"
                  >
                    {showBulkInput ? 'Cancel Bulk Paste' : '+ Bulk Paste Questions'}
                  </button>
                </div>

                {/* Bulk Paste Box */}
                {showBulkInput && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 animate-fade-in">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Paste questions (one per line):
                    </label>
                    <textarea
                      rows={4}
                      value={bulkQuestionsInput}
                      onChange={(e) => setBulkQuestionsInput(e.target.value)}
                      placeholder="What is the difference between a process and thread?&#10;Write a SQL query to find the second highest salary from an Employee table.&#10;Two Sum: Find two numbers that add up to target."
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-sans focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleImportBulk}
                        className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                      >
                        Import Into Session
                      </button>
                    </div>
                  </div>
                )}

                {/* Single Add Input with Question Type Toggle */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Question Format:</span>
                      <button
                        type="button"
                        onClick={() => setNewQuestionType('technical')}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                          newQuestionType === 'technical'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Theory / Verbal
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewQuestionType('coding')}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                          newQuestionType === 'coding'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Hands-on Coding & DSA
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newQuestionInput}
                      onChange={(e) => setNewQuestionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSingleQuestion();
                        }
                      }}
                      placeholder={
                        newQuestionType === 'coding'
                          ? "e.g. Reverse Linked List: Given the head of a singly linked list, reverse it and return the new head..."
                          : "e.g. Explain how virtual DOM works in React and compare it with the real DOM..."
                      }
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSingleQuestion}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Question
                    </button>
                  </div>

                  {newQuestionType === 'coding' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400">
                        Optional Starter Code Template:
                      </label>
                      <textarea
                        rows={3}
                        value={newQuestionStarterCode}
                        onChange={(e) => setNewQuestionStarterCode(e.target.value)}
                        placeholder="def solve(nums):&#10;    # candidate fills code here&#10;    pass"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Quick Presets / Shortcuts */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    Quick MNC Sets:
                  </span>
                  {['TCS', 'Infosys', 'Amazon', 'Google', 'Microsoft'].map((cId) => (
                    <button
                      key={cId}
                      type="button"
                      onClick={() => handleQuickLoadCompany(cId)}
                      className="px-2.5 py-1 rounded-lg text-2xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
                    >
                      Load {cId} Set
                    </button>
                  ))}
                </div>

                {/* Question List Items */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {customQuestions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                      <p className="text-xs font-medium">No custom questions added yet.</p>
                      <p className="text-2xs mt-1">
                        Type a question above or click any question from the real market library below.
                      </p>
                    </div>
                  ) : (
                    customQuestions.map((q, idx) => {
                      const qText = getQuestionText(q);
                      const isCoding = (typeof q === 'object' && q.question_type === 'coding') ||
                        qText.toLowerCase().includes('write a') ||
                        qText.toLowerCase().includes('implement') ||
                        qText.toLowerCase().includes('sql query');

                      return (
                        <div
                          key={idx}
                          className="flex items-start justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 transition-all gap-3"
                        >
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  isCoding
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-400'
                                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                                }`}>
                                  {isCoding ? 'Coding Challenge' : 'Theory / Verbal'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium break-words">
                                {qText}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(idx, -1)}
                              disabled={idx === 0}
                              className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-25"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={() => handleMoveQuestion(idx, 1)}
                              disabled={idx === customQuestions.length - 1}
                              className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-25"
                              title="Move Down"
                            >
                              ▼
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(idx)}
                              className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-lg transition-colors cursor-pointer"
                              title="Remove Question"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Real-time Market Question Library Picker */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-indigo-500" />
                      Pick Real Questions from Top MNCs & Big Tech
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Click any question to instantly add it to your practice interview session.
                    </p>
                  </div>

                  {/* Company & Category Filter Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {['ALL', 'CODING', 'TCS', 'Infosys', 'Wipro', 'Amazon', 'Google', 'Microsoft', 'Accenture'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setLibraryFilter(c)}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                          libraryFilter === c
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {c === 'CODING' ? '⚡ Coding Challenges' : c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search market questions by keyword (SQL, Two Sum, OOPs, Dynamic Programming...)"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Market Question Cards Grid */}
                {libraryLoading ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <svg className="animate-spin h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-semibold">Loading MNC Question Bank...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {filteredLibraryQuestions.length === 0 ? (
                      <div className="col-span-full py-8 text-center text-xs text-slate-400 italic">
                        No questions found matching your filter.
                      </div>
                    ) : (
                      filteredLibraryQuestions.map((mq) => {
                        const isAdded = customQuestions.some(
                          (q) => getQuestionText(q).toLowerCase() === mq.question.toLowerCase()
                        );
                        const isCoding = mq.question_type === 'coding' || mq.category === 'Coding / DSA' || mq.category === 'SQL';

                        return (
                          <div
                            key={mq.id}
                            className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2.5 transition-all ${
                              isAdded
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50'
                                : 'bg-slate-50/50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-2xs font-semibold mb-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 font-bold">
                                  {mq.company}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  isCoding
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                    : 'text-slate-400'
                                }`}>
                                  {isCoding ? 'Coding' : mq.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                                {mq.question}
                              </p>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => (isAdded ? null : handleAddFromLibrary(mq))}
                                disabled={isAdded}
                                className={`px-3 py-1 rounded-lg text-2xs font-bold transition-all flex items-center cursor-pointer ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white cursor-default'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    Added
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add to Session
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Start CTA Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer text-sm"
          >
            {mode === 'custom'
              ? `Start Custom Interview (${customQuestions.length} Questions)`
              : `Start ${company} Interview Session (${count} Questions)`}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
}
