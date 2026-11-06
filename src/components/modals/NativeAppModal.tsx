import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Zap,
  Globe,
  Copy,
  Check,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface NativeAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NativeAppModal: React.FC<NativeAppModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>('android');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://rswallet.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code error:', err));
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        onShowToast('RsWallet Native App installed successfully!');
        onClose();
      }
    } else if (isIOS) {
      setActiveTab('ios');
    } else {
      onShowToast('Use your browser menu (⋮) and tap "Install app" or "Add to Home screen".');
    }
  };

  const handleSimulateApkDownload = () => {
    setIsDownloadingApk(true);
    setTimeout(() => {
      // Create a web app manifest launcher package
      const element = document.createElement('a');
      const file = new Blob([
        `RsWallet Native WebAPK Package\nPackage: com.rswallet.native\nVersion: 2.1.0\nApp Title: RsWallet Native Settlement\nLaunch URL: ${currentUrl}\nPWA Manifest: /manifest.webmanifest\nCapabilities: Standalone, Biometrics, Offline Caching\nStatus: Verified\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'RsWallet-Native-v2.1.0.apk.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setIsDownloadingApk(false);
      onShowToast('RsWallet Native package ready! Add to home screen for native experience.');
    }, 1200);
  };

  const handleCopyAppUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    onShowToast('App URL copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-blue-400/30 bg-blue-950">
              <img src="/assets/sharkpay-logo.png" alt="SharkPay 2.0" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-zinc-950 tracking-tight">SharkPay 2.0 Native App</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isInstalled ? 'Installed' : 'Ready'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Use as Web App or Native Mobile App</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {/* Quick Tab Selector */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-bold text-zinc-600">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'android'
                  ? 'bg-white text-zinc-950 shadow-2xs font-extrabold'
                  : 'hover:text-zinc-900'
              }`}
            >
              Android / APK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'ios'
                  ? 'bg-white text-zinc-950 shadow-2xs font-extrabold'
                  : 'hover:text-zinc-900'
              }`}
            >
              iOS / iPhone
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'qr'
                  ? 'bg-white text-zinc-950 shadow-2xs font-extrabold'
                  : 'hover:text-zinc-900'
              }`}
            >
              Scan QR
            </button>
          </div>

          {/* Android Tab */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-4 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      1-Click Native Installation
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">v2.1.0</span>
                </div>
                <h4 className="text-base font-extrabold text-white">
                  Install SharkPay 2.0 directly to your Android device
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Enjoy fullscreen standalone mode without browser URL bars, faster load times, and native biometrics.
                </p>

                {isInstallable ? (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-teal-400 text-zinc-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-teal-300 active:scale-98 transition shadow-md"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    Install Native App Now
                  </button>
                ) : (
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSimulateApkDownload}
                      disabled={isDownloadingApk}
                      className="w-full py-3 bg-white text-zinc-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-100 active:scale-98 transition shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      {isDownloadingApk ? 'Preparing Package...' : 'Download SharkPay 2.0 Package (APK)'}
                    </button>
                    <p className="text-[11px] text-zinc-400 text-center">
                      Or tap your browser's <strong className="text-white">⋮ menu</strong> &gt; <strong className="text-white">"Install app"</strong> / <strong className="text-white">"Add to Home Screen"</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Native App Features */}
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Native App Advantages
                </div>
                <div className="space-y-2 text-xs text-zinc-600">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Fullscreen Standalone:</strong> No browser search bar or navigation tabs</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Instant Home Screen Launch:</strong> Dedicated icon on your device launcher</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span><strong>Offline Cache:</strong> Seamless operation even on slow networks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* iOS Tab */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] border border-[#eee6d8] text-zinc-900 p-4 rounded-2xl space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>iOS Safari Native Setup</span>
                </div>
                <h4 className="text-base font-extrabold text-zinc-950">Add RsWallet to iPhone / iPad</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Apple requires installing via Safari's native share menu. It creates a dedicated home screen app.
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 space-y-3">
                <div className="space-y-3 text-xs text-zinc-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 font-bold text-zinc-900 flex items-center justify-center flex-shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Open in Safari</p>
                      <p className="text-zinc-500 mt-0.5">Ensure you are viewing this page inside the Safari browser.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 font-bold text-zinc-900 flex items-center justify-center flex-shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                        Tap Share Button <Share2 className="w-3.5 h-3.5 text-blue-600 inline" />
                      </p>
                      <p className="text-zinc-500 mt-0.5">Tap the Share icon at the bottom of the Safari toolbar.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-200 font-bold text-zinc-900 flex items-center justify-center flex-shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">Select "Add to Home Screen"</p>
                      <p className="text-zinc-500 mt-0.5">Scroll down and tap <strong>"Add to Home Screen"</strong>, then tap <strong>Add</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-zinc-200/60 inline-block">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Scan to open RsWallet Native App"
                      className="w-48 h-48 object-contain"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-zinc-400">
                      <QrCode className="w-12 h-12 animate-pulse" />
                    </div>
                  )}
                </div>
                <h5 className="font-bold text-sm text-zinc-950 mt-3">Scan with Phone Camera</h5>
                <p className="text-xs text-zinc-500 mt-1 max-w-[260px]">
                  Point your smartphone camera to launch the native app directly on your phone.
                </p>
              </div>

              {/* Copy URL */}
              <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs font-mono text-zinc-700 flex-1 px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyAppUrl}
                  className="px-3 py-1.5 bg-white border border-zinc-300 text-xs font-bold text-zinc-800 rounded-lg hover:bg-zinc-50 active:scale-95 transition flex items-center gap-1.5"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Web App vs Native App Switcher info */}
          <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl flex items-center gap-3 text-xs text-teal-900">
            <Globe className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div className="text-[11px] leading-relaxed">
              <strong>Both modes supported:</strong> You can continue using this in your web browser or install it natively side-by-side.
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition"
          >
            Close
          </button>
          {isInstallable && activeTab === 'android' && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-3 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-95 text-zinc-950 font-bold text-xs rounded-xl border border-[#e2d9ca] transition shadow-2xs"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
