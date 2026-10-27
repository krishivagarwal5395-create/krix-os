import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, FileText, BookOpen, Folder, Calculator, Sparkles } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { APP_REGISTRY } from '../../data/apps';
import { AppIcon } from './AppIcon';
import { evaluateExpression } from '../../utils/calculator';

export const Spotlight: React.FC = () => {
  const { 
    isSpotlightOpen, 
    toggleSpotlight, 
    openApp, 
    notes, 
    journalEntries, 
    files 
  } = useDesktop();

  const [query, setQuery] = useState('');
  const [mathResult, setMathResult] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setQuery('');
      setMathResult(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSpotlightOpen]);

  // Evaluate math if query looks like arithmetic
  useEffect(() => {
    if (/^[0-9+\-*/().\s^%eE]+$/.test(query.trim()) && /[0-9]/.test(query) && /[+\-*/^%]/.test(query)) {
      try {
        const val = evaluateExpression(query);
        setMathResult(val);
      } catch {
        setMathResult(null);
      }
    } else {
      setMathResult(null);
    }
  }, [query]);

  // Filter items
  const matchedApps = Object.values(APP_REGISTRY).filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const matchedNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const matchedJournal = journalEntries.filter((j) =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  const matchedFiles = files.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  if (!isSpotlightOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-[18vh] select-none"
      onClick={() => toggleSpotlight(false)}
    >
      <div 
        className="w-full max-w-xl bg-slate-900/90 dark:bg-slate-950/95 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search size={22} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search or calculate (e.g. 24 * 65)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-lg text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded border border-white/10">ESC</kbd>
        </div>

        {/* Results area */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
          {/* Math calculation result preview */}
          {mathResult !== null && (
            <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-300">
                <Calculator size={18} />
                <span className="text-xs uppercase font-semibold tracking-wider">Calculation</span>
              </div>
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                = {mathResult}
              </span>
            </div>
          )}

          {/* Applications Section */}
          {matchedApps.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Applications
              </div>
              <div className="space-y-0.5">
                {matchedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      openApp(app.id);
                      toggleSpotlight(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <AppIcon iconName={app.iconName} color={app.color} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                          {app.name}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {app.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {matchedNotes.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Notes
              </div>
              <div className="space-y-0.5">
                {matchedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      openApp('notes');
                      toggleSpotlight(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium text-white truncate">{note.title}</div>
                      <div className="text-xs text-slate-400 truncate">{note.preview}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Journal Entries */}
          {matchedJournal.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Journal
              </div>
              <div className="space-y-0.5">
                {matchedJournal.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      openApp('journal');
                      toggleSpotlight(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium text-white truncate">{entry.title}</div>
                      <div className="text-xs text-slate-400">{entry.date} · {entry.mood}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {matchedFiles.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Files
              </div>
              <div className="space-y-0.5">
                {matchedFiles.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      openApp('finder');
                      toggleSpotlight(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                      <Folder size={16} />
                    </div>
                    <div className="flex-1 truncate">
                      <div className="text-sm font-medium text-white truncate">{f.name}</div>
                      <div className="text-xs text-slate-400">{f.path} · {f.size}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && matchedApps.length === 0 && matchedNotes.length === 0 && mathResult === null && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-300">No results found for "{query}"</p>
              <button
                onClick={() => {
                  openApp('intelligence', { prompt: query });
                  toggleSpotlight(false);
                }}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium transition-colors"
              >
                <Sparkles size={14} />
                Ask KRIX Intelligence
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
