import React, { useState, useEffect } from 'react';
import { Clock, AlarmClock, Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const ClockApp: React.FC = () => {
  const [tab, setTab] = useState<'world' | 'alarm' | 'stopwatch' | 'timer'>('stopwatch');
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isSwRunning, setIsSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let timer: any;
    if (isSwRunning) {
      timer = setInterval(() => setStopwatchSeconds((s) => s + 1), 100);
    }
    return () => clearInterval(timer);
  }, [isSwRunning]);

  const addLap = () => {
    setLaps((prev) => [stopwatchSeconds, ...prev]);
  };

  const resetSw = () => {
    setIsSwRunning(false);
    setStopwatchSeconds(0);
    setLaps([]);
  };

  const formatSw = (tenths: number) => {
    const mins = Math.floor(tenths / 600);
    const secs = Math.floor((tenths % 600) / 10);
    const t = tenths % 10;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${t}`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      {/* Top Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-orange-500" />
          <h2 className="text-sm font-bold text-white">KRIX Clock & Alarms</h2>
        </div>
        <div className="flex gap-1 bg-white/10 p-0.5 rounded-xl text-xs">
          {(['world', 'alarm', 'stopwatch', 'timer'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${tab === t ? 'bg-orange-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'stopwatch' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="text-5xl font-mono font-bold text-white tabular-nums tracking-widest">
            {formatSw(stopwatchSeconds)}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsSwRunning(!isSwRunning)}
              className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow"
            >
              {isSwRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
              <span>{isSwRunning ? 'Stop' : 'Start'}</span>
            </button>
            <button
              onClick={addLap}
              disabled={!isSwRunning}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs disabled:opacity-40"
            >
              Lap
            </button>
            <button
              onClick={resetSw}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          <div className="w-full max-w-xs h-36 overflow-y-auto bg-black/40 rounded-2xl p-3 border border-white/5 space-y-1 font-mono text-xs text-slate-300 divide-y divide-white/5">
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between py-1">
                <span className="text-slate-500">Lap {laps.length - idx}</span>
                <span className="text-white">{formatSw(lap)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'world' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
          {[
            { city: 'ThinkPad Local', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), offset: 'Host' },
            { city: 'London (GMT)', time: '01:22 PM', offset: '+5h' },
            { city: 'Tokyo (JST)', time: '10:22 PM', offset: '+13h' },
            { city: 'San Francisco (PST)', time: '05:22 AM', offset: '-3h' },
          ].map((c) => (
            <div key={c.city} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <div className="text-xs font-semibold text-slate-400">{c.city}</div>
              <div className="text-2xl font-bold font-mono text-white">{c.time}</div>
              <div className="text-[10px] text-orange-400 font-mono">{c.offset}</div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'alarm' || tab === 'timer') && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
          <div className="text-4xl font-mono font-bold text-white">08:00 AM</div>
          <p className="text-xs text-slate-400">ThinkPad Alarm scheduled for tomorrow morning.</p>
        </div>
      )}
    </div>
  );
};
