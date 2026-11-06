import React, { useState } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isStandalone, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('sharkpay_pwa_banner_dismissed') === 'true';
  });
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running standalone or installed, or user dismissed for this session
  if (isInstalled || isStandalone || isDismissed) {
    return null;
  }

  // Only show if browser provides install prompt or if on iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('sharkpay_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    setIsInstalling(true);
    try {
      await install();
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] text-zinc-900 p-3.5 rounded-2xl shadow-xl border border-[#eee6d8] backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-300">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1961e6] to-cyan-400 p-0.5 shrink-0 flex items-center justify-center shadow-2xs">
            <img
              src="/pwa-192x192.png"
              alt="SharkPay 2.0"
              className="w-full h-full object-cover rounded-[10px]"
              onError={(e) => {
                // fallback to icon if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-zinc-950 truncate">Install SharkPay 2.0</span>
              <span className="text-[9px] font-bold bg-[#1961e6] text-white px-1.5 py-0.2 rounded-full shrink-0">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium truncate">
              {isIOS ? 'Add to Home Screen for fullscreen app' : 'Install for offline access & faster loads'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="px-3.5 py-2 bg-gradient-to-r from-[#1961e6] to-[#0ea5e9] text-white rounded-xl text-xs font-black tracking-wide shadow-2xs hover:brightness-110 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isIOS ? 'Install' : 'Install App'}</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg transition cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#f4efe6] text-zinc-900 border border-[#e2d9ca] flex items-center justify-center font-black">
                  SP
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-950">Install on iPhone / iPad</h3>
                  <p className="text-[11px] text-zinc-500 font-medium">Apple Safari Quick Steps</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-600 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  Tap the <strong className="text-zinc-900">Share</strong> button in Safari's bottom toolbar (<Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" />).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  Scroll down and tap <strong className="text-zinc-900">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-zinc-700" />).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  Tap <strong className="text-zinc-900">Add</strong> in the top-right corner. SharkPay 2.0 will launch like a native app!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-95 text-zinc-950 font-bold text-xs rounded-xl border border-[#e2d9ca] transition shadow-2xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
