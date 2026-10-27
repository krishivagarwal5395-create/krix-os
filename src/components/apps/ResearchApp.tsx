import React, { useState } from 'react';
import { SearchCode, BookOpen, ExternalLink, Download, Sparkles } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ResearchApp: React.FC = () => {
  const { createNote, openApp } = useDesktop();
  const [query, setQuery] = useState('Operating System Ergonomics: macOS Windowing on Windows 11 Hardware');
  const [report, setReport] = useState({
    title: 'Operating System Ergonomics: macOS Windowing on Windows 11 Hardware',
    summary: 'A technical synthesis analyzing keyboard ergonomics, TrackPoint UltraNav navigation, low-latency compositor pipelining, and private local storage architectures.',
    findings: [
      '1. Latency parity: Hybrid compositing avoids X11/Wayland translation overhead by leveraging native Direct3D & Chromium compositor.',
      '2. Thermal management: ThinkPad Intelligent Cooling dynamically tunes fan curves across Quiet (15W), Balanced (28W), and Performance (45W) profiles.',
      '3. Local Data Privacy: Eliminates cloud telemetry leaks by retaining Notes and Personal Journals within encrypted local browser storage.',
    ],
    citations: [
      { title: 'Intel 13th Gen Core Architecture Whitepaper', source: 'Intel Developer Zone' },
      { title: 'ThinkPad UltraNav Hardware Specifications', source: 'Lenovo Technical Library' },
      { title: 'The Human Interface: New Directions for Designing Interactive Systems', source: 'Jef Raskin' },
    ],
  });

  const exportToNotes = () => {
    createNote('work');
    openApp('notes');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow">
            <SearchCode size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Deep Research</h2>
            <p className="text-[11px] text-slate-400">Structured synthesis with citations powered by Gemini 3.8 Flash</p>
          </div>
        </div>

        <button
          onClick={exportToNotes}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
        >
          <BookOpen size={14} />
          <span>Save to Notes</span>
        </button>
      </div>

      {/* Structured report card */}
      <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Executive Synthesis</span>
          <h3 className="text-base font-bold text-white mt-1">{report.title}</h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{report.summary}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Technical Findings</span>
          <div className="space-y-1.5 text-xs text-slate-200">
            {report.findings.map((f, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citations & Grounding Sources</span>
          <div className="space-y-1 text-xs">
            {report.citations.map((c, i) => (
              <div key={i} className="flex justify-between items-center py-1 text-slate-400">
                <span className="text-white font-medium">• {c.title}</span>
                <span className="text-[11px] font-mono text-slate-500">[{c.source}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
