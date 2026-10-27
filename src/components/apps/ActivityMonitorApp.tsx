import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Search, XCircle, RefreshCw } from 'lucide-react';

interface ProcessItem {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
  user: string;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 104, name: 'KRIX Window Compositor', cpu: 4.2, memory: '184 MB', user: 'system' },
  { pid: 212, name: 'KRIX Notes Engine', cpu: 0.8, memory: '92 MB', user: 'thinkpad' },
  { pid: 310, name: 'Lenovo UltraNav Driver', cpu: 0.1, memory: '34 MB', user: 'kernel' },
  { pid: 418, name: 'Intel Iris Xe GPU Server', cpu: 2.1, memory: '240 MB', user: 'hardware' },
  { pid: 524, name: 'Windows 11 Explorer Bridge', cpu: 1.2, memory: '110 MB', user: 'thinkpad' },
  { pid: 630, name: 'Gemini Assistant Service', cpu: 0.5, memory: '78 MB', user: 'system' },
  { pid: 742, name: 'Audio Core & Waveforms', cpu: 0.4, memory: '45 MB', user: 'thinkpad' },
  { pid: 850, name: 'Lenovo Vantage Cooling Daemon', cpu: 0.2, memory: '38 MB', user: 'system' },
];

export const ActivityMonitorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cpu' | 'memory' | 'disk' | 'network'>('cpu');
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [search, setSearch] = useState('');
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 14, 18, 15, 22, 19, 14, 17, 21, 18]);

  // Dynamic simulation of CPU fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      const nextVal = Math.floor(10 + Math.random() * 15);
      setCpuHistory((prev) => [...prev.slice(1), nextVal]);
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Number(Math.max(0.1, p.cpu + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        }))
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const killProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Header Toolbar */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/70">
        {/* Tabs: CPU, Memory, Disk, Network */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl text-xs">
          {[
            { id: 'cpu', label: 'CPU (Intel Core i7)', icon: Cpu },
            { id: 'memory', label: 'Memory (32 GB)', icon: Activity },
            { id: 'disk', label: 'Disk (NVMe SSD)', icon: HardDrive },
            { id: 'network', label: 'Network (Wi-Fi 6E)', icon: Wifi },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === tab.id ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search process input */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search processes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-44 bg-slate-800 rounded-lg pl-7 pr-3 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Main Graph & Telemetry Strip */}
      <div className="p-4 bg-slate-950/40 border-b border-white/10 flex items-center justify-between gap-6 shrink-0">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-300">ThinkPad CPU Utilization (10 Cores, 12 Threads)</span>
            <span className="font-mono text-emerald-400 font-bold">{cpuHistory[cpuHistory.length - 1]}% Average Load</span>
          </div>
          {/* Mini dynamic sparkline canvas */}
          <div className="h-10 w-full flex items-end gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            {cpuHistory.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-red-600 rounded-t transition-all duration-300"
                style={{ height: `${val * 3.5}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 text-xs font-mono shrink-0">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400">Memory Pressure</div>
            <div className="text-emerald-400 font-bold mt-0.5">Nominal (34%)</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[10px] text-slate-400">Thermal Profile</div>
            <div className="text-red-400 font-bold mt-0.5">Balanced (44°C)</div>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 sticky top-0 border-b border-white/10 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">PID</th>
              <th className="py-2.5 px-4">Process Name</th>
              <th className="py-2.5 px-4">% CPU</th>
              <th className="py-2.5 px-4">Memory</th>
              <th className="py-2.5 px-4">User</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProcesses.map((proc) => (
              <tr key={proc.pid} className="hover:bg-white/5 transition-colors">
                <td className="py-2 px-4 font-mono text-slate-400">{proc.pid}</td>
                <td className="py-2 px-4 font-medium text-white">{proc.name}</td>
                <td className="py-2 px-4 font-mono text-red-400 font-bold">{proc.cpu}%</td>
                <td className="py-2 px-4 font-mono">{proc.memory}</td>
                <td className="py-2 px-4 text-slate-400">{proc.user}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => killProcess(proc.pid)}
                    className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    title="Quit Process"
                  >
                    <XCircle size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
