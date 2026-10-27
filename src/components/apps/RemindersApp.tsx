import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Flag, Check } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const RemindersApp: React.FC = () => {
  const { reminders, toggleReminder, addReminder, deleteReminder } = useDesktop();
  const [selectedList, setSelectedList] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const filteredReminders = reminders.filter((r) => {
    if (selectedList === 'today') return r.dueDate?.toLowerCase().includes('today');
    if (selectedList === 'completed') return r.completed;
    if (selectedList === 'flagged') return r.priority === 'high';
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addReminder({
      listId: 'today',
      title: newTitle.trim(),
      priority: newPriority,
      dueDate: 'Today',
    });
    setNewTitle('');
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Lists */}
      <div className="w-56 bg-slate-950/80 border-r border-white/10 p-3 space-y-4 shrink-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          KRIX Reminders
        </div>
        <div className="space-y-1 text-xs">
          {[
            { id: 'all', label: 'All Reminders', count: reminders.length, color: 'text-blue-400' },
            { id: 'today', label: 'Today', count: reminders.filter((r) => !r.completed).length, color: 'text-amber-400' },
            { id: 'flagged', label: 'Flagged (High)', count: reminders.filter((r) => r.priority === 'high').length, color: 'text-red-400' },
            { id: 'completed', label: 'Completed', count: reminders.filter((r) => r.completed).length, color: 'text-emerald-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedList(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-colors ${
                selectedList === item.id ? 'bg-red-600 text-white shadow' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[11px] opacity-75">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 flex flex-col bg-slate-900 p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <h2 className="text-xl font-bold text-white capitalize">{selectedList} Tasks</h2>
          <span className="text-xs font-mono text-slate-400">{filteredReminders.length} items</span>
        </div>

        {/* Quick Add Bar */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a new reminder..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
            className="bg-slate-800 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-300 focus:outline-none"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </form>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                rem.completed
                  ? 'bg-white/5 border-white/5 opacity-60'
                  : 'bg-white/10 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    rem.completed
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'border-slate-400 hover:border-red-500'
                  }`}
                >
                  {rem.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <div>
                  <div className={`text-xs font-medium ${rem.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {rem.title}
                  </div>
                  {rem.dueDate && (
                    <div className="text-[10px] text-slate-400 mt-0.5">{rem.dueDate}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {rem.priority === 'high' && (
                  <span className="text-[10px] font-semibold text-red-400 px-1.5 py-0.5 bg-red-500/20 rounded">
                    HIGH
                  </span>
                )}
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
