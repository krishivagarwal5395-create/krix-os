import React, { useState } from 'react';
import { Key, Lock, Eye, EyeOff, Copy, Check, Plus, RefreshCw } from 'lucide-react';

interface CredentialItem {
  id: string;
  title: string;
  username: string;
  pass: string;
  url: string;
}

const SAMPLE_CREDS: CredentialItem[] = [
  { id: '1', title: 'Lenovo ID & Vantage', username: 'krishiv.thinkpad', pass: 'ThinkPad#9921_Ultra', url: 'account.lenovo.com' },
  { id: '2', title: 'GitHub Enterprise', username: 'krishiv-dev', pass: 'ghp_77xKrix90382Architecture', url: 'github.com' },
  { id: '3', title: 'Google AI Studio Workspace', username: 'krishivagarwal5395@gmail.com', pass: 'Gemini#Flash38_Secured', url: 'aistudio.google.com' },
];

export const PasswordsApp: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [credentials, setCredentials] = useState<CredentialItem[]>(SAMPLE_CREDS);
  const [visiblePassId, setVisiblePassId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      setIsUnlocked(true);
    } else {
      alert('Enter master PIN (1234)');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none items-center justify-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-700 flex items-center justify-center text-white shadow-xl">
          <Lock size={32} />
        </div>
        <h2 className="text-base font-bold text-white">Unlock KRIX Keychain Vault</h2>
        <p className="text-xs text-slate-400">Master PIN protected local storage (Default: 1234)</p>
        <form onSubmit={handleUnlock} className="flex gap-2">
          <input
            type="password"
            autoFocus
            maxLength={6}
            placeholder="PIN (1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-32 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Key size={18} className="text-cyan-400" />
          <h2 className="text-sm font-bold text-white">KRIX Passwords & Keychain</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5">
        {credentials.map((cred) => (
          <div
            key={cred.id}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-white">{cred.title}</div>
              <div className="text-[11px] text-slate-400">{cred.username} · {cred.url}</div>
              <div className="text-xs font-mono text-cyan-400 mt-1">
                {visiblePassId === cred.id ? cred.pass : '••••••••••••••••'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisiblePassId(visiblePassId === cred.id ? null : cred.id)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                {visiblePassId === cred.id ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button
                onClick={() => handleCopy(cred.id, cred.pass)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                {copiedId === cred.id ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
