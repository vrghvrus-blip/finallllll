import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface MobileStatusBarProps {
  darkText?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({ darkText = true }) => {
  const [currentTime, setCurrentTime] = useState('11:57');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-5 pt-3 pb-2 flex items-center justify-between text-xs select-none ${
        darkText ? 'text-zinc-800' : 'text-white'
      }`}
    >
      {/* Left: Time and app notification icons */}
      <div className="flex items-center gap-2 font-medium tracking-tight">
        <span className="font-bold text-[13px]">{currentTime}</span>
        {/* Subtle status icons */}
        <div className="flex items-center gap-1.5 opacity-80 scale-90">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.9C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
          </svg>
        </div>
      </div>

      {/* Right: Network status & Battery */}
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-tighter">
        <span className="text-[9px] font-mono opacity-75">Vo) 1</span>
        <span className="text-[8px] font-bold border border-current px-0.5 rounded leading-none">LTE2</span>
        <span className="text-[9px] font-mono opacity-80">5.40 KB/s</span>
        <span className="text-[9px] font-black">5G</span>
        <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
        <div className="flex items-center ml-0.5">
          <Battery className="w-4 h-4 fill-current stroke-[2]" />
        </div>
      </div>
    </div>
  );
};
