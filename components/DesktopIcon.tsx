
import React from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-2 rounded cursor-pointer hover:bg-blue-500/30"
      onDoubleClick={onDoubleClick}
    >
      <div className="w-12 h-12 mb-1 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-white text-sm text-center shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </div>
  );
};
