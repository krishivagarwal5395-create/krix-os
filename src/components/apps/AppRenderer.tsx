import React from 'react';
import { FinderApp } from './FinderApp';
import { NotesApp } from './NotesApp';
import { JournalApp } from './JournalApp';
import { CalendarApp } from './CalendarApp';
import { RemindersApp } from './RemindersApp';
import { ContactsApp } from './ContactsApp';
import { PreviewApp } from './PreviewApp';
import { FreeformApp } from './FreeformApp';
import { CalculatorApp } from './CalculatorApp';
import { DictionaryApp } from './DictionaryApp';
import { ChessApp } from './ChessApp';
import { ShortcutsApp } from './ShortcutsApp';
import { VoiceMemosApp } from './VoiceMemosApp';
import { ScreenshotApp } from './ScreenshotApp';
import { PhotosApp } from './PhotosApp';
import { MusicApp } from './MusicApp';
import { MediaApp } from './MediaApp';
import { DrawingStudioApp } from './DrawingStudioApp';
import { CameraApp } from './CameraApp';
import { ScreenRecordingApp } from './ScreenRecordingApp';
import { BrowserApp } from './BrowserApp';
import { MessagesApp } from './MessagesApp';
import { CallStudioApp } from './CallStudioApp';
import { MapsApp } from './MapsApp';
import { WeatherApp } from './WeatherApp';
import { MailApp } from './MailApp';
import { SettingsApp } from './SettingsApp';
import { ControlCenterApp } from './ControlCenterApp';
import { ActivityMonitorApp } from './ActivityMonitorApp';
import { StorageApp } from './StorageApp';
import { TerminalApp } from './TerminalApp';
import { ArchiveUtilityApp } from './ArchiveUtilityApp';
import { PasswordsApp } from './PasswordsApp';
import { AppLibraryApp } from './AppLibraryApp';
import { SystemInfoApp } from './SystemInfoApp';
import { ClockApp } from './ClockApp';
import { DesktopWidgetsApp } from './DesktopWidgetsApp';
import { TrashApp } from './TrashApp';
import { IntelligenceApp } from './IntelligenceApp';
import { WritingAssistantApp } from './WritingAssistantApp';
import { ImageStudioApp } from './ImageStudioApp';
import { ResearchApp } from './ResearchApp';
import { AutomationApp } from './AutomationApp';

interface AppRendererProps {
  appId: string;
  initialParams?: any;
}

export const AppRenderer: React.FC<AppRendererProps> = ({ appId, initialParams }) => {
  switch (appId) {
    case 'finder':
      return <FinderApp />;
    case 'notes':
      return <NotesApp />;
    case 'journal':
      return <JournalApp />;
    case 'calendar':
      return <CalendarApp />;
    case 'reminders':
      return <RemindersApp />;
    case 'contacts':
      return <ContactsApp />;
    case 'preview':
      return <PreviewApp initialParams={initialParams} />;
    case 'freeform':
      return <FreeformApp />;
    case 'calculator':
      return <CalculatorApp />;
    case 'dictionary':
      return <DictionaryApp />;
    case 'chess':
      return <ChessApp />;
    case 'shortcuts':
      return <ShortcutsApp />;
    case 'voicememos':
      return <VoiceMemosApp />;
    case 'screenshot':
      return <ScreenshotApp />;
    case 'photos':
      return <PhotosApp />;
    case 'music':
      return <MusicApp />;
    case 'media':
      return <MediaApp />;
    case 'drawing':
      return <DrawingStudioApp />;
    case 'camera':
      return <CameraApp />;
    case 'screenrecording':
      return <ScreenRecordingApp />;
    case 'browser':
      return <BrowserApp />;
    case 'messages':
      return <MessagesApp />;
    case 'callstudio':
      return <CallStudioApp />;
    case 'maps':
      return <MapsApp />;
    case 'weather':
      return <WeatherApp />;
    case 'mail':
      return <MailApp />;
    case 'settings':
      return <SettingsApp />;
    case 'controlcenter':
      return <ControlCenterApp />;
    case 'activitymonitor':
      return <ActivityMonitorApp />;
    case 'storage':
      return <StorageApp />;
    case 'terminal':
      return <TerminalApp />;
    case 'archiveutility':
      return <ArchiveUtilityApp />;
    case 'passwords':
      return <PasswordsApp />;
    case 'applibrary':
      return <AppLibraryApp />;
    case 'systeminfo':
      return <SystemInfoApp />;
    case 'clock':
      return <ClockApp />;
    case 'desktopwidgets':
      return <DesktopWidgetsApp />;
    case 'trash':
      return <TrashApp />;
    case 'intelligence':
      return <IntelligenceApp initialPrompt={initialParams?.prompt} />;
    case 'writingassistant':
      return <WritingAssistantApp initialText={initialParams?.initialText} />;
    case 'imagestudio':
      return <ImageStudioApp />;
    case 'research':
      return <ResearchApp />;
    case 'automation':
      return <AutomationApp />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-xs text-slate-400">
          Application loaded: {appId}
        </div>
      );
  }
};
