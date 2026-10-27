import { 
  SystemSettings, 
  NoteItem, 
  NoteFolder, 
  JournalEntry, 
  CalendarEvent, 
  ReminderItem, 
  ContactItem, 
  FileItem, 
  NotificationMessage 
} from '../types/desktop';

export const INITIAL_SETTINGS: SystemSettings = {
  theme: 'dark',
  wallpaper: 'thinkpad-carbon',
  accentColor: 'thinkpad-red',
  dockPosition: 'bottom',
  dockSize: 'medium',
  dockMagnification: true,
  dockAutoHide: false,
  showRunningIndicators: true,
  menuBarAutoHide: false,
  reducedMotion: false,
  interfaceDensity: 'normal',
  desktopIcons: true,
  windowSnapping: true,
  masterVolume: 75,
  displayBrightness: 90,
  keyboardBacklight: 2,
  thinkpadTrackPointSpeed: 6,
  thinkpadCoolingProfile: 'balanced',
  thinkpadRapidCharge: true,
  aiModel: 'gemini-3.8-flash',
  aiSpeechRate: 1.0,
  aiTelemetryOptIn: false,
};

export const INITIAL_FOLDERS: NoteFolder[] = [
  { id: 'all', name: 'All Notes', icon: 'Folder' },
  { id: 'work', name: 'ThinkPad Projects', icon: 'Briefcase' },
  { id: 'personal', name: 'Personal & Ideas', icon: 'User' },
  { id: 'archive', name: 'Archive', icon: 'Archive' },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    folderId: 'work',
    title: 'KRIX Desktop Architecture & Windows 11 Integration',
    content: `# KRIX Desktop Transformation on Windows 11
This system bridges the visual elegance, fluid gestures, and application ergonomics of macOS with the industrial reliability of a Lenovo ThinkPad.

### Key Architectural Pillars:
* **Native Windows Compatibility**: Preserves all Windows 11 drivers, files, and executable pipelines.
* **KRIX Window Server**: High-performance compositing with macOS traffic lights, smooth dragging, and dock minimization.
* **Encrypted Local Storage**: Notes, Journal entries, and Passwords are preserved securely on local storage.
* **ThinkPad UltraNav Integration**: Respects the physical TrackPoint red-dot navigation and cooling profiles.`,
    preview: 'This system bridges the visual elegance, fluid gestures, and application ergonomics...',
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    isPinned: true,
    isFavorite: true,
    tags: ['Architecture', 'Windows11', 'ThinkPad'],
    checklist: [
      { id: 'c1', text: 'Verify 43 built-in application interfaces', done: true },
      { id: 'c2', text: 'Enforce local private storage for Journal and Notes', done: true },
      { id: 'c3', text: 'Verify Gemini 3.8 Flash intelligence integration', done: true },
      { id: 'c4', text: 'Optimize battery telemetry for RapidCharge', done: true },
    ],
  },
  {
    id: 'note-2',
    folderId: 'work',
    title: 'Lenovo ThinkPad X1 Carbon Tuning Guide',
    content: `## ThinkPad X1 Carbon Gen 11 System Diagnostics
* Display: 14.0" 2.8K OLED (2880 x 1800) calibrated for 100% DCI-P3 color gamut.
* TrackPoint: Middle-button smooth scrolling enabled.
* Thermal Profile: Intelligent Cooling set to Balanced mode.
* RapidCharge: Verified 80% recharge in under 60 minutes via 65W USB-C GaN adapter.`,
    preview: 'Display: 14.0" 2.8K OLED calibrated for 100% DCI-P3 color gamut...',
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    isPinned: true,
    isFavorite: false,
    tags: ['Hardware', 'Lenovo'],
  },
  {
    id: 'note-3',
    folderId: 'personal',
    title: 'Reading List & Creative Concepts',
    content: `### Books to finish this quarter:
1. *The Design of Everyday Things* - Don Norman
2. *Designing Interfaces* - Jenifer Tidwell
3. *Operating Systems: Three Easy Pieces*

### Ideas for KRIX Freeform:
* Sketching the next-generation multi-window layout.
* Mind-mapping hardware bridge drivers.`,
    preview: 'Books to finish this quarter: The Design of Everyday Things...',
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    isPinned: false,
    isFavorite: true,
    tags: ['Personal', 'Reading'],
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    date: new Date().toISOString().split('T')[0],
    time: '09:15 AM',
    title: 'A Milestone in Desktop Craftsmanship',
    content: `Today marks the full deployment of the KRIX application ecosystem. The sensation of running a seamless, macOS-inspired interface directly atop Windows 11 on my ThinkPad feels extraordinary. 

The keyboard responsiveness, the precision of the TrackPoint, and the subtle red accent lines bring a distinct identity that isn't just an emulation—it feels like an elevated professional workstation designed for serious focus.`,
    mood: 'productive',
    tags: ['Milestone', 'Focus', 'ThinkPad'],
    photos: [],
    prompt: 'What made you feel most accomplished in your work today?',
    isFavorite: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'journal-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '08:30 PM',
    title: 'Evening Reflection: Quiet Engineering',
    content: `Spent time refining the local data persistence and verifying that user privacy is strictly respected. There is something comforting about software that stores its notes and reflections right here on this machine, without leaking private thoughts to external telemetry or third-party servers.

Tomorrow: polish the soundscapes in KRIX Music and test chess minimax moves.`,
    mood: 'calm',
    tags: ['Reflection', 'Privacy', 'Evening'],
    photos: [],
    prompt: 'What is one boundary you preserved today for your peace of mind?',
    isFavorite: false,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'f1',
    name: 'Documents',
    path: '/',
    size: '1.2 GB',
    type: 'folder',
    updatedAt: 'Today at 09:20',
  },
  {
    id: 'f2',
    name: 'Projects',
    path: '/',
    size: '4.8 GB',
    type: 'folder',
    updatedAt: 'Yesterday',
  },
  {
    id: 'f3',
    name: 'Pictures',
    path: '/',
    size: '8.4 GB',
    type: 'folder',
    updatedAt: 'Oct 24, 2026',
  },
  {
    id: 'f4',
    name: 'Downloads',
    path: '/',
    size: '620 MB',
    type: 'folder',
    updatedAt: 'Today at 08:12',
  },
  {
    id: 'f5',
    name: 'ThinkPad_X1_Specs.pdf',
    path: '/Documents',
    size: '420 KB',
    type: 'document',
    updatedAt: 'Oct 22, 2026',
    content: 'Lenovo ThinkPad X1 Carbon Gen 11 Technical Specifications and Calibration Report.\n13th Gen Intel Core i7-1365U, 32GB LPDDR5, 2.8K OLED Display.\nAll diagnostics nominal.',
  },
  {
    id: 'f6',
    name: 'KRIX_Desktop_Manifest.json',
    path: '/Projects',
    size: '14 KB',
    type: 'code',
    updatedAt: 'Today at 07:45',
    content: '{\n  "version": "2.4.0",\n  "ecosystem": "macOS-Evolution-KRIX",\n  "platform": "Windows 11 Pro",\n  "applicationsCount": 43\n}',
  },
  {
    id: 'f7',
    name: 'ThinkPad_Carbon_Wallpaper.jpg',
    path: '/Pictures',
    size: '3.4 MB',
    type: 'image',
    updatedAt: 'Oct 15, 2026',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'f8',
    name: 'Q3_Financial_Review.pdf',
    path: '/Documents',
    size: '1.1 MB',
    type: 'document',
    updatedAt: 'Oct 20, 2026',
    content: 'Q3 Financial Review & Desktop Transformation Metrics.\nOperating Efficiency: +28%\nSystem Stability: 99.98%\nThinkPad Battery Endurance: 8.4 Hours average.',
  },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'KRIX Ecosystem Architecture Review',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 11:30 AM',
    category: 'work',
    location: 'ThinkPad Workstation / Conf Room 4A',
    notes: 'Presenting the complete 43-application suite to stakeholders.',
  },
  {
    id: 'ev-2',
    title: 'Lenovo Firmware & BIOS Update Check',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM - 02:30 PM',
    category: 'system',
    location: 'Lenovo Vantage Bridge',
    notes: 'Verify thermal table updates for 13th Gen Intel Core.',
  },
  {
    id: 'ev-3',
    title: 'Mindful Evening Journaling',
    date: new Date().toISOString().split('T')[0],
    time: '08:30 PM - 09:00 PM',
    category: 'personal',
    location: 'KRIX Journal',
    notes: 'Daily retrospective and goal planning for tomorrow.',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    listId: 'today',
    title: 'Review ThinkPad battery RapidCharge settings',
    completed: true,
    dueDate: 'Today, 11:00 AM',
    priority: 'high',
    notes: 'RapidCharge allows 80% charge in 60 minutes.',
  },
  {
    id: 'rem-2',
    listId: 'today',
    title: 'Test KRIX Notes checklists and markdown export',
    completed: false,
    dueDate: 'Today, 03:00 PM',
    priority: 'high',
    notes: 'Ensure persistent saving survives browser refresh.',
  },
  {
    id: 'rem-3',
    listId: 'work',
    title: 'Verify KRIX Passwords master key authentication',
    completed: false,
    dueDate: 'Tomorrow',
    priority: 'medium',
  },
  {
    id: 'rem-4',
    listId: 'work',
    title: 'Explore KRIX Freeform collaborative boards',
    completed: false,
    priority: 'low',
  },
];

