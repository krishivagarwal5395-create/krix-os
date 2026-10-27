import React, { useState } from 'react';
import { HardDrive, Trash2, PieChart, Check, ShieldCheck } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const StorageApp: React.FC = () => {
  const { trashFiles, emptyTrash, addNotification } = useDesktop();
  const [cleaned, setCleaned] = useState(false);

  const cleanCaches = () => {
    emptyTrash();
    setCleaned(true);
    addNotification('Storage Cleaned', 'Emptied trash and purged temporary render caches.', 'storage');
    setTimeout(() => setCleaned(false), 2500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-6">
      {/* Drive Overview Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-xl">
            <HardDrive size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">ThinkPad NVMe SSD (C:)</h2>
            <p className="text-xs text-slate-400">1024 GB Total · 580 GB Free on Windows 11</p>
          </div>
        </div>

        <button
          onClick={cleanCaches}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
        >
          {cleaned ? <Check size={14} className="text-emerald-400" /> : <Trash2 size={14} />}
          <span>{cleaned ? 'Caches Purged' : 'Optimize Storage'}</span>
        </button>
      </div>

      {/* Storage Breakdown Multi-bar */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-200">Volume Usage (412 GB of 1024 GB used)</span>
          <span className="font-mono text-emerald-400 font-bold">580 GB Free</span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="bg-red-600 h-full w-[25%]" title="Windows 11 OS (256 GB)" />
          <div className="bg-blue-600 h-full w-[12%]" title="Installed Software (120 GB)" />
          <div className="bg-amber-500 h-full w-[8%]" title="Personal Documents (80 GB)" />
          <div className="bg-emerald-500 h-full w-[3%]" title="KRIX Local Ecosystem (2.8 GB)" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-black/30">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-600" /> Windows 11 OS
            </div>
            <div className="text-sm font-bold text-white mt-1">256.0 GB</div>
          </div>

          <div className="p-3 rounded-xl bg-black/30">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-600" /> Installed Apps
            </div>
            <div className="text-sm font-bold text-white mt-1">120.4 GB</div>
          </div>

          <div className="p-3 rounded-xl bg-black/30">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> User Files
            </div>
            <div className="text-sm font-bold text-white mt-1">80.2 GB</div>
          </div>

          <div className="p-3 rounded-xl bg-black/30">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> KRIX Core
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-1">2.8 GB</div>
          </div>
        </div>
      </div>

      {/* Storage recommendations */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">
          Recommendations
        </h3>
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <div>
            <div className="font-semibold text-white">Empty KRIX Trash Bin</div>
            <div className="text-slate-400 text-[11px]">Recover storage from {trashFiles.length} deleted items</div>
          </div>
          <button
            onClick={emptyTrash}
            disabled={trashFiles.length === 0}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 disabled:opacity-40"
          >
            Empty Trash
          </button>
        </div>
      </div>
    </div>
  );
};
