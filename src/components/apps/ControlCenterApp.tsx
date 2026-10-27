import React from 'react';
import { Sliders, Sun, Volume2, Wifi, Bluetooth, Moon, Fan, BatteryCharging } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ControlCenterApp: React.FC = () => {
  const { settings, updateSettings, openApp } = useDesktop();

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-700 text-white">
            <Sliders size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Control Center</h2>
            <p className="text-[11px] text-slate-400">ThinkPad hardware switches and macOS quick controls</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sliders */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><Sun size={14} /> OLED Brightness</span>
              <span className="font-mono">{settings.displayBrightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={settings.displayBrightness}
              onChange={(e) => updateSettings({ displayBrightness: Number(e.target.value) })}
              className="w-full accent-red-600 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><Volume2 size={14} /> Sound Volume</span>
              <span className="font-mono">{settings.masterVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
              className="w-full accent-red-600 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* ThinkPad Thermal Profiles */}
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-red-200">
            <span className="flex items-center gap-1.5"><Fan size={14} className="text-red-500" /> ThinkPad Thermal Table</span>
            <span className="font-mono capitalize text-red-400">{settings.thinkpadCoolingProfile}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['quiet', 'balanced', 'performance'] as const).map((prof) => (
              <button
                key={prof}
                onClick={() => updateSettings({ thinkpadCoolingProfile: prof })}
                className={`py-1.5 text-xs font-medium rounded-xl capitalize transition-colors ${
                  settings.thinkpadCoolingProfile === prof ? 'bg-red-600 text-white font-bold shadow' : 'bg-white/5 text-slate-300'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><BatteryCharging size={14} className="text-emerald-400" /> RapidCharge</span>
            <input
              type="checkbox"
              checked={settings.thinkpadRapidCharge}
              onChange={(e) => updateSettings({ thinkpadRapidCharge: e.target.checked })}
              className="accent-red-600 w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
