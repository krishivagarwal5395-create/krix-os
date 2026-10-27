import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Smile, 
  Tag, 
  Search, 
  Star, 
  Trash2, 
  ShieldCheck, 
  Download, 
  Sparkles, 
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { JournalEntry } from '../../types/desktop';

const REFLECTION_PROMPTS = [
  'What made you feel most proud or fulfilled today?',
  'What was the most challenging obstacle you navigated today?',
  'What is one quiet moment or conversation you appreciate from today?',
  'What is one habit or focus you want to strengthen tomorrow?',
  'What did you learn about your tools, craft, or self today?',
];

const MOODS: { id: JournalEntry['mood']; label: string; icon: string; color: string }[] = [
  { id: 'joyful', label: 'Joyful', icon: '✨', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
  { id: 'productive', label: 'Productive', icon: '⚡', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { id: 'calm', label: 'Calm', icon: '🌿', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
  { id: 'contemplative', label: 'Contemplative', icon: '💭', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  { id: 'challenged', label: 'Challenged', icon: '🏔️', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
];

export const JournalApp: React.FC = () => {
  const { journalEntries, saveJournalEntry, createJournalEntry, deleteJournalEntry } = useDesktop();

  const [activeEntryId, setActiveEntryId] = useState<string | null>(journalEntries[0]?.id || null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  const activeEntry = journalEntries.find((e) => e.id === activeEntryId) || journalEntries[0];

  // All unique tags across entries
  const allTags = useMemo(() => {
    const set = new Set<string>();
    journalEntries.forEach((e) => e.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [journalEntries]);

  // Filtered timeline entries
  const filteredEntries = useMemo(() => {
    return journalEntries.filter((e) => {
      const matchSearch =
        searchQuery === '' ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTag = selectedTag === 'all' || e.tags.includes(selectedTag);
      const matchMood = selectedMood === 'all' || e.mood === selectedMood;
      return matchSearch && matchTag && matchMood;
    }).sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  }, [journalEntries, searchQuery, selectedTag, selectedMood]);

  // Random prompt generator
  const applyRandomPrompt = () => {
    if (!activeEntry) return;
    const prompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
    saveJournalEntry({
      id: activeEntry.id,
      prompt,
      content: activeEntry.content ? activeEntry.content + `\n\n*Prompt: ${prompt}*\n` : `*Prompt: ${prompt}*\n`,
    });
  };

  // Export journal backup
  const exportJournalBackup = () => {
    const dataStr = JSON.stringify(journalEntries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `krix_journal_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Left Sidebar: Timeline & Navigation */}
      <div className="w-80 bg-slate-950/80 border-r border-white/10 flex flex-col shrink-0">
        {/* Header & New Entry */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-400" />
            <span className="font-semibold text-sm tracking-tight text-white">KRIX Journal</span>
          </div>
          <button
            onClick={() => {
              const newId = createJournalEntry();
              setActiveEntryId(newId);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>New Entry</span>
          </button>
        </div>

        {/* Search & Mode Switcher */}
        <div className="p-3 border-b border-white/10 space-y-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reflections & dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/5">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'timeline' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'calendar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Calendar
              </button>
            </div>

            <button
              onClick={exportJournalBackup}
              className="p-1 rounded text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              title="Export Encrypted Backup"
            >
              <Download size={13} />
              <span>Backup</span>
            </button>
          </div>
        </div>

        {/* Mood Filter row */}
        <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => setSelectedMood('all')}
            className={`px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
              selectedMood === 'all' ? 'bg-white/15 text-white border-white/30' : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            All Moods
          </button>
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`px-2 py-0.5 rounded-full border transition-colors shrink-0 flex items-center gap-1 ${
                selectedMood === m.id ? m.color : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Entries List / Timeline */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No journal entries found
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isSelected = activeEntry?.id === entry.id;
              const moodInfo = MOODS.find((m) => m.id === entry.mood);

              return (
                <div
                  key={entry.id}
                  onClick={() => setActiveEntryId(entry.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-emerald-600/15 border-l-4 border-emerald-500' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate">{entry.title || 'Untitled Entry'}</span>
                    <span className="text-xs">{moodInfo?.icon}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-mono">{entry.date}</span>
                    <span>·</span>
                    <span>{entry.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {entry.content || 'No reflection logged yet...'}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-emerald-400/80">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Privacy Notice Footer */}
        <div className="p-2.5 border-t border-white/10 bg-slate-950 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="leading-tight">Private local storage only. Never transmitted to AI.</span>
        </div>
      </div>

      {/* Right Column: Entry Editor & Reflection Workspace */}
      {activeEntry ? (
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* Top Control Bar */}
          <div className="h-12 px-6 bg-slate-900/60 border-b border-white/10 flex items-center justify-between shrink-0">
            {/* Date and Time badge */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <CalendarIcon size={14} className="text-emerald-400" />
                <input
                  type="date"
                  value={activeEntry.date}
                  onChange={(e) => saveJournalEntry({ id: activeEntry.id, date: e.target.value })}
                  className="bg-transparent border-none text-white focus:outline-none cursor-pointer"
                />
              </div>
              <span>·</span>
              <div className="flex items-center gap-1 font-mono text-slate-400">
                <Clock size={13} />
                <span>{activeEntry.time}</span>
              </div>
            </div>

            {/* Actions: Mood Selector, Prompt, Delete */}
            <div className="flex items-center gap-3">
              {/* Mood dropdown / selector */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-white/10">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => saveJournalEntry({ id: activeEntry.id, mood: m.id })}
                    className={`p-1.5 rounded-lg transition-transform ${
                      activeEntry.mood === m.id ? 'scale-110 bg-white/15' : 'opacity-60 hover:opacity-100'
                    }`}
                    title={`Mood: ${m.label}`}
                  >
                    <span>{m.icon}</span>
                  </button>
                ))}
              </div>

              {/* Reflection Prompt */}
              <button
                onClick={applyRandomPrompt}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                title="Get inspiration prompt"
              >
                <Sparkles size={13} />
                <span>Prompt</span>
              </button>

              {/* Favorite */}
              <button
                onClick={() => saveJournalEntry({ id: activeEntry.id, isFavorite: !activeEntry.isFavorite })}
                className={`p-1.5 rounded-lg hover:bg-white/10 ${
                  activeEntry.isFavorite ? 'text-yellow-400' : 'text-slate-400'
                }`}
                title="Favorite entry"
              >
                <Star size={16} className={activeEntry.isFavorite ? 'fill-yellow-400' : ''} />
              </button>

              {/* Delete */}
              <button
                onClick={() => {
                  if (confirm('Delete this journal entry?')) {
                    deleteJournalEntry(activeEntry.id);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Delete Entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Active Entry Content Body */}
          <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full space-y-4">
            {/* Title */}
            <input
              type="text"
              value={activeEntry.title}
              onChange={(e) => saveJournalEntry({ id: activeEntry.id, title: e.target.value })}
              placeholder="Entry Title..."
              className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-500 focus:outline-none border-b border-transparent focus:border-emerald-500 pb-1"
            />

            {/* Prompt Banner if present */}
            {activeEntry.prompt && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 italic">
                "{activeEntry.prompt}"
              </div>
            )}

            {/* Tags row */}
            <div className="flex items-center gap-2 text-xs">
              <Tag size={13} className="text-slate-400" />
              <input
                type="text"
                placeholder="Add tags separated by comma (e.g. Focus, ThinkPad, Health)..."
                value={activeEntry.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                  saveJournalEntry({ id: activeEntry.id, tags });
                }}
                className="flex-1 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Main Content Area */}
            <textarea
              value={activeEntry.content}
              onChange={(e) => saveJournalEntry({ id: activeEntry.id, content: e.target.value })}
              placeholder="Write your personal reflections freely. This space is private and strictly kept on your machine..."
              className="w-full h-[calc(100vh-360px)] min-h-[300px] bg-transparent text-sm leading-relaxed text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <BookOpen size={48} className="text-slate-700 mb-3" />
          <p className="text-sm font-medium">No Journal Entry Selected</p>
          <button
            onClick={() => createJournalEntry()}
            className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            Create First Entry
          </button>
        </div>
      )}
    </div>
  );
};
