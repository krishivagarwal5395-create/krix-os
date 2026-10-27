import React, { useState } from 'react';
import { Zap, Play, Check, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

interface ShortcutWorkflow {
  id: string;
  title: string;
  description: string;
  color: string;
  actions: string[];
}

export const ShortcutsApp: React.FC = () => {
  const { openApp, updateSettings, addNotification } = useDesktop();
  const [runningId, setRunningId] = useState<string | null>(null);

  const workflows: ShortcutWorkflow[] = [
    {
      id: 'wf-1',
      title: 'Morning Focus Routine',
      description: 'Opens Notes and Journal, sets ThinkPad cooling to quiet, and activates dark mode.',
      color: 'from-amber-500 to-orange-600',
      actions: ['Set Dark Theme', 'Open KRIX Notes', 'Open KRIX Journal', 'Set Thermal: Quiet'],
    },
    {
      id: 'wf-2',
      title: 'System Health Diagnostics',
      description: 'Runs telemetry probe, opens Activity Monitor and System Info.',
      color: 'from-red-600 to-pink-600',
      actions: ['Check Battery Health', 'Open System Information', 'Open Activity Monitor'],
    },
    {
      id: 'wf-3',
      title: 'Deep Engineering Session',
      description: 'Launches Terminal, Freeform canvas, and starts ThinkPad Performance cooling.',
      color: 'from-indigo-600 to-purple-600',
      actions: ['Open Terminal', 'Open Freeform', 'Set Thermal: Performance'],
    },
    {
      id: 'wf-4',
      title: 'Audio Focus & Soundscape',
      description: 'Opens KRIX Music and sets audio volume to 60%.',
      color: 'from-emerald-500 to-teal-600',
      actions: ['Set Master Volume 60%', 'Open KRIX Music'],
    },
  ];

  const runWorkflow = (wf: ShortcutWorkflow) => {
    setRunningId(wf.id);

    if (wf.id === 'wf-1') {
      updateSettings({ theme: 'dark', thinkpadCoolingProfile: 'quiet' });
      openApp('notes');
      openApp('journal');
    } else if (wf.id === 'wf-2') {
      openApp('systeminfo');
      openApp('activitymonitor');
    } else if (wf.id === 'wf-3') {
      updateSettings({ thinkpadCoolingProfile: 'performance' });
      openApp('terminal');
      openApp('freeform');
    } else if (wf.id === 'wf-4') {
      updateSettings({ masterVolume: 60 });
      openApp('music');
    }

    addNotification('Shortcut Executed', `Finished "${wf.title}" automation`, 'shortcuts');
    setTimeout(() => setRunningId(null), 1200);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-600 text-white shadow-md">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Shortcuts</h2>
            <p className="text-[11px] text-slate-400">Visual automation routines across the ThinkPad ecosystem</p>
          </div>
        </div>
      </div>

      {/* Grid of Workflows */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => {
          const isRunning = runningId === wf.id;

          return (
            <div
              key={wf.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${wf.color} flex items-center justify-center text-white shadow-lg`}>
                    <Zap size={20} />
                  </div>
                  <button
                    onClick={() => runWorkflow(wf)}
                    disabled={isRunning}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow ${
                      isRunning
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isRunning ? <Check size={14} /> : <Play size={14} fill="currentColor" />}
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>

                <h3 className="mt-3 text-sm font-bold text-white">{wf.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{wf.description}</p>
              </div>

              {/* Action Steps */}
              <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Automated Steps
                </div>
                {wf.actions.map((act, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-300">
                    <ArrowRight size={10} className="text-pink-400" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
