import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Calendar as CalendarIcon, 
  Clock, 
  Cpu, 
  Bell, 
  Trash2, 
  X,
  BatteryCharging 
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const NotificationCenter: React.FC = () => {
  const { 
    isNotificationCenterOpen, 
    toggleNotificationCenter, 
    notifications, 
    clearNotifications,
    calendarEvents,
    openApp 
  } = useDesktop();

  const [weatherData, setWeatherData] = useState({
    temp: '22°C',
    condition: 'Partly Cloudy',
    high: '24°C',
    low: '16°C',
    city: 'ThinkPad Station',
  });

  const [quickNote, setQuickNote] = useState(() => {
    return localStorage.getItem('krix_quick_scratchpad') || 'Focus for today: Review KRIX desktop suite and verify all applications.';
  });

  const handleScratchpadChange = (val: string) => {
    setQuickNote(val);
    localStorage.setItem('krix_quick_scratchpad', val);
  };

  if (!isNotificationCenterOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 select-none pointer-events-auto"
      onClick={() => toggleNotificationCenter(false)}
    >
      <div 
        className="absolute top-7 right-0 bottom-0 w-84 bg-slate-900/90 dark:bg-slate-950/95 border-l border-white/10 p-4 shadow-2xl backdrop-blur-2xl text-slate-200 overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Widgets & Notifications
            </span>
          </div>
          <button 
            onClick={() => toggleNotificationCenter(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Widget 1: Live Weather Card */}
        <div 
          onClick={() => {
            openApp('weather');
            toggleNotificationCenter(false);
          }}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-600/40 to-blue-700/30 border border-sky-400/20 shadow-md cursor-pointer hover:border-sky-400/40 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-sky-200">{weatherData.city}</div>
              <div className="text-3xl font-bold text-white tracking-tight mt-1">{weatherData.temp}</div>
            </div>
            <CloudSun size={32} className="text-amber-300" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-sky-200/90">
            <span>{weatherData.condition}</span>
            <span>H: {weatherData.high} · L: {weatherData.low}</span>
          </div>
        </div>

        {/* Widget 2: ThinkPad System Telemetry Card */}
        <div 
          onClick={() => {
            openApp('activitymonitor');
            toggleNotificationCenter(false);
          }}
          className="p-3.5 rounded-2xl bg-white/10 border border-white/10 shadow-md cursor-pointer hover:bg-white/15 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Cpu size={14} className="text-red-500" />
              <span>ThinkPad Telemetry</span>
            </span>
            <span className="text-[10px] text-slate-400">Windows 11 Pro</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-black/20">
              <div className="text-[10px] text-slate-400">CPU (10 Cores)</div>
              <div className="text-sm font-semibold text-white font-mono mt-0.5">18% Load</div>
            </div>
            <div className="p-2 rounded-xl bg-black/20">
              <div className="text-[10px] text-slate-400">RAM (32 GB)</div>
              <div className="text-sm font-semibold text-white font-mono mt-0.5">11.4 GB Used</div>
            </div>
          </div>
        </div>

        {/* Widget 3: Quick Scratchpad */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-md space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
            <span>Quick Scratchpad</span>
            <span className="text-[10px] text-amber-400/80">Autosaved</span>
          </div>
          <textarea
            value={quickNote}
            onChange={(e) => handleScratchpadChange(e.target.value)}
            className="w-full h-18 bg-black/20 text-xs text-slate-200 p-2 rounded-xl resize-none border border-white/5 focus:outline-none focus:ring-1 focus:ring-amber-400"
            placeholder="Type quick thoughts..."
          />
        </div>

        {/* Widget 4: Upcoming Calendar Agenda */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Today’s Agenda</span>
            <button 
              onClick={() => {
                openApp('calendar');
                toggleNotificationCenter(false);
              }}
              className="text-red-400 hover:text-red-300 text-xs capitalize"
            >
              Open Calendar
            </button>
          </div>
          <div className="space-y-1.5">
            {calendarEvents.slice(0, 2).map((ev) => (
              <div key={ev.id} className="p-2.5 rounded-xl bg-white/10 text-xs">
                <div className="font-medium text-white">{ev.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{ev.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Recent Alerts</span>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <Trash2 size={11} />
                <span>Clear All</span>
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">No new notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-2.5 rounded-xl bg-white/10 text-xs space-y-0.5">
                  <div className="flex justify-between font-medium text-white">
                    <span>{notif.title}</span>
                    <span className="text-[10px] text-slate-400">{notif.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">{notif.body}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
