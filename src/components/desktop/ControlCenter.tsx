import React from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  Keyboard, 
  Share2, 
  Fan, 
  BatteryCharging, 
  Sliders 
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ControlCenter: React.FC = () => {
  const { isControlCenterOpen, toggleControlCenter, settings, updateSettings, openApp } = useDesktop();

  if (!isControlCenterOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 select-none pointer-events-auto"
      onClick={() => toggleControlCenter(false)}
    >
      <div 
        className="absolute top-9 right-3 w-80 rounded-2xl bg-slate-900/90 dark:bg-slate-950/95 border border-white/15 p-4 shadow-2xl backdrop-blur-2xl text-slate-200 space-y-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Control Center</span>
          <button 
            onClick={() => {
              openApp('settings');
              toggleControlCenter(false);
            }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Preferences
          </button>
        </div>

        {/* Top 2x2 Grid of Quick Toggles */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wi-Fi */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-blue-500 text-white">
              <Wifi size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Wi-Fi 6E</div>
              <div className="text-[10px] text-slate-400 truncate">ThinkPad-Net</div>
            </div>
          </div>

          {/* Bluetooth */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-blue-600 text-white">
              <Bluetooth size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Bluetooth</div>
              <div className="text-[10px] text-slate-400 truncate">UltraNav Mouse</div>
            </div>
          </div>

          {/* QuickShare / AirDrop */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-indigo-500 text-white">
              <Share2 size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">QuickShare</div>
              <div className="text-[10px] text-slate-400 truncate">Contacts Only</div>
            </div>
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 flex items-center gap-2.5 text-left transition-colors"
          >
            <div className="p-2 rounded-full bg-purple-500 text-white">
              <Moon size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Appearance</div>
              <div className="text-[10px] text-slate-400 capitalize">{settings.theme}</div>
            </div>
          </button>
        </div>

        {/* Display Brightness Slider */}
        <div className="p-3 rounded-xl bg-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sun size={14} />
              <span>OLED Display</span>
            </div>
            <span className="font-mono text-slate-400">{settings.displayBrightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.displayBrightness}
            onChange={(e) => updateSettings({ displayBrightness: Number(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>

        {/* Master Sound Volume Slider */}
        <div className="p-3 rounded-xl bg-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Volume2 size={14} />
              <span>Sound Output</span>
            </div>
            <span className="font-mono text-slate-400">{settings.masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.masterVolume}
            onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
            className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>

        {/* Lenovo ThinkPad Dedicated Hardware Profile */}
        <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-red-200">
            <div className="flex items-center gap-1.5">
              <Fan size={14} className="text-red-400 animate-spin-slow" />
              <span>ThinkPad Thermal Profile</span>
            </div>
            <span className="capitalize text-[11px] font-mono text-red-400">
              {settings.thinkpadCoolingProfile}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 pt-1">
            {(['quiet', 'balanced', 'performance'] as const).map((profile) => (
              <button
                key={profile}
                onClick={() => updateSettings({ thinkpadCoolingProfile: profile })}
                className={`py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                  settings.thinkpadCoolingProfile === profile
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {profile}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <BatteryCharging size={12} className="text-emerald-400" />
              <span>RapidCharge (80% in 60m)</span>
            </span>
            <input
              type="checkbox"
              checked={settings.thinkpadRapidCharge}
              onChange={(e) => updateSettings({ thinkpadRapidCharge: e.target.checked })}
              className="accent-red-600 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
