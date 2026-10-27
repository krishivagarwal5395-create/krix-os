import React from 'react';
import { DesktopProvider } from './context/DesktopContext';
import { Desktop } from './components/desktop/Desktop';

export default function App() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}
