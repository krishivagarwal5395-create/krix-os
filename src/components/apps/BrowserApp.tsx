import React, { useState } from 'react';
import { Compass, ArrowLeft, ArrowRight, RotateCw, Home, Search, Bookmark, ExternalLink } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://thinkpad.lenovo.com');
  const [tabs, setTabs] = useState(['ThinkPad Station', 'GitHub', 'KRIX Ecosystem']);
  const [activeTab, setActiveTab] = useState(0);

  const bookmarks = [
    { title: 'Lenovo Support', url: 'https://support.lenovo.com' },
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'Wikipedia', url: 'https://wikipedia.org' },
    { title: 'Hacker News', url: 'https://news.ycombinator.com' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Tabs Row */}
      <div className="h-9 px-2 bg-slate-950/80 border-b border-white/10 flex items-center gap-1 shrink-0 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-3 py-1 rounded-t-lg text-xs font-medium max-w-[140px] truncate transition-colors ${
              activeTab === idx
                ? 'bg-slate-800 text-white border-t border-x border-white/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Navigation Toolbar */}
      <div className="h-11 px-3 bg-slate-900 border-b border-white/10 flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1 rounded hover:bg-white/10 hover:text-white"><ArrowLeft size={15} /></button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-white"><ArrowRight size={15} /></button>
          <button className="p-1 rounded hover:bg-white/10 hover:text-white"><RotateCw size={14} /></button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        <button className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"><Bookmark size={15} /></button>
      </div>

      {/* Bookmarks bar */}
      <div className="h-7 px-3 bg-slate-950/40 border-b border-white/5 flex items-center gap-4 text-[11px] text-slate-400 overflow-x-auto shrink-0">
        {bookmarks.map((bm) => (
          <button
            key={bm.title}
            onClick={() => setUrl(bm.url)}
            className="hover:text-white truncate"
          >
            {bm.title}
          </button>
        ))}
      </div>

      {/* Web Viewport Frame */}
      <div className="flex-1 bg-slate-950 p-8 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-lg w-full text-left space-y-3">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold uppercase tracking-wider">
            <span>KRIX Web Explorer</span>
            <span className="font-mono text-slate-400">Windows 11 Engine</span>
          </div>
          <h3 className="text-base font-bold text-white">ThinkPad Knowledge Base & Web Portal</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Browsing simulated endpoint: <span className="font-mono text-blue-400">{url}</span>
          </p>
          <div className="p-3 rounded-xl bg-black/40 text-xs text-slate-400 space-y-1 font-mono">
            <div>User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) KRIX/2.4.0</div>
            <div>Connection: Secure TLS 1.3 / Wi-Fi 6E</div>
            <div>Hardware Acceleration: Intel Iris Xe Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};
