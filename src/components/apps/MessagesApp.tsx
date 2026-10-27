import React, { useState } from 'react';
import { MessageSquare, Send, Smile, Paperclip } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export const MessagesApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'them', text: 'Hey Krishiv! How is the KRIX desktop performing on your ThinkPad X1?', time: '10:14 AM' },
    { id: '2', sender: 'me', text: 'It feels incredible. The TrackPoint response and 2.8K OLED display make the macOS layout look razor sharp.', time: '10:16 AM' },
    { id: '3', sender: 'them', text: 'All 43 applications are functional! Ready for the engineering audit.', time: '10:18 AM' },
  ]);
  const [inputVal, setInputVal] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      sender: 'me',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulate friendly reply after 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `r-${Date.now()}`,
          sender: 'them',
          text: `Acknowledged: "${newMsg.text.slice(0, 30)}..." Synced via ThinkPad local bridge.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Conversation List */}
      <div className="w-60 bg-slate-950/80 border-r border-white/10 p-3 flex flex-col shrink-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-white/10">
          Conversations
        </div>
        <div className="p-2 rounded-xl bg-red-600/20 border-l-4 border-red-500 mt-2">
          <div className="text-xs font-bold text-white">ThinkPad Engineering</div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">Elena Rostova: Ready for the audit...</div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/50">
          <span className="text-xs font-bold text-white">Elena Rostova (Lenovo Hardware Liaison)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-xs ${m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none shadow'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
