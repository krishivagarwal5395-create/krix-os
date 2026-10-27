import React, { useState } from 'react';
import { 
  Folder, 
  HardDrive, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Trash2, 
  Plus, 
  Grid, 
  List, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Eye, 
  Download,
  Upload,
  Laptop
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { FileItem } from '../../types/desktop';

export const FinderApp: React.FC = () => {
  const { files, createFile, trashFile, openApp } = useDesktop();
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Files in current path
  const currentFiles = files.filter((f) => {
    const inPath = f.path === currentPath;
    const matchSearch = searchQuery === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return inPath && matchSearch;
  });

  const selectedFile = files.find((f) => f.id === selectedFileId);

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`);
      setSelectedFileId(null);
    } else if (file.type === 'image' || file.type === 'document' || file.type === 'code') {
      openApp('preview', { file });
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFile({
        name: newFolderName.trim(),
        path: currentPath,
        size: '0 KB',
        type: 'folder',
      });
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('image/') ? 'image' : file.type.includes('json') ? 'code' : 'document';
      createFile({
        name: file.name,
        path: currentPath,
        size: `${Math.round(file.size / 1024)} KB`,
        type,
        content: `Uploaded file: ${file.name}`,
      });
    }
  };

  const goBack = () => {
    if (currentPath !== '/') {
      const parts = currentPath.split('/').filter(Boolean);
      parts.pop();
      setCurrentPath(parts.length ? `/${parts.join('/')}` : '/');
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Sidebar: Favorites and Locations */}
      <div className="w-52 bg-slate-100/90 dark:bg-slate-900/90 border-r border-slate-200 dark:border-white/10 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Favorites */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Favorites
            </div>
            <div className="space-y-0.5 text-xs">
              {[
                { name: 'Documents', path: '/Documents', icon: Folder, color: 'text-blue-500' },
                { name: 'Projects', path: '/Projects', icon: Folder, color: 'text-indigo-500' },
                { name: 'Pictures', path: '/Pictures', icon: ImageIcon, color: 'text-sky-500' },
                { name: 'Downloads', path: '/Downloads', icon: Download, color: 'text-teal-500' },
              ].map((fav) => (
                <button
                  key={fav.name}
                  onClick={() => setCurrentPath(fav.path)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                    currentPath === fav.path
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  <fav.icon size={14} className={currentPath === fav.path ? 'text-white' : fav.color} />
                  <span>{fav.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Locations
            </div>
            <div className="space-y-0.5 text-xs">
              <button
                onClick={() => setCurrentPath('/')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                  currentPath === '/'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <HardDrive size={14} className="text-slate-400" />
                <span>ThinkPad C: Drive</span>
              </button>
              <button
                onClick={() => openApp('systeminfo')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-left"
              >
                <Laptop size={14} className="text-red-500" />
                <span>Lenovo ThinkPad</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trash Shortcut */}
        <button
          onClick={() => openApp('trash')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <Trash2 size={14} />
          <span>Trash</span>
        </button>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
        {/* Navigation Breadcrumb Toolbar */}
        <div className="h-11 px-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between select-none shrink-0 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={goBack}
              disabled={currentPath === '/'}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-30 text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft size={15} />
            </button>
            <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              ThinkPad HD {currentPath}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                title="Grid View"
              >
                <Grid size={13} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                title="List View"
              >
                <List size={13} />
              </button>
            </div>

            {/* Actions: New folder, Upload, Delete */}
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium flex items-center gap-1"
              title="New Folder"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Folder</span>
            </button>

            <label className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium flex items-center gap-1 cursor-pointer">
              <Upload size={14} />
              <span className="hidden sm:inline">Upload</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {selectedFileId && (
              <button
                onClick={() => {
                  trashFile(selectedFileId);
                  setSelectedFileId(null);
                }}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                title="Move to Trash"
              >
                <Trash2 size={14} />
              </button>
            )}

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 bg-slate-100 dark:bg-slate-800 rounded-lg pl-7 pr-2 py-1 text-xs focus:w-44 transition-all focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Inline new folder creator */}
        {isCreatingFolder && (
          <form onSubmit={handleCreateFolder} className="p-3 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-500/20 flex items-center gap-2">
            <input
              type="text"
              autoFocus
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="px-2.5 py-1 text-xs rounded border border-amber-400 bg-white dark:bg-slate-800"
            />
            <button type="submit" className="px-3 py-1 bg-amber-500 text-white rounded text-xs font-semibold">
              Create
            </button>
            <button type="button" onClick={() => setIsCreatingFolder(false)} className="text-xs text-slate-400">
              Cancel
            </button>
          </form>
        )}

        {/* Files Grid or List */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs">
              <Folder size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
              <span>This folder is empty</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {currentFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    onDoubleClick={() => handleDoubleClick(file)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all text-center ${
                      isSelected
                        ? 'bg-blue-500/20 ring-1 ring-blue-500 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="mb-1.5">
                      {file.type === 'folder' ? (
                        <Folder size={44} className="text-blue-500 fill-blue-500/20" />
                      ) : file.type === 'image' ? (
                        <ImageIcon size={44} className="text-sky-500" />
                      ) : file.type === 'code' ? (
                        <Code size={44} className="text-emerald-500" />
                      ) : (
                        <FileText size={44} className="text-amber-500" />
                      )}
                    </div>
                    <span className="text-xs font-medium truncate w-full">{file.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{file.size}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
              <div className="grid grid-cols-12 font-semibold text-slate-400 pb-2 px-2">
                <span className="col-span-6">Name</span>
                <span className="col-span-3">Date Modified</span>
                <span className="col-span-3 text-right">Size</span>
              </div>
              {currentFiles.map((file) => {
                const isSelected = selectedFileId === file.id;
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    onDoubleClick={() => handleDoubleClick(file)}
                    className={`grid grid-cols-12 py-2 px-2 cursor-pointer rounded-lg items-center ${
                      isSelected ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="col-span-6 flex items-center gap-2 truncate">
                      {file.type === 'folder' ? (
                        <Folder size={16} className="text-blue-500" />
                      ) : (
                        <FileText size={16} className="text-amber-500" />
                      )}
                      <span className="truncate font-medium">{file.name}</span>
                    </span>
                    <span className="col-span-3 text-slate-400">{file.updatedAt}</span>
                    <span className="col-span-3 text-right text-slate-400 font-mono">{file.size}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-7 px-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{currentFiles.length} items</span>
          <span>ThinkPad NVMe SSD (612 GB available)</span>
        </div>
      </div>
    </div>
  );
};
