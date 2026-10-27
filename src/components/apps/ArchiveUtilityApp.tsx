import React, { useState } from 'react';
import { Archive, FileArchive, Check, Upload, Download } from 'lucide-react';

export const ArchiveUtilityApp: React.FC = () => {
  const [archives, setArchives] = useState([
    { id: '1', name: 'ThinkPad_Diagnostics_Report.zip', size: '1.2 MB', filesCount: 4, date: 'Oct 24, 2026' },
    { id: '2', name: 'KRIX_Wallpapers_Bundle.tar.gz', size: '14.8 MB', filesCount: 8, date: 'Oct 20, 2026' },
  ]);
  const [isExtracting, setIsExtracting] = useState<string | null>(null);

  const extractArchive = (id: string) => {
    setIsExtracting(id);
    setTimeout(() => {
      setIsExtracting(null);
      alert('Archive files extracted successfully to /Documents folder.');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-yellow-600 text-white shadow">
            <Archive size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Archive Utility</h2>
            <p className="text-[11px] text-slate-400">Zip and Tar decompression engine for Windows 11</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {archives.map((arc) => (
          <div
            key={arc.id}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-yellow-500/20 text-yellow-400">
                <FileArchive size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{arc.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {arc.size} · {arc.filesCount} items · {arc.date}
                </div>
              </div>
            </div>

            <button
              onClick={() => extractArchive(arc.id)}
              disabled={isExtracting === arc.id}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              {isExtracting === arc.id ? 'Extracting...' : 'Extract Archive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
