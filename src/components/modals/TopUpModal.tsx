import React, { useState } from 'react';
import { X, Check, Star, ShieldCheck, Zap, Copy } from 'lucide-react';
import { TRC20_WALLET_ADDRESS } from '../../data/mockData';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmTopUp: (amount: number, method: 'UPI' | 'USDT') => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  onConfirmTopUp,
}) => {
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'UPI' | 'USDT'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');

  if (!isOpen) return null;

  const presets = [100, 500, 1000, 2000, 5000, 10000];
  const merchantUpi = 'vrghvrus-4@okaxis';

  const handleCopyAddr = () => {
    navigator.clipboard.writeText(TRC20_WALLET_ADDRESS);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleTopUp = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    if (method === 'UPI') {
      const cleanUtr = utrNumber.trim();
      if (!/^\d{12}$/.test(cleanUtr)) {
        setUtrError('Please enter a valid 12-digit UPI Ref / UTR number after scanning QR');
        return;
      }
    }

    setUtrError('');
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmTopUp(num, method);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  const amountNum = parseFloat(amount) || 0;
  // First recharge extra bonus
  const firstBonus = Math.round(amountNum * 0.05);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header with First ⭐ Badge */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-zinc-950">Top Up Wallet</h3>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <span>🪙</span> First Bonus Active
            </span>
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Method Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMethod('UPI')}
              className={`p-3 rounded-xl border text-center transition ${
                method === 'UPI'
                  ? 'border-black bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-white text-zinc-700 font-medium'
              }`}
            >
              <div className="text-xs">UPI Fast Settlement</div>
            </button>
            <button
              type="button"
              onClick={() => setMethod('USDT')}
              className={`p-3 rounded-xl border text-center transition ${
                method === 'USDT'
                  ? 'border-black bg-zinc-900 text-white font-bold'
                  : 'border-zinc-200 bg-white text-zinc-700 font-medium'
              }`}
            >
              <div className="text-xs">USDT TRC-20</div>
            </button>
          </div>

          {/* UPI Official Stand Info */}
          {method === 'UPI' && (
            <div className="bg-gradient-to-b from-[#0a1128] via-[#0d1b3a] to-[#080d1a] border border-blue-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden animate-in fade-in duration-200">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>

              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[11px] font-black tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  SharkPay 2.0 Official UPI QR Stand
                </span>
                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  All UPI Apps
                </span>
              </div>

              {/* The Uploaded Official Stand Photo */}
              <div className="relative my-2 rounded-xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] max-w-[200px] bg-black">
                <img
                  src="/assets/aistudio/IMG_20261105_184316_1e6b18e8.png"
                  alt="SharkPay 2.0 Official UPI QR Stand"
                  className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => window.open('/assets/aistudio/IMG_20261105_184316_1e6b18e8.png', '_blank')}
                />
              </div>

              <p className="text-[11px] text-zinc-300 font-medium mt-1 text-center">
                Scan QR stand to pay ₹{amountNum > 0 ? amountNum.toLocaleString() : 'amount'}
              </p>

              {/* VPA and Bank details */}
              <div className="w-full mt-3 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase">UPI ID</div>
                  <div className="text-xs font-mono font-black text-white">{merchantUpi}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Bank Of Maharashtra **** 4002</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-zinc-950 font-black text-xs rounded-lg transition flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* UTR Input */}
              <div className="w-full mt-3 space-y-1 text-left">
                <label className="text-[11px] font-bold text-zinc-300">12-Digit NPCI UTR / Ref Number</label>
                <input
                  type="text"
                  maxLength={12}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 423589123456"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 font-mono tracking-wider focus:outline-none focus:border-cyan-400"
                />
                {utrError && <p className="text-[10px] text-red-400 font-bold">{utrError}</p>}
              </div>
            </div>
          )}

          {/* USDT TRC20 Address Info */}
          {method === 'USDT' && (
            <div className="bg-[#f7f8fa] border border-zinc-200/80 rounded-2xl p-3.5 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-medium">Network: <strong className="text-zinc-900">Tron (TRC20)</strong></span>
                <span className="text-blue-600 font-bold">Min: ≥ 1 USDT</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white border border-zinc-200 rounded-xl p-2.5">
                <span className="font-mono text-xs font-bold text-zinc-900 truncate">
                  <span className="text-[#c96b20]">TJ3SgN</span>houLTygj68RHuXDcWcaUAE<span className="text-[#c96b20]">34WrkQ</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyAddr}
                  className="bg-[#1677ff] hover:bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95"
                >
                  {copiedAddr ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddr ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Amount presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700">Select Amount (INR)</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                    amount === val.toString()
                      ? 'border-black bg-black text-white'
                      : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Custom Amount (INR)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-bold text-zinc-400">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-8 pr-4 text-base font-bold text-zinc-900 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Bonus Calculation summary */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-indigo-900 font-semibold">
              <span>Top up amount:</span>
              <span>₹{amountNum.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 font-bold">
              <span>First Top Up Bonus (+5%):</span>
              <span>+₹{firstBonus}</span>
            </div>
            <div className="border-t border-indigo-100 pt-1 flex items-center justify-between text-indigo-950 font-black text-sm">
              <span>Total Received:</span>
              <span>₹{(amountNum + firstBonus).toLocaleString()}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing || amountNum <= 0}
            onClick={handleTopUp}
            className="w-full py-3.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition active:scale-95 shadow-sm disabled:opacity-50"
          >
            {isProcessing ? 'Processing Instant Deposit...' : `Proceed to Pay ₹${amountNum.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
};
