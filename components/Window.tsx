
import React, { useState, useRef, useEffect, useCallback, FC } from 'react';

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const MinimizeIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const MaximizeIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3z" />
  </svg>
);

const CloseIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 500, height: 400 },
  zIndex,
  minimized,
  onClose,
  onMinimize,
  onFocus,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onFocus();
    setIsDragging(true);
    if (windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }
  }, [onFocus]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (minimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col bg-neutral-200 border border-neutral-400 rounded-lg shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        display: minimized ? 'none' : 'flex'
      }}
      onMouseDown={onFocus}
    >
      <header
        className="flex items-center justify-between bg-blue-600 text-white px-2 py-1 rounded-t-lg select-none cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <span className="font-bold text-sm">{title}</span>
        <div className="flex items-center space-x-1">
          <button onClick={onMinimize} className="p-1 hover:bg-blue-500 rounded"><MinimizeIcon /></button>
          <button className="p-1 hover:bg-blue-500 rounded"><MaximizeIcon /></button>
          <button onClick={onClose} className="p-1 hover:bg-red-500 rounded"><CloseIcon /></button>
        </div>
      </header>
      <div className="flex-grow p-2 overflow-y-auto bg-white">
        {children}
      </div>
    </div>
  );
};
