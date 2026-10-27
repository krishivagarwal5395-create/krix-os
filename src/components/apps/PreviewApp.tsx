import React, { useState } from 'react';
import { Eye, ZoomIn, ZoomOut, RotateCw, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { FileItem } from '../../types/desktop';

export const PreviewApp: React.FC<{ initialParams?: { file?: FileItem } }> = ({ initialParams }) => {
  const file = initialParams?.file || {
    id: 'sample',
    name: 'ThinkPad_X1_Technical_Report.txt',
    path: '/Documents',
    size: '12 KB',
    type: 'document',
    updatedAt: 'Today',
    content: `LENOVO THINKPAD X1 CARBON GEN 11 — COMPREHENSIVE ARCHITECTURE AUDIT
Platform: Windows 11 Pro 64-bit (OS Build 22631.3880)
Processor: 13th Gen Intel(R) Core(TM) i7-1365U
Display: 14.0" 2.8K (2880 x 1800) OLED 90Hz Anti-Reflective 100% DCI-P3
Memory: 32 GB LPDDR5-6400MHz Dual Channel
Storage: 1TB PCIe NVMe Gen 4 M.2 SSD
KRIX Desktop Transformation: Version 2.4.0 Production Build
All subsystems operational. Hardware thermal profiles active.`,
  };

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/60">
        <div className="flex items-center gap-2 text-xs truncate max-w-sm">
          <Eye size={15} className="text-teal-400" />
          <span className="font-semibold text-white truncate">{file.name}</span>
          <span className="text-slate-400 font-mono text-[11px]">({file.size})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="p-1 rounded hover:bg-white/10 text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 15))}
            className="p-1 rounded hover:bg-white/10 text-slate-300"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1 rounded hover:bg-white/10 text-slate-300"
            title="Rotate 90°"
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-slate-950/40">
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="max-w-2xl w-full bg-slate-900 border border-white/15 rounded-2xl p-6 shadow-2xl"
        >
          {file.url ? (
            <img src={file.url} alt={file.name} className="w-full h-auto rounded-xl" />
          ) : (
            <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-200 select-text whitespace-pre-wrap">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-teal-400 font-bold">
                <FileText size={16} />
                <span>Document Inspector</span>
              </div>
              <p>{file.content || 'Binary document payload.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
