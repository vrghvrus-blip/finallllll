import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, BookOpen, Gift, ArrowRight } from 'lucide-react';

interface NewbieGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReward: () => void;
}

export const NewbieGuideModal: React.FC<NewbieGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenReward,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-zinc-900">Newbie Profit Guide</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
            <h4 className="font-bold text-emerald-950 text-sm mb-1">
              Welcome to RsWallet Settlement Ecosystem
            </h4>
            <p className="text-emerald-800">
              RsWallet is an automated decentralized liquidity and settlement hub connecting UPI
              merchants with high-liquidity fiat & USDT channels.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Purchase Daily Quota</h5>
                <p className="text-zinc-600 mt-0.5">
                  Go to the <strong>Deposit</strong> tab, pick an active order (e.g., 10,000 INR).
                  You earn guaranteed <strong>3.5% daily income</strong> (+350 INR) plus full quota
                  liquidity returns.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Bind Authorized UPI Accounts</h5>
                <p className="text-zinc-600 mt-0.5">
                  Connect your Paytm, PhonePe, or IndusInd accounts in the <strong>UPI</strong> tab.
                  Toggle "on sale" to process verified inbound payments and accumulate instant trade
                  rebates.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">USDT High-Rate Exchange</h5>
                <p className="text-zinc-600 mt-0.5">
                  Deposit TRC-20 USDT at the preferential exchange rate of{' '}
                  <strong>1 USDT = 108.5 INR</strong>, significantly above standard market rate with 0%
                  fee on eligible tiers.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                4
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Team Multi-Tier Commissions</h5>
                <p className="text-zinc-600 mt-0.5">
                  Share your invite link from the <strong>Team</strong> tab. Earn up to 10% on direct
                  referrals and 5% secondary rewards whenever teammates complete recharges.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReward();
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition"
            >
              <Gift className="w-4 h-4" />
              <span>Claim Newbie Reward (₹20 + Daily Bonus)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NewbieRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimDaily: (amount: number) => void;
  alreadyClaimedToday: boolean;
}

export const NewbieRewardModal: React.FC<NewbieRewardModalProps> = ({
  isOpen,
  onClose,
  onClaimDaily,
  alreadyClaimedToday,
}) => {
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleClaim = () => {
    onClaimDaily(5);
    setClaimed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Decorative Header Banner */}
        <div className="relative bg-gradient-to-r from-rose-400 via-amber-400 to-orange-500 p-6 text-white text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-black/20 text-white hover:bg-black/30"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-2 shadow-inner">
            <Gift className="w-8 h-8 text-white drop-shadow" />
          </div>
          <h3 className="text-xl font-black tracking-tight">Newbie Rewards Center</h3>
          <p className="text-xs text-white/90 mt-1">Exclusive starter benefits for new members</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Welcome Bonus Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
                ₹20
              </div>
              <div>
                <div className="text-sm font-bold text-amber-950">Registration Welcome Bonus</div>
                <div className="text-xs text-amber-800">Credited directly to initial Quota</div>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Claimed ✓
            </span>
          </div>

          {/* Daily Check-in Card */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center shadow-sm">
                ₹5
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-900">Day 1 Daily Check-in</div>
                <div className="text-xs text-zinc-500">Collect free INR bonus every 24h</div>
              </div>
            </div>

            {alreadyClaimedToday || claimed ? (
              <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">
                Claimed
              </span>
            ) : (
              <button
                type="button"
                onClick={handleClaim}
                className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-zinc-800 active:scale-95 transition shadow-sm"
              >
                Claim ₹5
              </button>
            )}
          </div>

          {/* Task 1 Progress */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900">Newbie Recharge Task (1/1)</span>
              <span className="font-semibold text-emerald-600">+₹5 Bonus</span>
            </div>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full"></div>
            </div>
            <p className="text-[11px] text-zinc-500">
              Complete your first recharge to unlock next level milestone tasks!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
