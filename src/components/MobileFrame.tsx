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
    <div className="min-h-screen bg-zinc-50 sm:bg-zinc-100/70 flex flex-col items-center justify-start text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* Main Container */}
      <div className="w-full flex-1 flex items-start justify-center p-0 sm:py-6 sm:px-4">
        <div className="w-full bg-white relative max-w-[460px] sm:rounded-3xl sm:border sm:border-zinc-200/80 sm:shadow-[0_4px_24px_rgba(0,0,0,0.04)] min-h-screen sm:min-h-[840px] flex flex-col justify-between">
          {/* Screen Body */}
          <div className="px-4 sm:px-5 min-h-screen sm:min-h-[840px] flex flex-col justify-between pt-3 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
