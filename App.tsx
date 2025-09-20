import React, { useState, useCallback, FC, useEffect } from 'react';
import { Window, WindowProps } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { DesktopIcon } from './components/DesktopIcon';
import { YTDownloaderApp } from './components/apps/YTDownloaderApp';
import { BootScreen } from './components/BootScreen';

const WindowsLogo: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

const YouTubeIcon: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path fill="#FF0000" d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
    </svg>
);


const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowProps[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 4000); // Simulate a 4-second boot time

    return () => clearTimeout(timer);
  }, []);

  const openWindow = useCallback((appId: string, title: string, content: React.ReactNode) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.id === appId);
      if (existingWindow) {
        return prev.map(w => w.id === appId ? { ...w, zIndex: nextZIndex, minimized: false } : w);
      }
      const newWindow: WindowProps = {
        id: appId,
        title,
        children: content,
        initialPosition: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
        initialSize: { width: 640, height: 480 },
        zIndex: nextZIndex,
        minimized: false,
        onClose: () => closeWindow(appId),
        onMinimize: () => minimizeWindow(appId),
        onFocus: () => focusWindow(appId),
      };
      return [...prev, newWindow];
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  };
  
  const restoreWindow = (id: string) => {
      focusWindow(id);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w));
    setNextZIndex(prev => prev + 1);
  };

  const openYTDownloader = () => {
    openWindow('yt-downloader', 'WinTube Downloader', <YTDownloaderApp />);
  };

  if (isBooting) {
    return <BootScreen />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center font-sans animate-fade-in">
      <main className="h-full w-full p-4">
        <DesktopIcon
          icon={<YouTubeIcon />}
          label="WinTube Downloader"
          onDoubleClick={openYTDownloader}
        />
      </main>

      {windows.map(win => (
        <Window key={win.id} {...win} />
      ))}
      
      <Taskbar openWindows={windows} onRestore={restoreWindow} startIcon={<WindowsLogo />}/>
    </div>
  );
};

export default App;