import React, { useState } from 'react';
import { AlertCircle, RefreshCw, Copy, Check, Terminal, X, WifiOff } from 'lucide-react';

export default function ServerAlert({ error, onRetry, onDismiss, isRetrying = false }) {
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const errorStr = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';
  const lowerMsg = errorStr.toLowerCase();
  const isServerOffline =
    lowerMsg.includes('backend server is not running') ||
    lowerMsg.includes('unreachable') ||
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('networkerror') ||
    lowerMsg.includes('cannot connect');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('python backend/main.py');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = 'python backend/main.py';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="alert"
      className="w-full bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 sm:p-5 shadow-sm backdrop-blur-sm transition-all duration-200 animate-fadeIn"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Main Info */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl text-red-600 dark:text-red-400 shrink-0 mt-0.5">
            {isServerOffline ? <WifiOff className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-red-900 dark:text-red-200">
                {isServerOffline ? 'Backend Server Offline' : 'Connection Error'}
              </span>
              {isServerOffline && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-2xs font-medium bg-red-200/70 dark:bg-red-900/60 text-red-800 dark:text-red-300 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  Port 5000 Unreachable
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300/90 leading-relaxed break-words">
              {isServerOffline
                ? 'The frontend cannot reach the Flask backend at http://localhost:5000. Start the backend server to continue.'
                : errorStr}
            </p>

            {/* Quick Terminal Guide for Offline Server */}
            {isServerOffline && (
              <div className="mt-3 pt-3 border-t border-red-200/80 dark:border-red-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-2xs sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Start the backend with this command in a terminal:</span>
                </div>

                <div className="flex items-center gap-2 max-w-md">
                  <div className="flex-1 bg-slate-900 text-emerald-400 font-mono text-2xs sm:text-xs px-3 py-2 rounded-lg border border-slate-800 select-all overflow-x-auto">
                    <code>python backend/main.py</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs shrink-0 cursor-pointer"
                    title="Copy command"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-2xs">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-2xs">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Retry and Dismiss */}
        <div className="flex items-center justify-end gap-2 sm:self-start shrink-0 pt-2 sm:pt-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Retry Connection'}</span>
            </button>
          )}

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 rounded-lg hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
