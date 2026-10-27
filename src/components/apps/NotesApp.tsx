import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Star, 
  Trash2, 
  CheckSquare, 
  Heading1, 
  Heading2, 
  Bold, 
  Italic, 
  Code, 
  Image as ImageIcon, 
  Download, 
  Upload,
  Check,
  Share2
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { NoteItem } from '../../types/desktop';

export const NotesApp: React.FC = () => {
  const { 
    notes, 
    folders, 
    activeNoteId, 
    setActiveNoteId, 
    saveNote, 
    createNote, 
    deleteNote, 
    createFolder,
    openApp 
  } = useDesktop();

  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Active note lookup
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Filter notes by folder and search
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesFolder = selectedFolderId === 'all' || n.folderId === selectedFolderId;
        const matchesSearch =
          searchQuery === '' ||
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
      })
      .sort((a, b) => {
        // Pinned notes first, then by date
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, selectedFolderId, searchQuery]);

  // Insert markdown tag at cursor in active note
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!activeNote) return;
    const content = activeNote.content;
    const updated = content + `\n${prefix}Text${suffix}`;
    saveNote({ id: activeNote.id, content: updated });
  };

  const addChecklistItem = () => {
    if (!activeNote) return;
    const checklist = activeNote.checklist || [];
    const updated = [
      ...checklist,
      { id: `c-${Date.now()}`, text: 'New item to complete', done: false },
    ];
    saveNote({ id: activeNote.id, checklist: updated });
  };

  const toggleChecklistItem = (checkId: string) => {
    if (!activeNote || !activeNote.checklist) return;
    const updated = activeNote.checklist.map((item) =>
      item.id === checkId ? { ...item, done: !item.done } : item
    );
    saveNote({ id: activeNote.id, checklist: updated });
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const exportNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImageAttach = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim() && activeNote) {
      saveNote({ id: activeNote.id, attachmentUrl: imageUrlInput.trim() });
      setImageUrlInput('');
      setShowImageModal(false);
    }
  };

  // Word count
  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote?.content ? activeNote.content.length : 0;

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* COLUMN 1: Folders Sidebar */}
      <div className="w-52 bg-slate-100/80 dark:bg-slate-900/80 border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Folders
          </span>
          <button
            onClick={() => setIsAddingFolder(!isAddingFolder)}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
            title="New Folder"
          >
            <FolderPlus size={15} />
          </button>
        </div>

        {/* New folder inline input */}
        {isAddingFolder && (
          <form onSubmit={handleCreateFolder} className="p-2 border-b border-slate-200 dark:border-white/10">
            <input
              type="text"
              autoFocus
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/15 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </form>
        )}

        {/* Folder items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {folders.map((folder) => {
            const count = folder.id === 'all' 
              ? notes.length 
              : notes.filter((n) => n.folderId === folder.id).length;
            const isSelected = selectedFolderId === folder.id;

            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder size={14} className={isSelected ? 'text-white' : 'text-amber-500'} />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className={`text-[11px] tabular-nums ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ThinkPad local encrypted note badge */}
        <div className="p-2.5 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Local Encrypted Storage Active</span>
        </div>
      </div>

      {/* COLUMN 2: Notes List */}
      <div className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0">
        {/* Search & New Note bar */}
        <div className="p-2.5 border-b border-slate-200 dark:border-white/10 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <button
            onClick={() => createNote(selectedFolderId === 'all' ? 'work' : selectedFolderId)}
            className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors"
            title="Create New Note (⌘ N)"
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No notes in this folder
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const dateDisplay = new Date(note.updatedAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-l-4 border-amber-500'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {note.title || 'Untitled Note'}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {note.isPinned && <Pin size={11} className="text-amber-500 fill-amber-500" />}
                      {note.isFavorite && <Star size={11} className="text-yellow-500 fill-yellow-500" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-400">
                    <span className="font-medium shrink-0">{dateDisplay}</span>
                    <span className="truncate">{note.preview || 'No additional text'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COLUMN 3: Active Note Editor */}
      {activeNote ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
          {/* Formatting Toolbar */}
          <div className="h-10 px-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 select-none">
            {/* Left Formatting Tools */}
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <button
                onClick={() => insertFormatting('# ')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Heading 1"
              >
                <Heading1 size={15} />
              </button>
              <button
                onClick={() => insertFormatting('## ')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Heading 2"
              >
                <Heading2 size={15} />
              </button>
              <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1" />
              <button
                onClick={() => insertFormatting('**', '**')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Bold"
              >
                <Bold size={15} />
              </button>
              <button
                onClick={() => insertFormatting('*', '*')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Italic"
              >
                <Italic size={15} />
              </button>
              <button
                onClick={() => insertFormatting('`', '`')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Code"
              >
                <Code size={15} />
              </button>
              <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1" />
              <button
                onClick={addChecklistItem}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 flex items-center gap-1 text-xs"
                title="Add Checklist Item"
              >
                <CheckSquare size={15} />
                <span className="hidden sm:inline text-[11px]">Checklist</span>
              </button>
              <button
                onClick={() => setShowImageModal(true)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Attach Image"
              >
                <ImageIcon size={15} />
              </button>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <button
                onClick={() => saveNote({ id: activeNote.id, isPinned: !activeNote.isPinned })}
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 ${
                  activeNote.isPinned ? 'text-amber-500' : ''
                }`}
                title={activeNote.isPinned ? 'Unpin Note' : 'Pin to Top'}
              >
                <Pin size={15} className={activeNote.isPinned ? 'fill-amber-500' : ''} />
              </button>
              <button
                onClick={() => saveNote({ id: activeNote.id, isFavorite: !activeNote.isFavorite })}
                className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 ${
                  activeNote.isFavorite ? 'text-yellow-500' : ''
                }`}
                title="Favorite Note"
              >
                <Star size={15} className={activeNote.isFavorite ? 'fill-yellow-500' : ''} />
              </button>
              <button
                onClick={exportNote}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                title="Export as Markdown (.md)"
              >
                <Download size={15} />
              </button>
              <button
                onClick={() => {
                  openApp('writingassistant', { initialText: activeNote.content });
                }}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-purple-400"
                title="Polish with Writing Assistant"
              >
                <Share2 size={15} />
              </button>
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1 rounded hover:bg-red-500/10 text-red-500"
                title="Delete Note"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Note Title & Content Body */}
          <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-4">
            {/* Title Input */}
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => saveNote({ id: activeNote.id, title: e.target.value })}
              placeholder="Note Title"
              className="w-full bg-transparent text-2xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-b border-transparent focus:border-amber-500 pb-1"
            />

            {/* Note Metadata / Timestamps */}
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Updated {new Date(activeNote.updatedAt).toLocaleString()}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{wordCount} words</span>
              <span>·</span>
              <span className="font-mono tabular-nums">{charCount} characters</span>
            </div>

            {/* Optional Image Attachment Preview */}
            {activeNote.attachmentUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-64 group">
                <img
                  src={activeNote.attachmentUrl}
                  alt="Note Attachment"
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={() => saveNote({ id: activeNote.id, attachmentUrl: undefined })}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            {/* Interactive Checklist section if present */}
            {activeNote.checklist && activeNote.checklist.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 space-y-2">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Checklist Items
                </div>
                {activeNote.checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        item.done
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-slate-400 hover:border-amber-500'
                      }`}
                    >
                      {item.done && <Check size={12} strokeWidth={3} />}
                    </button>
                    <span
                      className={`text-xs ${
                        item.done
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Main Content Textarea */}
            <textarea
              value={activeNote.content}
              onChange={(e) => saveNote({ id: activeNote.id, content: e.target.value })}
              placeholder="Start writing or typing markdown..."
              className="w-full h-[calc(100vh-340px)] min-h-[300px] bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none font-sans"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <FileText size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-sm font-medium">No Note Selected</p>
          <button
            onClick={() => createNote()}
            className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Create New Note
          </button>
        </div>
      )}

      {/* Attach Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleImageAttach}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 p-5 rounded-2xl shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Insert Image Attachment</h3>
            <input
              type="url"
              placeholder="Paste image URL (e.g. https://...)"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              required
              className="w-full p-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
              >
                Attach Image
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
