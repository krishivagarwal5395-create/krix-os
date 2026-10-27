import React, { useState } from 'react';
import { Mail, Inbox, Send, Trash2, Edit } from 'lucide-react';

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  date: string;
  body: string;
}

const SAMPLE_EMAILS: EmailItem[] = [
  {
    id: '1',
    sender: 'Lenovo ThinkPad Architecture',
    subject: 'KRIX Desktop Environment v2.4 Release Notes',
    date: '10:45 AM',
    body: 'Greetings Krishiv,\n\nThe KRIX Desktop Environment build v2.4.0 is now operating natively on your Lenovo ThinkPad X1 Carbon with Windows 11 Pro.\n\nAll 43 applications, including KRIX Notes, Journal, and System Settings, are fully persistent and local.\n\nBest,\nLenovo Systems Team',
  },
  {
    id: '2',
    sender: 'Google AI Studio',
    subject: 'Gemini 3.8 Flash Assistant Integration Active',
    date: 'Yesterday',
    body: 'Your KRIX Intelligence and Writing Assistant proxies are operational.\nEndpoints: /api/gemini/chat and /api/gemini/writing.',
  },
];

export const MailApp: React.FC = () => {
  const [emails, setEmails] = useState<EmailItem[]>(SAMPLE_EMAILS);
  const [activeEmailId, setActiveEmailId] = useState<string | null>(emails[0]?.id || null);
  const [isComposing, setIsComposing] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const activeEmail = emails.find((e) => e.id === activeEmailId) || emails[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject) return;
    const newMail: EmailItem = {
      id: `m-${Date.now()}`,
      sender: to,
      subject,
      date: 'Just now',
      body,
    };
    setEmails((prev) => [newMail, ...prev]);
    setIsComposing(false);
    setTo('');
    setSubject('');
    setBody('');
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Folders */}
      <div className="w-52 bg-slate-950/80 border-r border-white/10 p-3 space-y-4 shrink-0">
        <button
          onClick={() => setIsComposing(true)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
        >
          <Edit size={14} />
          <span>New Message</span>
        </button>

        <div className="space-y-1 text-xs">
          <div className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium flex items-center justify-between">
            <span className="flex items-center gap-2"><Inbox size={14} /> Inbox</span>
            <span className="font-mono text-[10px]">{emails.length}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
            <Send size={14} /> Sent
          </div>
          <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:bg-white/5 flex items-center gap-2">
            <Trash2 size={14} /> Trash
          </div>
        </div>
      </div>

      {/* Email List Column */}
      <div className="w-72 bg-slate-900 border-r border-white/10 flex flex-col shrink-0">
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {emails.map((e) => {
            const isSelected = activeEmail?.id === e.id;
            return (
              <div
                key={e.id}
                onClick={() => {
                  setActiveEmailId(e.id);
                  setIsComposing(false);
                }}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-600/20 border-l-4 border-blue-500' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white truncate max-w-[140px]">{e.sender}</span>
                  <span className="text-[10px] text-slate-400">{e.date}</span>
                </div>
                <div className="text-xs font-medium text-slate-200 mt-1 truncate">{e.subject}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Body or Compose Screen */}
      <div className="flex-1 flex flex-col bg-slate-950 p-6 overflow-y-auto">
        {isComposing ? (
          <form onSubmit={handleSend} className="max-w-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Draft New Message</h3>
            <input
              type="email"
              required
              placeholder="To: (e.g. colleague@thinkpad.com)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              required
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <textarea
              required
              placeholder="Message body..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-48 bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white resize-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                Send
              </button>
              <button type="button" onClick={() => setIsComposing(false)} className="text-xs text-slate-400">
                Cancel
              </button>
            </div>
          </form>
        ) : activeEmail ? (
          <div className="max-w-xl space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">{activeEmail.subject}</h3>
              <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>From: {activeEmail.sender}</span>
                <span>{activeEmail.date}</span>
              </div>
            </div>
            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text">
              {activeEmail.body}
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs">No email selected</div>
        )}
      </div>
    </div>
  );
};