export const INITIAL_CONTACTS: ContactItem[] = [
  {
    id: 'cnt-1',
    name: 'Krishiv Agarwal',
    company: 'KRIX Technologies',
    email: 'krishivagarwal5395@gmail.com',
    phone: '+1 (555) 349-8821',
    notes: 'Lead Systems Architect & Desktop Transformation Designer.',
    avatarColor: 'bg-red-600',
  },
  {
    id: 'cnt-2',
    name: 'Elena Rostova',
    company: 'Lenovo ThinkPad Engineering',
    email: 'elena.rostova@thinkpad-lab.com',
    phone: '+1 (555) 782-9904',
    notes: 'Hardware Thermal & UltraNav Firmware Liaison.',
    avatarColor: 'bg-blue-600',
  },
  {
    id: 'cnt-3',
    name: 'David Chen',
    company: 'Silicon Graphics Research',
    email: 'david.chen@sgr-innovations.io',
    phone: '+1 (555) 412-6630',
    notes: 'Window compositor and GPU acceleration specialist.',
    avatarColor: 'bg-emerald-600',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationMessage[] = [
  {
    id: 'n1',
    title: 'ThinkPad RapidCharge Active',
    body: 'AC power connected. Battery will reach 80% within 45 minutes.',
    appId: 'systeminfo',
    time: '10m ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'KRIX Notes Autosaved',
    body: 'All changes synced securely to encrypted local storage.',
    appId: 'notes',
    time: '35m ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Welcome to KRIX Desktop OS',
    body: '43 macOS-inspired built-in applications ready on Windows 11.',
    appId: 'settings',
    time: '1h ago',
    read: true,
  },
];
