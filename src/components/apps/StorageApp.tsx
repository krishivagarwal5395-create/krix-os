import React, { useEffect, useState } from 'react';
import { HardDrive, Trash2, PieChart, Check, ShieldCheck, Info, RefreshCw } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface BrowserStorageEstimate {
  usage?: number;
  quota?: number;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const StorageApp: React.FC = () => {
  const { trashFiles, emptyTrash, addNotification } = useDesktop();
  const [cleaned, setCleaned] = useState(false);
  const [estimate, setEstimate] = useState<BrowserStorageEstimate | null>(null);
  const [estimateStatus, setEstimateStatus] = useState<'loading' | 'available' | 'unavailable'>('loading');

  const refreshEstimate = async () => {
    if (!navigator.storage?.estimate) {
      setEstimateStatus('unavailable');
      return;
    }
    setEstimateStatus('loading');
    try {
      const result = await navigator.storage.estimate();
      setEstimate({ usage: result.usage, quota: result.quota });
      setEstimateStatus('available');
    } catch {
      setEstimateStatus('unavailable');
    }
  };

  useEffect(() => {
    void refreshEstimate();
  }, []);

  const emptyKrixTrash = () => {
    if (trashFiles.length === 0) return;
    emptyTrash();
    setCleaned(true);
    addNotification('KRIX Trash emptied', 'Removed items from KRIX’s in-app trash. Your Windows Recycle Bin and files are unchanged.', 'storage');
    window.setTimeout(() => setCleaned(false), 2200);
  };

  const usagePercent = estimate?.usage && estimate?.quota
    ? Math.min(100, Math.max(0, (estimate.usage / estimate.quota) * 100))
    : 0;

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-y-auto bg-slate-950 p-5 font-sans text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-200/10 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 p-3 text-cyan-100">
            <HardDrive size={23} />
          </div>
          <div>
            <h2 className="text-base font-bold">Storage</h2>
            <p className="mt-0.5 text-xs text-slate-400">KRIX app data and in-app trash</p>
          </div>
        </div>
        <button onClick={() => void refreshEstimate()} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10">
          <RefreshCw size={13} /> Refresh
        </button>
      </header>

      <div className="flex gap-3 rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.05] p-4">
        <Info size={17} className="mt-0.5 shrink-0 text-cyan-200" />
        <p className="text-xs leading-relaxed text-slate-300">
          This is a browser app, so it cannot scan your actual C: drive or delete Windows temporary files. The estimate below is for storage used by this website’s origin, not total disk usage.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
          <PieChart size={15} /> Browser site storage
        </div>
        {estimateStatus === 'loading' ? (
          <p className="mt-4 text-sm text-slate-400">Checking browser storage estimate…</p>
        ) : estimateStatus === 'unavailable' ? (
          <p className="mt-4 text-sm text-slate-400">Your browser does not expose a storage estimate for this session.</p>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-black/20 p-4">
                <p className="text-xs text-slate-500">Estimated site usage</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{formatBytes(estimate?.usage ?? 0)}</p>
              </div>
              <div className="rounded-xl bg-black/20 p-4">
                <p className="text-xs text-slate-500">Browser-reported quota</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{estimate?.quota ? formatBytes(estimate.quota) : 'Not reported'}</p>
              </div>
            </div>
            {estimate?.quota ? (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>Estimated site storage used</span><span>{usagePercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all" style={{ width: `${usagePercent}%` }} />
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-200">
          <ShieldCheck size={15} /> KRIX in-app trash
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-white">{trashFiles.length} {trashFiles.length === 1 ? 'item' : 'items'}</p>
            <p className="mt-1 text-xs text-slate-400">Items moved to KRIX Trash. This is separate from the Windows Recycle Bin.</p>
          </div>
          <button
            onClick={emptyKrixTrash}
            disabled={trashFiles.length === 0}
            className="flex items-center gap-2 rounded-xl bg-violet-500/90 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {cleaned ? <Check size={14} /> : <Trash2 size={14} />}
            {cleaned ? 'KRIX Trash emptied' : 'Empty KRIX Trash'}
          </button>
        </div>
      </section>

      <p className="text-center text-[11px] text-slate-500">Native drive cleanup can be added only through a separately installed Windows companion with clear permissions and a confirmation step.</p>
    </div>
  );
};
