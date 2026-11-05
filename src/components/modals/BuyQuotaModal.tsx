import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, Copy, Check, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';
import { QuotaPackage } from '../../types/rswallet';

interface BuyQuotaModalProps {
  pkg: QuotaPackage | null;
  userBalance?: number;
  onClose: () => void;
  onConfirmPurchase: (pkg: QuotaPackage, utr: string) => void;
}

export const BuyQuotaModal: React.FC<BuyQuotaModalProps> = ({
  pkg,
  userBalance = 0,
  onClose,
  onConfirmPurchase,
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'balance'>('upi');
  const [timeLeft, setTimeLeft] = useState(899); // 15 mins
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const merchantUpi = 'vrghvrus-4@okaxis';

  useEffect(() => {
    if (!pkg) return;
    const upiPayLink = `upi://pay?pa=${merchantUpi}&pn=RsWalletMerchant&am=${pkg.amount}&cu=INR&tn=QuotaOrder${pkg.id}`;
    QRCode.toDataURL(upiPayLink, { width: 180, margin: 1 })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [pkg]);

  if (!pkg) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleConfirm = () => {
    if (paymentMethod === 'upi') {
      const cleanUtr = utrNumber.trim();
      if (!/^\d{12}$/.test(cleanUtr)) {
        setError('Please enter a valid 12-digit numeric UPI Ref / UTR number');
        return;
      }
    } else {
      if (userBalance < pkg.amount) {
        setError(`Insufficient wallet balance. You have ₹${userBalance.toLocaleString()}, but this order requires ₹${pkg.amount.toLocaleString()}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');
    setTimeout(() => {
      onConfirmPurchase(pkg, paymentMethod === 'upi' ? utrNumber.trim() : `BAL-REF-${Date.now().toString().slice(-8)}`);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-zinc-950">Purchase Quota Order</h3>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Expires in {minutes}:{seconds}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Order Amount</span>
              <strong className="text-sm font-black text-zinc-900">
                {pkg.amount.toLocaleString()} INR
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Guaranteed Income</span>
              <strong className="text-xs font-bold text-emerald-600">
                +{pkg.income} ({pkg.incomePercent}%)
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Credited Quota</span>
              <strong className="text-xs font-bold text-teal-600">
                +{pkg.quota.toLocaleString()} INR
              </strong>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border text-center transition ${
                paymentMethod === 'upi'
                  ? 'border-black bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-white text-zinc-700 font-medium'
              }`}
            >
              <div className="text-xs">Direct UPI QR</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('balance')}
              className={`p-3 rounded-xl border text-center transition ${
                paymentMethod === 'balance'
                  ? 'border-black bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-white text-zinc-700 font-medium'
              }`}
            >
              <div className="text-xs">Wallet Balance</div>
            </button>
          </div>

          {paymentMethod === 'upi' ? (
            <div className="space-y-3">
              {/* Official SharkPay 2.0 UPI QR Stand */}
              <div className="bg-gradient-to-b from-[#0a1128] via-[#0d1b3a] to-[#080d1a] border border-blue-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    Official UPI QR Stand
                  </span>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                    GPay • PhonePe • Paytm
                  </span>
                </div>

                {/* The Uploaded Official Stand Photo */}
                <div className="relative my-2 rounded-xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] max-w-[210px] bg-black">
                  <img
                    src="/assets/aistudio/IMG_20261105_184316_1e6b18e8.png"
                    alt="SharkPay 2.0 Official UPI QR"
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open('/assets/aistudio/IMG_20261105_184316_1e6b18e8.png', '_blank')}
                  />
                </div>

                <p className="text-[11px] text-zinc-300 font-medium mt-1 text-center">
                  Scan Stand QR above with any UPI app to pay
                </p>

                {/* Bank Account info from photo */}
                <div className="w-full mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="text-zinc-400">Bank Account:</span>
                  <span className="font-bold text-white">Bank Of Maharashtra **** 4002</span>
                </div>
              </div>

              {/* VPA copy card */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Merchant UPI ID</div>
                  <div className="text-xs font-mono font-black text-zinc-900">{merchantUpi}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="px-3.5 py-1.5 bg-black text-white hover:bg-zinc-800 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition shadow-xs cursor-pointer"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVpa ? 'Copied' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* UTR Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700">12-Digit NPCI UTR Number</label>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleUtr = `4307${Math.floor(10000000 + Math.random() * 90000000)}`;
                      setUtrNumber(sampleUtr);
                      setError('');
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Generate Bank UTR
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="Enter 12-digit UTR from your bank"
                  value={utrNumber}
                  onChange={(e) => {
                    setUtrNumber(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-black font-mono tracking-wider"
                />
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Available Balance:</span>
                <span className="font-bold text-zinc-900">₹{userBalance.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Order Amount:</span>
                <span className="font-bold text-zinc-900">₹{pkg.amount.toLocaleString()}</span>
              </div>
              <div className="border-t border-zinc-200/80 pt-1 flex items-center justify-between">
                <span className="text-zinc-500 font-medium">Remaining Balance:</span>
                <span className={`font-bold ${userBalance >= pkg.amount ? 'text-emerald-700' : 'text-rose-600'}`}>
                  ₹{Math.max(0, userBalance - pkg.amount).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full py-3.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying Transaction...' : 'I Have Paid, Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
