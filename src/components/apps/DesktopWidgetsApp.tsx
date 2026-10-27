import React from 'react';
import { LayoutGrid, CloudSun, Clock, Cpu, BatteryCharging, CheckSquare } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const DesktopWidgetsApp: React.FC = () => {
  const { reminders, openApp } = useDesktop();

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-4">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <LayoutGrid size={16} className="text-teal-400" />
          <span>KRIX Desktop Widgets Gallery</span>
        </h2>
        <p className="text-xs text-slate-400">Interactive live widgets for desktop monitoring and notification center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather Widget */}
        <div 
          onClick={() => openApp('weather')}
          className="p-4 rounded-2xl bg-gradient-to-br from-sky-600/40 to-blue-700/30 border border-sky-400/20 cursor-pointer hover:border-sky-400/50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-sky-200">ThinkPad Station</div>
              <div className="text-3xl font-bold text-white mt-1">22°C</div>
            </div>
            <CloudSun size={28} className="text-amber-300" />
          </div>
          <p className="text-xs text-sky-200/80 mt-2">Partly Cloudy · High 25° Low 16°</p>
        </div>

        {/* Battery Widget */}
        <div 
          onClick={() => openApp('systeminfo')}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-400">ThinkPad RapidCharge</div>
              <div className="text-3xl font-bold text-emerald-400 mt-1 font-mono">88%</div>
            </div>
            <BatteryCharging size={28} className="text-emerald-400" />
          </div>
          <p className="text-xs text-slate-300 mt-2">Connected to 65W AC Adapter (18m to full)</p>
        </div>

        {/* Task Widget */}
        <div 
          onClick={() => openApp('reminders')}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <CheckSquare size={16} className="text-amber-400" />
            <span>Today’s High Priority</span>
          </div>
          <div className="space-y-1 text-xs">
            {reminders.slice(0, 2).map((r) => (
              <div key={r.id} className="text-slate-300 truncate">
                • {r.title}
              </div>
            ))}
          </div>
        </div>

        {/* System CPU Widget */}
        <div 
          onClick={() => openApp('activitymonitor')}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
            <Cpu size={16} className="text-red-500" />
            <span>Intel Core i7 Utilization</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">18% Load</div>
          <div className="text-[11px] text-slate-400 mt-1">10 Cores · 32GB RAM nominal</div>
        </div>
      </div>
    </div>
  );
};
