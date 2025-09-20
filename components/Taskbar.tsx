
import React, { useState, useEffect, FC } from 'react';
import { WindowProps } from './Window';

interface TaskbarProps {
  startIcon: React.ReactNode;
  openWindows: WindowProps[];
  onRestore: (id: string) => void;
}

const YouTubeIconSmall: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path fill="#FF0000" d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
    </svg>
);


export const Taskbar: React.FC<TaskbarProps> = ({ startIcon, openWindows, onRestore }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/70 backdrop-blur-xl flex items-center justify-between px-2 text-white z-50">
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-white/20 rounded">
          {startIcon}
        </button>
        {openWindows.map(win => (
            <button 
                key={win.id}
                onClick={() => onRestore(win.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded ${win.minimized ? 'bg-white/10' : 'bg-blue-500/50'} hover:bg-white/20 border-b-2 ${win.minimized ? 'border-transparent' : 'border-blue-300'}`}
            >
                <YouTubeIconSmall />
                <span className="text-sm">{win.title}</span>
            </button>
        ))}
      </div>
      <div className="text-right text-xs px-2 py-1 bg-black/20 rounded">
        <div>{formatTime(time)}</div>
        <div>{formatDate(time)}</div>
      </div>
    </footer>
  );
};
