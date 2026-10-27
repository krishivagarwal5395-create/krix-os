import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, BatteryCharging, Monitor, ShieldCheck, Copy, Check } from 'lucide-react';

export const SystemInfoApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [sysInfo, setSysInfo] = useState<any>(null);

  useEffect(() => {
    fetch('/api/system-info')
      .then((res) => res.json())
      .then((data) => setSysInfo(data))
      .catch(() => {
        // Fallback info if server offline
        setSysInfo({
          device: {
            manufacturer: 'Lenovo',
            productName: 'ThinkPad X1 Carbon Gen 11',
            modelNumber: '21HMCTO1WW',
            trackPoint: 'Enabled (UltraNav Dual-Pointing Device)',
          },
          os: {
            name: 'Windows 11 Pro 64-bit',
            version: '23H2 (Build 22631.3880)',
            krixVersion: '2.4.0-macOS-Evolution',
          },
          hardware: {
            cpu: '13th Gen Intel(R) Core(TM) i7-1365U (10 cores, up to 5.20 GHz)',
            memory: '32.0 GB LPDDR5-6400MHz',
            display: '14.0" 2.8K (2880 x 1800) OLED 90Hz DCI-P3 100%',
            gpu: 'Intel(R) Iris(R) Xe Graphics',
          },
        });
      });
  }, []);

  const copyReport = () => {
    if (!sysInfo) return;
    navigator.clipboard.writeText(JSON.stringify(sysInfo, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 p-6 overflow-y-auto font-sans select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-black p-2.5 flex items-center justify-center text-white shadow-xl border border-white/10">
            <Cpu size={26} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Lenovo ThinkPad X1 Carbon</span>
              <span className="w-2 h-2 rounded-full bg-red-600 inline-block shadow-sm" />
            </h2>
            <p className="text-xs text-slate-400">Windows 11 Pro · KRIX Desktop Environment v2.4.0</p>
          </div>
        </div>

        <button
          onClick={copyReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy System Report'}</span>
        </button>
      </div>

      {/* Grid of Diagnostic Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Hardware & CPU */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
            <Cpu size={15} />
            <span>Processor & Memory</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Processor:</span>
              <span className="font-semibold text-white text-right">Intel Core i7-1365U</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cores / Threads:</span>
              <span className="font-mono text-white">10 Cores, 12 Threads</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Installed RAM:</span>
              <span className="font-mono text-white">32 GB LPDDR5-6400MHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Graphics:</span>
              <span className="text-white">Intel Iris Xe Graphics</span>
            </div>
          </div>
        </div>

        {/* Display & Battery */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider">
            <Monitor size={15} />
            <span>Display & Battery</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Display Panel:</span>
              <span className="font-semibold text-white">14.0" 2.8K OLED (2880x1800)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color Gamut:</span>
              <span className="text-white">100% DCI-P3, 90Hz, 400 nits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Battery Status:</span>
              <span className="text-emerald-400 font-semibold">88% RapidCharge (98% Health)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Charge Cycles:</span>
              <span className="font-mono text-white">42 Cycles</span>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <HardDrive size={15} />
            <span>Storage & Drives</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Primary Drive (C:):</span>
              <span className="font-mono text-white">953 GB NVMe PCIe Gen4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Free Space:</span>
              <span className="font-mono text-emerald-400 font-bold">580 GB Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Lenovo Recovery (D:):</span>
              <span className="font-mono text-white">24 GB OEM Partition</span>
            </div>
          </div>
        </div>

        {/* Software & Security */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <ShieldCheck size={15} />
            <span>Windows & ThinkPad Security</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Operating System:</span>
              <span className="text-white">Windows 11 Pro (23H2)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TPM 2.0 & SecureBoot:</span>
              <span className="text-emerald-400 font-semibold">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TrackPoint UltraNav:</span>
              <span className="text-red-400 font-semibold">Active (Middle Click Scroll)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
