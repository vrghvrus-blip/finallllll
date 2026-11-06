import React, { useState } from 'react';
import { X, Sparkles, Trophy, Check, ArrowRight } from 'lucide-react';

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWinReward: (amount: number) => void;
}

interface WheelSegment {
  label: string;
  amount: number;
  color: string;
  textColor: string;
}

const SEGMENTS: WheelSegment[] = [
  { label: '₹10', amount: 10, color: '#f59e0b', textColor: '#ffffff' },
  { label: '₹50', amount: 50, color: '#3b82f6', textColor: '#ffffff' },
  { label: '₹20', amount: 20, color: '#ec4899', textColor: '#ffffff' },
  { label: '₹250', amount: 250, color: '#10b981', textColor: '#ffffff' },
  { label: '₹100', amount: 100, color: '#8b5cf6', textColor: '#ffffff' },
  { label: '₹500', amount: 500, color: '#06b6d4', textColor: '#ffffff' },
  { label: '₹1,000', amount: 1000, color: '#f97316', textColor: '#ffffff' },
  { label: '₹100K', amount: 100000, color: '#eab308', textColor: '#000000' },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  onWinReward,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setHasWon(false);
    setWonAmount(null);

    // Pick a winning index with weighted probability (e.g. ₹50 or ₹100 or ₹250 or ₹500)
    // Indexes: 0=₹10, 1=₹50, 2=₹20, 3=₹250, 4=₹100, 5=₹500, 6=₹1000, 7=₹100K
    const candidateIndexes = [0, 1, 2, 3, 4, 5];
    const winningIndex = candidateIndexes[Math.floor(Math.random() * candidateIndexes.length)];
    const segmentAngle = 360 / SEGMENTS.length; // 45 deg

    // Rotation calculation so arrow at top (90 deg or 270 deg) lands on chosen segment
    // With 5 full rotations (1800 deg) + offset
    const extraRotations = 1800 + (360 - (winningIndex * segmentAngle + segmentAngle / 2));
    const targetRotation = rotation + extraRotations;

    setRotation(targetRotation);

    setTimeout(() => {
      const prize = SEGMENTS[winningIndex].amount;
      setIsSpinning(false);
      setWonAmount(prize);
      setHasWon(true);
      onWinReward(prize);
    }, 4200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight flex items-center gap-1.5">
                <span>Lucky Wheel</span>
                <span className="text-[10px] bg-white text-amber-700 px-2 py-0.5 rounded-full font-black uppercase">
                  100% Win
                </span>
              </h3>
              <p className="text-[11px] text-amber-100">Spin & Win up to ₹100,000 Cash!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-center">
          {/* Wheel Graphic Container */}
          <div className="relative w-64 h-64 mx-auto my-2 flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-500 drop-shadow-md"></div>

            {/* Glowing Outer Ring */}
            <div className="w-60 h-60 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] flex items-center justify-center">
              {/* Spinning Canvas */}
              <div
                className="w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.9,0.25,1)]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* 8 Slices using SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {SEGMENTS.map((seg, i) => {
                    const startAngle = (i * 45 * Math.PI) / 180;
                    const endAngle = ((i + 1) * 45 * Math.PI) / 180;
                    const x1 = 50 + 50 * Math.cos(startAngle);
                    const y1 = 50 + 50 * Math.sin(startAngle);
                    const x2 = 50 + 50 * Math.cos(endAngle);
                    const y2 = 50 + 50 * Math.sin(endAngle);
                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                    // Label position
                    const midAngle = ((i + 0.5) * 45 * Math.PI) / 180;
                    const textX = 50 + 32 * Math.cos(midAngle);
                    const textY = 50 + 32 * Math.sin(midAngle);
                    const textRotate = (i + 0.5) * 45 + 90;

                    return (
                      <g key={i}>
                        <path d={pathData} fill={seg.color} stroke="#ffffff" strokeWidth="0.8" />
                        <text
                          x={textX}
                          y={textY}
                          fill={seg.textColor}
                          fontSize="7"
                          fontWeight="900"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textRotate}, ${textX}, ${textY})`}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center Hub */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-xs font-black text-amber-950 uppercase tracking-tight">
                      GO!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Win Status Display */}
          {hasWon && wonAmount !== null ? (
            <div className="p-4 bg-gradient-to-b from-amber-50 to-orange-50/50 border border-amber-200 rounded-2xl animate-in zoom-in-95 space-y-1 shadow-xs">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-700">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Congratulations!</span>
              </div>
              <div className="text-2xl font-black text-zinc-950">
                +₹{wonAmount.toLocaleString()} INR
              </div>
              <p className="text-xs text-zinc-600">
                Prize credited directly into your SharkPay active quota & balance!
              </p>
            </div>
          ) : (
            <div className="bg-[#fdfcf9] border border-[#eee6d8] rounded-2xl p-3 text-xs text-zinc-600 shadow-2xs">
              <span className="font-bold text-zinc-900">Guaranteed Return:</span> Every spin awards cash prizes ranging from ₹10 to ₹100,000!
            </div>
          )}

          {/* Spin Action Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSpinning}
              onClick={handleSpin}
              className="w-full py-3.5 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-[0.98] text-zinc-950 font-black text-sm rounded-2xl border border-[#e2d9ca] transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSpinning ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <span>Spinning Lucky Wheel...</span>
                </>
              ) : hasWon ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>Spin Again (Daily Free Spin)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>SPIN NOW (Free Spin)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
