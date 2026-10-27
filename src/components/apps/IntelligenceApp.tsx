import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Volume2, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  'How do I customize my ThinkPad cooling profile in KRIX Settings?',
  'Draft an executive summary of our Windows 11 desktop transformation.',
  'What are best practices for keyboard-centric productivity on macOS and Windows?',
  'Create an automation workflow to organize my daily notes and reminders.',
];

export const IntelligenceApp: React.FC<{ initialPrompt?: string }> = ({ initialPrompt }) => {
  const { settings, openApp } = useDesktop();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: `Hello! I am KRIX Intelligence, running directly on your Lenovo ThinkPad Windows 11 workstation. I can help you draft notes, synthesize research, suggest system automations, and answer any inquiries. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.aiSpeechRate || 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();
      const assistantText = data.text || 'I processed your request successfully.';

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: 'assistant',
        text: `Error connecting with intelligence service: ${err.message || 'Offline'}. All local features are working.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>KRIX Intelligence</span>
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                gemini-3.8-flash
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Integrated ThinkPad Desktop AI Assistant</div>
          </div>
        </div>

        <button
          onClick={() => setMessages([])}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>

            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed select-text space-y-1.5 ${
                msg.sender === 'user'
                  ? 'bg-red-600 text-white shadow-md rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-white/10 shadow-lg rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Read aloud"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-2xl mr-auto items-center">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
              <Sparkles size={14} />
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/80 text-xs text-slate-400 border border-white/10">
              Reasoning with Gemini 3.8 Flash...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts if few messages */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Prompts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1 transition-colors text-left"
              >
                <span>{prompt}</span>
                <ArrowRight size={10} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-slate-950/80 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask KRIX Intelligence anything..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isLoading}
          className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white shadow-md transition-opacity"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
