import React, { useState } from 'react';
import { Grid, ExternalLink, Laptop } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { APP_REGISTRY } from '../../data/apps';
import { AppIcon } from '../desktop/AppIcon';

const WINDOWS_APPS = [
  { id: 'w1', name: 'Lenovo Vantage', executable: 'LenovoVantage.exe', bg: 'bg-red-600' },
  { id: 'w2', name: 'ThinkPad UltraNav Manager', executable: 'TPTrackPoint.exe', bg: 'bg-red-700' },
  { id: 'w3', name: 'Visual Studio Code', executable: 'Code.exe', bg: 'bg-blue-600' },
  { id: 'w4', name: 'Google Chrome', executable: 'chrome.exe', bg: 'bg-amber-600' },
  { id: 'w5', name: 'Windows Terminal (PowerShell 7)', executable: 'wt.exe', bg: 'bg-slate-800' },
];

export const AppLibraryApp: React.FC = () => {
  const { openApp, addNotification } = useDesktop();

  const launchNativeApp = (name: string, exe: string) => {
    addNotification('Windows 11 Bridge Activated', `Invoking native executable: ${exe}`, 'applibrary');
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-6">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>KRIX App Library & Windows 11 Bridge</span>
          <span className="w-2 h-2 rounded-full bg-red-600" />
        </h2>
        <p className="text-xs text-slate-400">Launch installed Lenovo ThinkPad software & manage KRIX apps</p>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
          <Laptop size={14} />
          <span>Installed Lenovo & Windows 11 Software</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {WINDOWS_APPS.map((app) => (
            <div key={app.id} className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${app.bg} text-white flex items-center justify-center font-bold text-xs`}>
                  {app.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{app.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{app.executable}</div>
                </div>
              </div>
              <button
                onClick={() => launchNativeApp(app.name, app.executable)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1"
              >
                <span>Launch</span>
                <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Grid size={14} />
          <span>All 43 KRIX Built-in Applications</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Object.values(APP_REGISTRY).map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center gap-2.5 text-left transition-all group"
            >
              <AppIcon iconName={app.iconName} color={app.color} size="xs" />
              <div className="truncate">
                <div className="text-xs font-semibold text-white group-hover:text-red-400 truncate">{app.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{app.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
