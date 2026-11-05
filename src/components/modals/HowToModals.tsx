import React from 'react';
import { X, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface HowBindUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddNew: () => void;
}

export const HowBindUpiModal: React.FC<HowBindUpiModalProps> = ({
  isOpen,
  onClose,
  onOpenAddNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">How to bind UPI?</h3>
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
          <div className="bg-zinc-100 rounded-xl p-3.5">
            <span className="font-bold text-zinc-900">Why bind a UPI account?</span>
            <p className="mt-1 text-zinc-600">
              By authorizing your personal UPI handle, the settlement network assigns inbound
              orders directly through your account. You earn 3.5% commission rebates on every settled
              turnover!
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Find your UPI ID</h5>
                <p className="text-zinc-600 mt-0.5">
                  Open Paytm, Google Pay, or PhonePe. Tap your profile icon to copy your primary UPI
                  ID (e.g. <code>9096793517@ptyes</code> or <code>username@okaxis</code>).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Click "Add new account"</h5>
                <p className="text-zinc-600 mt-0.5">
                  Select your provider, paste the UPI ID, and input your verified phone number.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Toggle "on sale"</h5>
                <p className="text-zinc-600 mt-0.5">
                  Once Authorized, flip the toggle switch to <strong>on sale</strong>. Keep your
                  UPI app open or active in background to receive instant notifications.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddNew();
              }}
              className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition active:scale-95 shadow-sm"
            >
              Add New Account Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HowBuyQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowBuyQuotaModal: React.FC<HowBuyQuotaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">How Buy Quota?</h3>
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
          <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3.5">
            <span className="font-bold text-cyan-950 text-sm">What is Quota?</span>
            <p className="mt-1 text-cyan-800">
              Quota represents your daily liquidity bandwidth. Higher quota unlocks higher settlement
              allocations and yields <strong>3.5% guaranteed income per order cycle</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Select Your Preferred Quota</h5>
                <p className="text-zinc-600 mt-0.5">
                  Browse packages such as 10,000 INR (Income: 350, Quota: +10350) or 17,700 INR
                  (Income: 619.5, Quota: +18319.5).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Complete Recharge Payment</h5>
                <p className="text-zinc-600 mt-0.5">
                  Tap <strong>Buy</strong>, choose either UPI QR or USDT TRC20, and submit your UTR
                  reference number or transaction hash.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Instant Crediting & Milestones</h5>
                <p className="text-zinc-600 mt-0.5">
                  Your quota is credited within 3–5 minutes. Every completed buy order progresses your
                  Task milestone bar to unlock additional cash rewards (+₹5, +₹15, +₹50, etc.).
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
