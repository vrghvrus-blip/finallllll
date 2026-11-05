import React, { useState, useEffect } from 'react';
import { Fingerprint, Scan, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface BiometricPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle?: string;
  biometricType?: 'fingerprint' | 'face_id';
}

export const BiometricPromptModal: React.FC<BiometricPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Authorize Transaction',
  biometricType = 'fingerprint',
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setIsVerified(false);
      // Simulate native biometric sensor detection after 1.2s
      const timer = setTimeout(() => {
        setIsScanning(false);
        setIsVerified(true);
        const finishTimer = setTimeout(() => {
          onSuccess();
          onClose();
        }, 700);
        return () => clearTimeout(finishTimer);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xs rounded-3xl p-6 text-center shadow-2xl relative border border-zinc-100 flex flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-full text-[11px] font-bold text-zinc-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>SharkPay Secure Guard</span>
          </div>
        </div>

        <h3 className="text-base font-black text-zinc-950 mt-1">{actionTitle}</h3>
        <p className="text-xs text-zinc-500 mt-1">
          {biometricType === 'face_id'
            ? 'Looking for Face ID...'
            : 'Touch the fingerprint sensor'}
        </p>

        {/* Biometric Sensor Visual */}
        <div className="my-6 relative flex items-center justify-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isVerified
                ? 'bg-emerald-100 text-emerald-600 scale-105'
                : isScanning
                ? 'bg-blue-50 text-blue-600 animate-pulse'
                : 'bg-zinc-100 text-zinc-400'
            }`}
          >
            {isVerified ? (
              <CheckCircle2 className="w-12 h-12 stroke-[2.2] animate-in zoom-in" />
            ) : biometricType === 'face_id' ? (
              <Scan className="w-12 h-12 stroke-[2] animate-pulse" />
            ) : (
              <Fingerprint className="w-12 h-12 stroke-[2] animate-pulse" />
            )}
          </div>

          {/* Radar Ring during scan */}
          {isScanning && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping pointer-events-none" />
          )}
        </div>

        <div className="text-xs font-semibold text-zinc-600">
          {isVerified ? (
            <span className="text-emerald-700 font-bold">Biometrics Verified ✓</span>
          ) : (
            <span>Verifying device credentials...</span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 text-xs text-zinc-500 hover:text-zinc-900 font-semibold"
        >
          Use UPI PIN instead
        </button>
      </div>
    </div>
  );
};
