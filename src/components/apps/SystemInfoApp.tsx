import React, { useEffect, useState } from 'react';
import { Activity, Copy, Check, Monitor, Globe, ShieldCheck, Info, Wifi, WifiOff } from 'lucide-react';

interface RuntimeReport {
  appName: string;
  appVersion: string;
  environment: string;
  browser: string;
  language: string;
  timezone: string;
  screen: string;
  viewport: string;
  pixelRatio: number;
  online: boolean;
}

export const SystemInfoApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [report, setReport] = useState<RuntimeReport | null>(null);
  const [copyError, setCopyError] = useState('');

  useEffect(() => {
    const updateReport = () => {
      setReport({
        appName: 'KRIX Desktop',
        appVersion: 'Web build',
        environment: 'Browser sandbox',
        browser: navigator.userAgent,
        language: navigator.language || 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        screen: `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        pixelRatio: window.devicePixelRatio || 1,
        online: navigator.onLine,
      });
    };

    updateReport();
    window.addEventListener('resize', updateReport);
    window.addEventListener('online', updateReport);
    window.addEventListener('offline', updateReport);
    return () => {
      window.removeEventListener('resize', updateReport);
      window.removeEventListener('online', updateReport);
      window.removeEventListener('offline', updateReport);
    };
  }, []);

  const copyReport = async () => {
    if (!report) return;
    setCopyError('');
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError('Clipboard access was blocked by the browser. You can still read the details below.');
    }
  };

  const rows = report ? [
    { label: 'Application', value: report.appName },
    { label: 'Runtime', value: report.environment },
    { label: 'Browser user agent', value: report.browser },
    { label: 'Language', value: report.language },
    { label: 'Time zone', value: report.timezone },
    { label: 'Screen resolution', value: report.screen },
    { label: 'App viewport', value: report.viewport },
    { label: 'Display scale', value: `${report.pixelRatio}×` },
    { label: 'Network status', value: report.online ? 'Browser reports online' : 'Browser reports offline' },
  ] : [];

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto bg-slate-950 p-5 text-slate-100 font-sans">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/20 to-violet-600/30 text-cyan-200 shadow-lg shadow-cyan-950/30">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">System Information</h2>
            <p className="mt-0.5 text-xs text-slate-400">KRIX runtime diagnostics</p>
          </div>
        </div>
        <button
          onClick={copyReport}
          disabled={!report}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          {copied ? 'Copied report' : 'Copy report'}
        </button>
      </header>

      <div className="mt-5 flex gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-cyan-300" />
        <div>
          <h3 className="text-sm font-semibold text-white">Honest diagnostics, no guessed specs</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            This version of KRIX runs inside a browser. It can report limited browser and display details, but it cannot reliably read your actual CPU model, installed RAM, battery health, BIOS, or drive usage. Those details need a separately installed Windows companion with explicit permissions.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Monitor size={15} /> Display & app
          </div>
          {report ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-slate-500">Screen resolution</p><p className="mt-0.5 text-sm font-medium">{report.screen}</p></div>
              <div><p className="text-[11px] text-slate-500">App viewport</p><p className="mt-0.5 text-sm font-medium">{report.viewport}</p></div>
              <div><p className="text-[11px] text-slate-500">Display scale</p><p className="mt-0.5 text-sm font-medium">{report.pixelRatio}×</p></div>
            </div>
          ) : <p className="text-xs text-slate-400">Reading browser details…</p>}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Globe size={15} /> Environment
          </div>
          {report ? (
            <div className="space-y-3">
              <div><p className="text-[11px] text-slate-500">Language</p><p className="mt-0.5 text-sm font-medium">{report.language}</p></div>
              <div><p className="text-[11px] text-slate-500">Time zone</p><p className="mt-0.5 break-words text-sm font-medium">{report.timezone}</p></div>
              <div className="flex items-center gap-2">
                {report.online ? <Wifi size={15} className="text-emerald-400" /> : <WifiOff size={15} className="text-amber-400" />}
                <span className="text-sm font-medium">{report.online ? 'Browser reports online' : 'Browser reports offline'}</span>
              </div>
            </div>
          ) : <p className="text-xs text-slate-400">Reading browser details…</p>}
        </section>
      </div>

      <section className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <ShieldCheck size={15} /> Diagnostic report
        </div>
        <div className="divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[150px_1fr] sm:gap-4">
              <span className="text-xs text-slate-500">{row.label}</span>
              <span className="break-words text-xs leading-relaxed text-slate-200">{row.value}</span>
            </div>
          ))}
        </div>
        {copyError && <p role="status" className="mt-3 text-xs text-amber-300">{copyError}</p>}
      </section>
      <p className="mt-4 text-center text-[11px] text-slate-500">KRIX is a desktop-style web application today; native Windows diagnostics can be added in a future companion app.</p>
    </div>
  );
};
