import React, { useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Tag } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const CalendarApp: React.FC = () => {
  const { calendarEvents, addCalendarEvent } = useDesktop();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM - 11:00 AM');
  const [newCategory, setNewCategory] = useState<'work' | 'personal' | 'system'>('work');
  const [newLocation, setNewLocation] = useState('ThinkPad Workstation');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCalendarEvent({
      title: newTitle.trim(),
      date: currentDate.toISOString().split('T')[0],
      time: newTime,
      category: newCategory,
      location: newLocation,
    });
    setNewTitle('');
    setIsAddingEvent(false);
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar mini calendar and categories */}
      <div className="w-56 bg-slate-950/80 border-r border-white/10 p-3.5 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">KRIX Calendar</span>
            <button
              onClick={() => setIsAddingEvent(true)}
              className="p-1 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-sm"
              title="Add Event"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Categories</div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>ThinkPad Work & System</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Personal Projects</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Focus & Routines</span>
            </div>
          </div>
        </div>

        {/* Today's upcoming count */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
          <div className="text-[10px] text-slate-400">Total Scheduled</div>
          <div className="text-base font-bold text-white font-mono mt-0.5">{calendarEvents.length} Events</div>
        </div>
      </div>

      {/* Main Calendar Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        {/* Navigation Bar */}
        <div className="h-12 px-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex gap-1">
              <button onClick={handlePrev} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNext} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* View mode switcher */}
          <div className="flex bg-white/10 p-0.5 rounded-xl text-xs">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  viewMode === m ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Add Event Modal */}
        {isAddingEvent && (
          <form onSubmit={handleAdd} className="p-4 bg-slate-800/90 border-b border-white/10 flex flex-wrap gap-2 items-center">
            <input
              type="text"
              autoFocus
              placeholder="Event title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Time (e.g. 2:00 PM)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-36 bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-xs text-white font-mono"
            />
            <button type="submit" className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg">
              Save Event
            </button>
            <button type="button" onClick={() => setIsAddingEvent(false)} className="text-xs text-slate-400">
              Cancel
            </button>
          </form>
        )}

        {/* 7-column Calendar Grid */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-slate-950/60 text-slate-400 text-xs py-2 text-center font-semibold">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Grid Cells */}
          <div className="flex-1 grid grid-cols-7 grid-rows-5 divide-x divide-y divide-white/10">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-950/20 p-2 min-h-[70px]" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <div
                  key={day}
                  className={`p-1.5 flex flex-col justify-between min-h-[70px] hover:bg-white/5 transition-colors ${
                    isToday ? 'bg-red-500/10' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-mono font-medium ${isToday ? 'w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold' : 'text-slate-300'}`}>
                      {day}
                    </span>
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] p-1 rounded bg-red-600/30 border border-red-500/30 text-white truncate"
                        title={`${ev.title} (${ev.time})`}
                      >
                        <span className="font-semibold">{ev.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
