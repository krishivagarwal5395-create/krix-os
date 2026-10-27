import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  WindowState, 
  SystemSettings, 
  NoteItem, 
  NoteFolder, 
  JournalEntry, 
  CalendarEvent, 
  ReminderItem, 
  ContactItem, 
  FileItem, 
  NotificationMessage,
  AppDefinition 
} from '../types/desktop';
import { APP_REGISTRY } from '../data/apps';
import { 
  INITIAL_SETTINGS, 
  INITIAL_FOLDERS, 
  INITIAL_NOTES, 
  INITIAL_JOURNAL_ENTRIES, 
  INITIAL_FILES, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_REMINDERS, 
  INITIAL_CONTACTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

interface DesktopContextType {
  // Windows
  windows: WindowState[];
  activeWindowId: string | null;
  openApp: (appId: string, params?: any) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
  isAppRunning: (appId: string) => boolean;

  // System Overlays
  isLaunchpadOpen: boolean;
  toggleLaunchpad: (open?: boolean) => void;
  isSpotlightOpen: boolean;
  toggleSpotlight: (open?: boolean) => void;
  isControlCenterOpen: boolean;
  toggleControlCenter: (open?: boolean) => void;
  isNotificationCenterOpen: boolean;
  toggleNotificationCenter: (open?: boolean) => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  resetSettings: () => void;

  // Notes
  notes: NoteItem[];
  folders: NoteFolder[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  saveNote: (note: Partial<NoteItem> & { id: string }) => void;
  createNote: (folderId?: string) => string;
  deleteNote: (id: string) => void;
  createFolder: (name: string) => void;

  // Journal
  journalEntries: JournalEntry[];
  saveJournalEntry: (entry: Partial<JournalEntry> & { id: string }) => void;
  createJournalEntry: (date?: string) => string;
  deleteJournalEntry: (id: string) => void;

  // Files & Trash
  files: FileItem[];
  trashFiles: FileItem[];
  createFile: (file: Omit<FileItem, 'id' | 'updatedAt'>) => void;
  trashFile: (id: string) => void;
  restoreFile: (id: string) => void;
  emptyTrash: () => void;

  // Calendar & Reminders
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  reminders: ReminderItem[];
  toggleReminder: (id: string) => void;
  addReminder: (reminder: Omit<ReminderItem, 'id' | 'completed'>) => void;
  deleteReminder: (id: string) => void;

  // Contacts
  contacts: ContactItem[];
  addContact: (contact: Omit<ContactItem, 'id' | 'avatarColor'>) => void;
  deleteContact: (id: string) => void;

  // Notifications
  notifications: NotificationMessage[];
  addNotification: (title: string, body: string, appId?: string) => void;
  clearNotifications: () => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const DesktopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('krix_settings_v2');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const updateSettings = (partial: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('krix_settings_v2', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(INITIAL_SETTINGS);
    try {
      localStorage.setItem('krix_settings_v2', JSON.stringify(INITIAL_SETTINGS));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync dark class on documentElement based on settings
  useEffect(() => {
    if (settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Windows State
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Overlays
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // App Data with LocalStorage
  const [folders, setFolders] = useState<NoteFolder[]>(() => {
    try {
      const saved = localStorage.getItem('krix_note_folders');
      return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('krix_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('krix_journal_entries');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_ENTRIES;
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  });

  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const saved = localStorage.getItem('krix_files');
      return saved ? JSON.parse(saved) : INITIAL_FILES;
    } catch {
      return INITIAL_FILES;
    }
  });

  const [trashFiles, setTrashFiles] = useState<FileItem[]>(() => {
    try {
      const saved = localStorage.getItem('krix_trash');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('krix_calendar');
      return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem('krix_reminders');
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [contacts, setContacts] = useState<ContactItem[]>(() => {
    try {
      const saved = localStorage.getItem('krix_contacts');
      return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationMessage[]>(INITIAL_NOTIFICATIONS);

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('krix_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('krix_journal_entries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('krix_files', JSON.stringify(files));
    localStorage.setItem('krix_trash', JSON.stringify(trashFiles));
  }, [files, trashFiles]);

  useEffect(() => {
    localStorage.setItem('krix_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('krix_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Window Management Actions
  const openApp = (appId: string, params?: any) => {
    const appDef = APP_REGISTRY[appId];
    if (!appDef) return;

    // Close Launchpad or Spotlight if open
    setIsLaunchpadOpen(false);
    setIsSpotlightOpen(false);

    // If app window already exists, restore and focus it
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id
            ? { ...w, isMinimized: false, zIndex: nextZIndex + 1, initialParams: params || w.initialParams }
            : w
        )
      );
      setActiveWindowId(existing.id);
      setNextZIndex((z) => z + 1);
      return;
    }

    // Calculate staggered position
    const offset = (windows.length % 6) * 28;
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;

    const width = Math.min(appDef.defaultWidth || 800, screenW - 60);
    const height = Math.min(appDef.defaultHeight || 540, screenH - 120);
    const x = Math.max(40, Math.min(screenW - width - 40, 80 + offset));
    const y = Math.max(40, Math.min(screenH - height - 80, 50 + offset));

    const newWindow: WindowState = {
      id: `win-${appId}-${Date.now()}`,
      appId,
      title: appDef.name,
      iconName: appDef.iconName,
      isMinimized: false,
      isMaximized: false,
      position: { x, y },
      size: { width, height },
      zIndex: nextZIndex + 1,
      initialParams: params,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setNextZIndex((z) => z + 1);
  };

  const closeWindow = (windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId));
    if (activeWindowId === windowId) {
      const remaining = windows.filter((w) => w.id !== windowId && !w.isMinimized);
      if (remaining.length > 0) {
        const top = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev));
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === windowId) {
      const remaining = windows.filter((w) => w.id !== windowId && !w.isMinimized);
      if (remaining.length > 0) {
        const top = remaining.reduce((prev, curr) => (curr.zIndex > prev.zIndex ? curr : prev));
        setActiveWindowId(top.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w))
    );
    focusWindow(windowId);
  };

  const focusWindow = (windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, isMinimized: false, zIndex: nextZIndex + 1 } : w
      )
    );
    setActiveWindowId(windowId);
    setNextZIndex((z) => z + 1);
  };

  const updateWindowPosition = (windowId: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (windowId: string, size: { width: number; height: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, size } : w))
    );
  };

  const isAppRunning = (appId: string) => {
    return windows.some((w) => w.appId === appId);
  };

  // Overlay toggles
  const toggleLaunchpad = (open?: boolean) => {
    setIsLaunchpadOpen((prev) => (open !== undefined ? open : !prev));
    if (isSpotlightOpen) setIsSpotlightOpen(false);
  };

  const toggleSpotlight = (open?: boolean) => {
    setIsSpotlightOpen((prev) => (open !== undefined ? open : !prev));
    if (isLaunchpadOpen) setIsLaunchpadOpen(false);
  };

  const toggleControlCenter = (open?: boolean) => {
    setIsControlCenterOpen((prev) => (open !== undefined ? open : !prev));
    if (isNotificationCenterOpen) setIsNotificationCenterOpen(false);
  };

  const toggleNotificationCenter = (open?: boolean) => {
    setIsNotificationCenterOpen((prev) => (open !== undefined ? open : !prev));
    if (isControlCenterOpen) setIsControlCenterOpen(false);
  };

  // Note Actions
  const saveNote = (noteUpdate: Partial<NoteItem> & { id: string }) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteUpdate.id
          ? {
              ...n,
              ...noteUpdate,
              updatedAt: new Date().toISOString(),
              preview: noteUpdate.content
                ? noteUpdate.content.replace(/[#*`_]/g, '').slice(0, 80)
                : n.preview,
            }
          : n
      )
    );
  };

  const createNote = (folderId: string = 'work'): string => {
    const newId = `note-${Date.now()}`;
    const newNote: NoteItem = {
      id: newId,
      folderId,
      title: 'New Note',
      content: '',
      preview: 'Empty note...',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isPinned: false,
      isFavorite: false,
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newId);
    return newId;
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  const createFolder = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setFolders((prev) => [...prev, { id, name, icon: 'Folder' }]);
  };

  // Journal Actions
  const saveJournalEntry = (entryUpdate: Partial<JournalEntry> & { id: string }) => {
    setJournalEntries((prev) =>
      prev.map((e) =>
        e.id === entryUpdate.id
          ? { ...e, ...entryUpdate, updatedAt: new Date().toISOString() }
          : e
      )
    );
  };

  const createJournalEntry = (date: string = new Date().toISOString().split('T')[0]): string => {
    const newId = `journal-${Date.now()}`;
    const newEntry: JournalEntry = {
      id: newId,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Today’s Thoughts',
      content: '',
      mood: 'calm',
      tags: ['Daily'],
      photos: [],
      isFavorite: false,
      updatedAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    return newId;
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // File & Trash Actions
  const createFile = (file: Omit<FileItem, 'id' | 'updatedAt'>) => {
    const newFile: FileItem = {
      ...file,
      id: `file-${Date.now()}`,
      updatedAt: 'Just now',
    };
    setFiles((prev) => [...prev, newFile]);
  };

  const trashFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setTrashFiles((prev) => [...prev, { ...file, isTrashed: true }]);
  };

  const restoreFile = (id: string) => {
    const file = trashFiles.find((f) => f.id === id);
    if (!file) return;
    setTrashFiles((prev) => prev.filter((f) => f.id !== id));
    setFiles((prev) => [...prev, { ...file, isTrashed: false }]);
  };

  const emptyTrash = () => {
    setTrashFiles([]);
  };

  // Calendar & Reminders
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...event, id: `ev-${Date.now()}` };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const addReminder = (reminder: Omit<ReminderItem, 'id' | 'completed'>) => {
    const newR: ReminderItem = {
      ...reminder,
      id: `rem-${Date.now()}`,
      completed: false,
    };
    setReminders((prev) => [newR, ...prev]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Contacts
  const addContact = (contact: Omit<ContactItem, 'id' | 'avatarColor'>) => {
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    const newC: ContactItem = {
      ...contact,
      id: `cnt-${Date.now()}`,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };
    setContacts((prev) => [...prev, newC]);
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Notifications
  const addNotification = (title: string, body: string, appId: string = 'system') => {
    const newN: NotificationMessage = {
      id: `notif-${Date.now()}`,
      title,
      body,
      appId,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Win + Space -> Toggle Spotlight
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        toggleSpotlight();
      }
      // Esc -> Close Launchpad or Spotlight
      if (e.key === 'Escape') {
        if (isLaunchpadOpen) setIsLaunchpadOpen(false);
        if (isSpotlightOpen) setIsSpotlightOpen(false);
        if (isControlCenterOpen) setIsControlCenterOpen(false);
        if (isNotificationCenterOpen) setIsNotificationCenterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLaunchpadOpen, isSpotlightOpen, isControlCenterOpen, isNotificationCenterOpen]);

  // Open initial default windows on first launch for immediate richness
  useEffect(() => {
    const hasBooted = sessionStorage.getItem('krix_booted');
    if (!hasBooted) {
      sessionStorage.setItem('krix_booted', 'true');
      openApp('notes');
      openApp('systeminfo');
    }
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        windows,
        activeWindowId,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        isAppRunning,
        isLaunchpadOpen,
        toggleLaunchpad,
        isSpotlightOpen,
        toggleSpotlight,
        isControlCenterOpen,
        toggleControlCenter,
        isNotificationCenterOpen,
        toggleNotificationCenter,
        settings,
        updateSettings,
        resetSettings,
        notes,
        folders,
        activeNoteId,
        setActiveNoteId,
        saveNote,
        createNote,
        deleteNote,
        createFolder,
        journalEntries,
        saveJournalEntry,
        createJournalEntry,
        deleteJournalEntry,
        files,
        trashFiles,
        createFile,
        trashFile,
        restoreFile,
        emptyTrash,
        calendarEvents,
        addCalendarEvent,
        reminders,
        toggleReminder,
        addReminder,
        deleteReminder,
        contacts,
        addContact,
        deleteContact,
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
