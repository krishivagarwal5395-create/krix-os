import React from 'react';
import { Trash2, RotateCcw, AlertTriangle, FileText, Image as ImageIcon, Folder } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const TrashApp: React.FC = () => {
  const { trashFiles, restoreFile, emptyTrash } = useDesktop();

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Trash2 size={18} className="text-zinc-400" />
          <h2 className="text-sm font-bold text-white">KRIX Trash Bin</h2>
          <span className="text-xs font-mono text-slate-400">({trashFiles.length} items)</span>
        </div>

        {trashFiles.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Permanently delete all items in trash?')) {
                emptyTrash();
              }
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow"
          >
            Empty Trash
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {trashFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs space-y-2">
            <Trash2 size={40} className="text-slate-700" />
            <span>Trash is empty</span>
          </div>
        ) : (
          <div className="space-y-2">
            {trashFiles.map((file) => (
              <div
                key={file.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {file.type === 'image' ? (
                    <ImageIcon size={18} className="text-sky-400" />
                  ) : file.type === 'folder' ? (
                    <Folder size={18} className="text-blue-400" />
                  ) : (
                    <FileText size={18} className="text-amber-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-white">{file.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{file.size} · Origin: {file.path}</div>
                  </div>
                </div>

                <button
                  onClick={() => restoreFile(file.id)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Put Back</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
