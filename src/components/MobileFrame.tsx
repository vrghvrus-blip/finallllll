import React, { useState, useEffect } from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  onResetData?: () => void;
  onOpenNativeApp?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if running as standalone native PWA / installed app
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
    };

    checkStandalone();
  }, []);

  // When installed natively on device, run full screen with zero outer bezels
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-zinc-800 selection:text-white flex flex-col justify-between pt-safe pb-safe">
        <div className="w-full max-w-lg mx-auto px-4 min-h-screen flex flex-col justify-between pt-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111317] flex flex-col items-center justify-start text-zinc-900 font-sans antialiased selection:bg-zinc-800 selection:text-white">
      {/* Main Container */}
      <div className="w-full flex-1 flex items-start justify-center p-0 sm:py-6 sm:px-4">
        <div className="w-full bg-white relative max-w-[420px] sm:rounded-[48px] sm:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] sm:border-[10px] sm:border-zinc-800 sm:ring-1 sm:ring-white/10 overflow-hidden min-h-screen sm:min-h-[840px]">
          {/* Screen Body */}
          <div className="px-4 min-h-screen sm:min-h-[820px] flex flex-col justify-between pt-2">
            {children}
          </div>

          {/* Bottom Native Gesture Navigation Bar indicator (in mobile frame mode) */}
          <div className="h-4 w-full bg-white flex items-center justify-center select-none pb-1">
            <div className="w-32 h-1 bg-zinc-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
