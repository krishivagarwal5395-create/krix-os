import React, { useState } from 'react';
import { Edit3, Sparkles, Copy, Check, Share2, ArrowRight } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const WritingAssistantApp: React.FC<{ initialText?: string }> = ({ initialText }) => {
  const { createNote, openApp } = useDesktop();
  const [sourceText, setSourceText] = useState(
    initialText || 'KRIX is an operating system transformation designed for Windows 11 on Lenovo ThinkPad devices, delivering the fluidity of macOS.'
  );
  const [resultText, setResultText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runTask = async (task: 'polish' | 'summarize' | 'formal' | 'concise' | 'expand') => {
    if (!sourceText.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sourceText, task }),
      });
      const data = await res.json();
      setResultText(data.result || '');
    } catch {
      setResultText(`[Refined: ${task.toUpperCase()}]\n${sourceText}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToNotes = () => {
    if (!resultText) return;
    createNote('work');
    openApp('notes');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow">
            <Edit3 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Writing Assistant</h2>
            <p className="text-[11px] text-slate-400">Refine, summarize, and polish documents with Gemini 3.8 Flash</p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5">
          {(['polish', 'summarize', 'formal', 'concise', 'expand'] as const).map((task) => (
            <button
              key={task}
              disabled={isLoading}
              onClick={() => runTask(task)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 transition-colors capitalize"
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side or Split Workbenches */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left: Input Text */}
        <div className="flex flex-col bg-slate-950/60 rounded-2xl border border-white/10 p-3.5 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Document</span>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or paste text to refine..."
            className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Right: AI Output Text */}
        <div className="flex flex-col bg-slate-950/60 rounded-2xl border border-white/10 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={13} />
              <span>Polished Result</span>
            </span>
            {resultText && (
              <div className="flex gap-2">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={sendToNotes}
                  className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300"
                >
                  <Share2 size={12} />
                  <span>Send to Notes</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-400 italic">
                <Sparkles size={14} className="animate-spin text-purple-400" />
                <span>Refining draft...</span>
              </div>
            ) : (
              resultText || <span className="text-slate-500 italic">Select an action above to see results.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
