import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Volume2, Bot, User, Trash2, ArrowRight, Waves, AlertCircle } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  'Help me customize my KRIX desktop.',
  'Give me a focused plan for today.',
  'Explain a difficult topic in simple steps.',
  'Help me organize my notes and reminders.',
];

export const IntelligenceApp: React.FC<{ initialPrompt?: string }> = ({ initialPrompt }) => {
  const { settings } = useDesktop();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Welcome to KRIX Intelligence. I can help you think, write, plan, and learn. What would you like to work on?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [modelName, setModelName] = useState('Server-configured Gemini');
  const [requestError, setRequestError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: settings.reducedMotion ? 'auto' : 'smooth' });
  }, [messages, isLoading, settings.reducedMotion]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.aiSpeechRate || 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? inputVal).trim();
    if (!text || isLoading) return;

    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: now(),
    }]);
    setInputVal('');
    setIsLoading(true);
    setRequestError(false);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : `Request failed (${res.status}). Please try again.`);
      }
      if (typeof data.text !== 'string' || !data.text.trim()) {
        throw new Error('KRIX received an empty reply. Please try again.');
      }

      if (typeof data.model === 'string') setModelName(data.model);
      setMessages((prev) => [...prev, {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.text.trim(),
        timestamp: now(),
      }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not connect to KRIX Intelligence.';
      setRequestError(true);
      setMessages((prev) => [...prev, {
        id: `e-${Date.now()}`,
        sender: 'assistant',
        text: message,
        timestamp: now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setRequestError(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#070812] font-sans text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4 py-3 backdrop-blur-2xl">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-cyan-300/20 via-violet-500/30 to-fuchsia-500/20 shadow-lg shadow-violet-950/40">
            <div className="absolute inset-1 rounded-xl border border-white/15" />
            <Sparkles size={18} className="relative text-cyan-100" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-white">KRIX Intelligence</h2>
              <span className="rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-2 py-0.5 text-[9px] text-violet-200">{modelName}</span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">Your workspace companion · Gemini-powered when configured</p>
          </div>
        </div>
        <button onClick={clearConversation} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" title="Clear conversation" aria-label="Clear conversation">
          <Trash2 size={15} />
        </button>
      </header>

      <div className="relative z-0 flex-1 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex min-h-full flex-col items-center justify-center px-5 py-8 text-center">
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="absolute inset-2 rounded-full border border-cyan-200/30 bg-gradient-to-br from-cyan-300/15 via-violet-500/20 to-fuchsia-500/20 shadow-[0_0_50px_rgba(139,92,246,0.18)]" />
              <div className="absolute inset-5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-xl" />
              <Sparkles size={29} className="relative text-cyan-100" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-white">A fresh start.</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">Ask a question, build an idea, or make a plan. Your next thought starts here.</p>
            <button onClick={() => setMessages([{ id: 'welcome-reset', sender: 'assistant', text: 'Hey, I’m here. What shall we figure out together?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])} className="mt-5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10">Start conversation</button>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${msg.sender === 'user' ? 'border-cyan-200/15 bg-cyan-300/10 text-cyan-100' : 'border-violet-200/15 bg-gradient-to-br from-violet-400/15 to-cyan-300/10 text-violet-100'}`}>
                  {msg.sender === 'user' ? <User size={15} /> : <Sparkles size={15} />}
                </div>
                <div className={`max-w-[86%] min-w-0 rounded-2xl border px-4 py-3 shadow-lg ${msg.sender === 'user' ? 'rounded-tr-md border-cyan-200/15 bg-cyan-300/[0.08]' : 'rounded-tl-md border-white/[0.09] bg-white/[0.045] backdrop-blur-xl'}`}>
                  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-100 selection:bg-violet-400/30">{msg.text}</div>
                  <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-2">
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button onClick={() => speakText(msg.text)} className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-cyan-100" title="Read aloud" aria-label="Read response aloud">
                        <Volume2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3" role="status" aria-live="polite">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-violet-200/20 bg-violet-300/10">
                  <Waves size={15} className="animate-pulse text-cyan-100" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-300">
                  <span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-200" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-fuchsia-300 [animation-delay:240ms]" /></span>
                  KRIX is thinking…
                </div>
              </div>
            )}
            {requestError && <p className="flex items-center gap-2 pl-11 text-[11px] text-amber-300"><AlertCircle size={13} /> Check the server’s Gemini configuration if this keeps happening.</p>}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {messages.length <= 1 && !isLoading && (
        <div className="relative z-10 shrink-0 border-t border-white/[0.06] px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Try asking</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PROMPT_SUGGESTIONS.map((prompt) => (
              <button key={prompt} onClick={() => handleSend(prompt)} className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-[11px] text-slate-300 transition hover:border-violet-200/20 hover:bg-violet-300/[0.08] hover:text-white">
                {prompt}<ArrowRight size={12} className="shrink-0 text-violet-200" />
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={(event) => { event.preventDefault(); void handleSend(); }} className="relative z-10 shrink-0 border-t border-white/[0.08] bg-[#090a16]/90 p-3 backdrop-blur-2xl sm:px-4">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.18)] transition focus-within:border-violet-300/30 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)]">
          <input
            type="text"
            aria-label="Message KRIX Intelligence"
            placeholder="Ask KRIX anything…"
            value={inputVal}
            onChange={(event) => setInputVal(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button type="submit" disabled={!inputVal.trim() || isLoading} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Send message">
            <Send size={15} />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-slate-600">KRIX can answer and draft content; it does not control Windows settings or run desktop actions in this web build.</p>
      </form>
    </div>
  );
};
