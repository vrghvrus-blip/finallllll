import React, { useState } from 'react';
import { X, Play, Pause, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { FreeChargeLogoTile, IndusIndLogoTile, PhonePeMultiLogoTile } from '../PaymentLogos';

interface TutorialModalProps {
  type: 'freecharge' | 'indus' | 'phonepe' | null;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ type, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!type) return null;

  const contentMap = {
    freecharge: {
      title: 'How to link to FreeCharge?',
      subtitle: 'Fast 1-click binding for FreeCharge Wallet & UPI VPA',
      logo: <FreeChargeLogoTile className="w-14 h-14" />,
      steps: [
        'Open FreeCharge App > Go to Account & Security settings.',
        'Find your Registered UPI Handle (e.g., mobilenumber@freecharge).',
        'Verify your phone number matches your RsWallet account.',
        'Add the VPA inside RsWallet UPI tab and toggle to "on sale".',
      ],
      videoTime: '01:45',
    },
    indus: {
      title: 'How to link to Indus?',
      subtitle: 'IndusInd Bank NetBanking & UPI direct settlement setup',
      logo: <IndusIndLogoTile className="w-14 h-14" />,
      steps: [
        'Open IndusInd Mobile Banking or BHIM Indus Pay.',
        'Navigate to UPI Services > Manage Virtual Payment Addresses.',
        'Check that daily merchant collection limits are set to standard ₹1,00,000.',
        'Paste your @indus UPI ID into RsWallet to authorize automated settlements.',
      ],
      videoTime: '02:10',
    },
    phonepe: {
      title: 'How to link to PhonePe and other?',
      subtitle: 'Complete guide for PhonePe (@ybl / @ibl / @axl), Airtel, and MobiKwik',
      logo: <PhonePeMultiLogoTile className="w-14 h-14" />,
      steps: [
        'Open PhonePe > Tap your profile picture at top-left corner.',
        'Select "UPI IDs" (e.g. yournumber@ybl or custom username@ibl).',
        'Ensure the status shows "Activated" in green.',
        'Enter this exact ID into RsWallet "Add new account" to begin.',
      ],
      videoTime: '02:30',
    },
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {current.logo}
            <div>
              <h3 className="text-sm font-black text-zinc-900 leading-tight">{current.title}</h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">{current.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Mock */}
        <div className="relative bg-zinc-950 aspect-video flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-zinc-900 animate-pulse">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin mb-3"></div>
              <p className="text-xs font-semibold text-zinc-200">Playing Setup Video Guide...</p>
              <span className="text-[10px] text-zinc-400 mt-1">Tap to pause</span>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-white p-4">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer">
                <Play className="w-6 h-6 fill-white text-white ml-1" />
              </div>
              <span className="text-xs font-bold mt-2">Watch Guided Walkthrough ({current.videoTime})</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 w-full h-full opacity-0"
            aria-label="Toggle playback"
          />
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-5 overflow-y-auto space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Step by Step Guide</h4>
          <div className="space-y-3">
            {current.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-zinc-700 leading-snug">{step}</p>
              </div>
            ))}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-zinc-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Bank-grade 256-bit automated encryption safeguards all linked UPI VPAs.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition"
          >
            I Understand, Continue
          </button>
        </div>
      </div>
    </div>
  );
};
