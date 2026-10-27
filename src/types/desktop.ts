export type AppCategory = 
  | 'productivity'
  | 'media'
  | 'internet'
  | 'system'
  | 'intelligence';

export interface AppDefinition {
  id: string;
  name: string;
  category: AppCategory;
  iconName: string;
  color: string;
  description: string;
  defaultWidth?: number;
  defaultHeight?: number;
  isNativeWindows?: boolean;
  requiresExternalService?: boolean;
  pinnedInDock?: boolean;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  iconName: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  initialParams?: any;
}

export type ThemeMode = 'dark' | 'light' | 'auto';
export type AccentColor = 'blue' | 'thinkpad-red' | 'purple' | 'emerald' | 'amber' | 'graphite';
export type DockPosition = 'bottom' | 'left' | 'right';
export type DockSize = 'small' | 'medium' | 'large';

export interface SystemSettings {
  theme: ThemeMode;
  wallpaper: string;
  accentColor: AccentColor;
  dockPosition: DockPosition;
  dockSize: DockSize;
  dockMagnification: boolean;
  dockAutoHide: boolean;
  showRunningIndicators: boolean;
  menuBarAutoHide: boolean;
  reducedMotion: boolean;
  interfaceDensity: 'compact' | 'normal' | 'comfortable';
  desktopIcons: boolean;
  windowSnapping: boolean;
  masterVolume: number;
  displayBrightness: number;
  keyboardBacklight: number;
  thinkpadTrackPointSpeed: number;
  thinkpadCoolingProfile: 'quiet' | 'balanced' | 'performance';
  thinkpadRapidCharge: boolean;
  aiModel: string;
  aiSpeechRate: number;
  aiTelemetryOptIn: boolean;
}

export interface NoteItem {
  id: string;
  folderId: string;
  title: string;
  content: string;
  preview: string;
  updatedAt: string;
  createdAt: string;
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  checklist?: { id: string; text: string; done: boolean }[];
  attachmentUrl?: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  icon?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  title: string;
  content: string;
  mood: 'joyful' | 'productive' | 'calm' | 'contemplative' | 'challenged';
  tags: string[];
  photos: string[];
  prompt?: string;
  isFavorite: boolean;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: 'work' | 'personal' | 'system';
  location?: string;
  notes?: string;
}

export interface ReminderItem {
  id: string;
  listId: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  notes?: string;
  avatarColor: string;
}

export interface FileItem {
  id: string;
  name: string;
  path: string; // e.g. /Documents/Projects
  size: string;
  type: 'folder' | 'document' | 'image' | 'code' | 'audio' | 'archive';
  updatedAt: string;
  content?: string;
  url?: string;
  isTrashed?: boolean;
}

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  appId: string;
  time: string;
  read: boolean;
}
