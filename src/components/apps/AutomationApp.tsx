import React, { useState } from 'react';
import { Workflow, Play, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const AutomationApp: React.FC = () => {
  const { openApp, updateSettings, addNotification } = useDesktop();
  const [runningId, setRunningId] = useState<string | null>(null);

  const recipes = [
    {
      id: 'a1',
      title: 'Sync Work Notes to Daily Retrospective',
      desc: 'Compiles checklist progress from Notes into today’s Journal entry.',
      steps: ['Extract completed items', 'Append to Journal', 'Timestamp log'],
    },
    {
      id: 'a2',
      title: 'Clean Workspace & Thermal Re-calibration',
      desc: 'Minimizes idle windows, purges temporary cache, sets Balanced cooling.',
      steps: ['Recalibrate fan curve', 'Purge cache', 'Optimize RAM pressure'],
    },
    {
      id: 'a3',
      title: 'End of Day Security Lockdown',
      desc: 'Verifies encrypted local stores, locks keychain vault, and sets low power state.',
      steps: ['Lock Passwords Vault', 'Audit local storage keys', 'Prepare sleep state'],
    },
  ];

  const executeRecipe = (r: typeof recipes[0]) => {
    setRunningId(r.id);
    if (r.id === 'a1') {
      openApp('journal');
    } else if (r.id === 'a2') {
      updateSettings({ thinkpadCoolingProfile: 'balanced' });
    }
    addNotification('Automation Complete', `Executed ${r.title}`, 'automation');
    setTimeout(() => setRunningId(null), 1200);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-700 text-white shadow">
            <Workflow size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Automation Engine</h2>
            <p className="text-[11px] text-slate-400">Verified cross-application automated actions</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {recipes.map((r) => {
          const isRunning = runningId === r.id;
          return (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">{r.title}</div>
                <div className="text-[11px] text-slate-400 leading-relaxed max-w-md">{r.desc}</div>
                <div className="flex gap-3 text-[10px] text-violet-400 pt-1">
                  {r.steps.map((st, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <ArrowRight size={8} /> {st}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => executeRecipe(r)}
                disabled={isRunning}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                {isRunning ? <Check size={14} /> : <Play size={14} fill="currentColor" />}
                <span>{isRunning ? 'Done' : 'Execute'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
