import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Download,
  PlayCircle,
  RefreshCw,
  Info,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { QuotaPackage } from '../../types/rswallet';

interface DepositTabProps {
  quotaPackages: QuotaPackage[];
  usdtRatio: number;
  walletAddress: string;
  onBuyQuota: (pkg: QuotaPackage) => void;
  onOpenHowBuyQuota: () => void;
  onSimulateUsdtDeposit?: (amountUsdt: number, inrValue: number) => void;
  onDepositUsdt?: (amountUsdt: number, inrValue: number, txHash?: string) => void;
  onOpenRechargeHistory?: () => void;
  onOpenConfirmPaymentStatus?: () => void;
}

export const DepositTab: React.FC<DepositTabProps> = ({
  quotaPackages,
  usdtRatio,
  walletAddress,
  onBuyQuota,
  onOpenHowBuyQuota,
  onSimulateUsdtDeposit,
  onDepositUsdt,
  onOpenConfirmPaymentStatus,
}) => {
  // Deposit build: first INR then USDT (INR is default matching screenshots)
  const [activeMainTab, setActiveMainTab] = useState<'INR' | 'USDT'>('INR');
  const [activeSubTab, setActiveSubTab] = useState<'task' | 'vip'>('task');

  // Copy status
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isViewMoreExpanded, setIsViewMoreExpanded] = useState(false);
  const [showQuickBuy, setShowQuickBuy] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // QR Code Data URL
  const [qrDataUrl, setQrDataUrl] = useState('');

  // INR Filters & sorting
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // USDT Quick Calculator / Deposit
  const [usdtInput, setUsdtInput] = useState('100');

  // Exact target TRC20 wallet address from screenshot: TJ3SgNhouLTygj68RHuXDcWcaUAE34WrkQ
  const targetAddress = walletAddress || 'TJ3SgNhouLTygj68RHuXDcWcaUAE34WrkQ';

  // Highlighted prefix, middle, and suffix exactly as shown in screenshot
  const addrPrefix = targetAddress.slice(0, 6); // TJ3SgN
  const addrSuffix = targetAddress.slice(-6); // 34WrkQ
  const addrMiddle = targetAddress.slice(6, -6); // houLTygj68RHuXDcWcaUAE

  useEffect(() => {
    // Generate high density QR Code matching native Tron TRC20 screenshot
    QRCode.toDataURL(targetAddress, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [targetAddress]);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetAddress);
    setCopied(true);
    showToast('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToAlbum = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `SharkPay_TRC20_${targetAddress.slice(0, 6)}.png`;
      link.href = qrDataUrl;
      link.click();
      showToast('QR Code & Address saved to device!');
    } else {
      setShowShareModal(true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Quota list refreshed');
    }, 400);
  };

  // Filtered quota packages for INR sub-tab
  const currentTierPackages = quotaPackages.filter((pkg) => {
    if (activeSubTab === 'vip') {
      return pkg.tier === 'vip' || pkg.amount >= 5000;
    }
    return pkg.tier !== 'vip';
  });

  const filteredPackages = currentTierPackages
    .filter((pkg) => {
      const min = minVal ? parseFloat(minVal) : 0;
      const max = maxVal ? parseFloat(maxVal) : Infinity;
      return pkg.amount >= min && pkg.amount <= max;
    })
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });

  // Calculate USDT to INR
  const usdtNum = parseFloat(usdtInput) || 0;
  const inrEquivalent = usdtNum * usdtRatio;
  const bonusRatio = usdtNum >= 500 ? 2.0 : usdtNum >= 100 ? 1.0 : 0;
  const estimatedBonus = (inrEquivalent * bonusRatio) / 100;
  const totalInr = inrEquivalent + estimatedBonus;

  return (
    <div className="min-h-full pb-28">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-top-2">
          {toastText}
        </div>
      )}

      {/* ================= TOP TABS: FIRST INR THEN USDT (MATCHING USER REQUEST & SCREENSHOTS) ================= */}
      <div className="pt-2 pb-2 px-1">
        <div className="flex items-center gap-7">
          <button
            type="button"
            onClick={() => setActiveMainTab('INR')}
            className={`text-2xl font-black tracking-tight transition-colors cursor-pointer ${
              activeMainTab === 'INR'
                ? 'text-zinc-950 font-black'
                : 'text-zinc-300 font-bold hover:text-zinc-500'
            }`}
          >
            INR
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('USDT')}
            className={`text-2xl font-black tracking-tight transition-colors cursor-pointer ${
              activeMainTab === 'USDT'
                ? 'text-zinc-950 font-black'
                : 'text-zinc-300 font-bold hover:text-zinc-500'
            }`}
          >
            USDT
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: INR TAB (MATCHING Screenshot_20261103_010924 to 010937) ================= */}
      {activeMainTab === 'INR' && (
        <div className="space-y-3.5 pt-1">
          {/* Subtabs: Task | VIP */}
          <div className="flex items-center gap-7 border-b border-zinc-100 pb-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('task')}
              className={`text-base font-bold transition-colors cursor-pointer ${
                activeSubTab === 'task'
                  ? 'text-zinc-950 font-black'
                  : 'text-zinc-400 font-semibold hover:text-zinc-600'
              }`}
            >
              Task
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('vip')}
              className={`text-base font-bold transition-colors cursor-pointer ${
                activeSubTab === 'vip'
                  ? 'text-zinc-950 font-black'
                  : 'text-zinc-400 font-semibold hover:text-zinc-600'
              }`}
            >
              VIP
            </button>
          </div>

          {/* Purple Notification Banner: Complete a task to earn Commission and Bonus */}
          <div className="bg-[#ede9fe]/70 border border-purple-100/60 rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-800 text-xs font-bold shadow-2xs">
            {/* Yellow star/coin badge matching screenshot */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 flex items-center justify-center text-xs font-black shadow-xs shrink-0">
              ★
            </div>
            <span>Complete a task to earn Commission and Bonus</span>
          </div>

          {/* Link: How Buy Quota? & Verify Status */}
          <div className="pt-0.5 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenHowBuyQuota}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-black cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 fill-none stroke-current" />
              <span>How Buy Quota?</span>
            </button>

            {onOpenConfirmPaymentStatus && (
              <button
                type="button"
                onClick={onOpenConfirmPaymentStatus}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                <span>Verify Payment / UTR</span>
                <span className="text-xs">→</span>
              </button>
            )}
          </div>

          {/* Filters Row: [From low to high ▾] [ Min ] - [ Max ] [ Refresh ] */}
          <div className="flex items-center gap-2 pt-1">
            {/* Dropdown sort */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="appearance-none bg-[#f4f5f7] text-zinc-800 text-xs font-semibold px-3 py-2 pr-7 rounded-lg border border-transparent focus:border-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="asc">From low to high</option>
                <option value="desc">From high to low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Min - Max Input Range */}
            <div className="flex items-center gap-1 flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minVal}
                onChange={(e) => setMinVal(e.target.value)}
                className="w-16 sm:w-20 bg-[#f4f5f7] text-zinc-900 text-xs px-2 py-2 rounded-lg text-center placeholder-zinc-400 font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400"
              />
              <span className="text-zinc-400 text-xs font-bold">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxVal}
                onChange={(e) => setMaxVal(e.target.value)}
                className="w-16 sm:w-20 bg-[#f4f5f7] text-zinc-900 text-xs px-2 py-2 rounded-lg text-center placeholder-zinc-400 font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-zinc-800 active:scale-95 transition flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Quota Packages List matching Screenshots */}
          <div className="space-y-3 pt-2">
            {filteredPackages.length === 0 ? (
              <div className="shiny-glass-card rounded-2xl p-8 text-center border border-dashed border-zinc-200 text-xs text-zinc-400 space-y-2">
                <p className="font-semibold text-zinc-600">No Quota orders in this range</p>
                <p>Try clearing Min/Max or tap Refresh</p>
                <button
                  type="button"
                  onClick={() => {
                    setMinVal('');
                    setMaxVal('');
                  }}
                  className="px-3.5 py-1.5 bg-zinc-100 text-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-200 active:scale-95 transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="shiny-glass-card rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center justify-between hover:border-zinc-300 transition-all duration-200"
                >
                  <div>
                    {/* Amount title */}
                    <h3 className="text-base sm:text-lg font-black text-zinc-950 tracking-tight">
                      {pkg.amount} INR
                    </h3>

                    {/* Income & Quota columns matching screenshots */}
                    <div className="flex items-center gap-8 mt-1 text-xs">
                      <div>
                        <span className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Income</span>
                        <div className="font-bold text-zinc-900 text-xs mt-0.5">
                          {pkg.income} ({pkg.incomePercent}%)
                        </div>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-medium text-[11px] uppercase tracking-wider">Quota</span>
                        <div className="font-bold text-teal-600 text-xs mt-0.5">
                          +{pkg.quota}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buy Button with shiny specular sheen */}
                  <button
                    type="button"
                    onClick={() => onBuyQuota(pkg)}
                    className="shiny-specular-btn bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition shadow-sm cursor-pointer"
                  >
                    Buy
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: USDT TAB (MATCHING Screenshot_20261103_010032) ================= */}
      {activeMainTab === 'USDT' && (
        <div className="pt-1 space-y-4 px-1">
          {/* Header Bar with Back, Deposit USDT title, Help, Camera/Album */}
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => setActiveMainTab('INR')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition active:scale-95 text-zinc-900 cursor-pointer"
              title="Back to INR Quota"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-900 stroke-[2.5]" />
            </button>

            <h2 className="text-base font-bold text-zinc-900">Deposit USDT</h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition active:scale-95 cursor-pointer"
                title="Help Guide"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleSaveToAlbum}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition active:scale-95 cursor-pointer"
                title="Save / Album"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Right "Quick Buy →" Button */}
          <div className="flex justify-end pr-1">
            <button
              type="button"
              onClick={() => setShowQuickBuy(!showQuickBuy)}
              className="bg-[#ebf3ff] text-[#1677ff] hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded-full transition flex items-center gap-1 active:scale-95 shadow-2xs cursor-pointer"
            >
              <span>Quick Buy</span>
              <span className="text-xs">→</span>
            </button>
          </div>

          {/* Quick Buy / Calculator Dropdown */}
          {showQuickBuy && (
            <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-4 space-y-3 animate-in fade-in duration-150 text-xs">
              <div className="flex items-center justify-between font-bold text-zinc-900">
                <span className="font-extrabold text-blue-900">Live USDT/INR Conversion</span>
                <span className="text-blue-700 font-mono">1 USDT = {usdtRatio} INR</span>
              </div>
              <div className="flex gap-1.5">
                {[50, 100, 300, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setUsdtInput(amt.toString())}
                    className={`flex-1 py-1 text-xs font-bold rounded-lg transition ${
                      usdtInput === amt.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-zinc-700 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {amt} ₮
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={usdtInput}
                  onChange={(e) => setUsdtInput(e.target.value)}
                  placeholder="USDT amount"
                  className="w-28 bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 focus:outline-none"
                />
                <div className="text-xs font-bold text-zinc-800 flex-1 text-right">
                  ≈ ₹{totalInr.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const depositFunc = onDepositUsdt || onSimulateUsdtDeposit;
                  if (depositFunc) {
                    depositFunc(usdtNum, totalInr, `TRON_${Date.now().toString(36)}`);
                  }
                  setShowQuickBuy(false);
                  showToast(`Deposit of ${usdtNum} USDT submitted!`);
                }}
                className="w-full py-2.5 bg-[#1677ff] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition active:scale-95 shadow-2xs cursor-pointer"
              >
                Confirm Deposit of {usdtNum} USDT (₹{totalInr.toFixed(0)})
              </button>
            </div>
          )}

          {/* Centered QR Code with Tether (₮) Badge matching screenshot */}
          <div className="flex flex-col items-center justify-center pt-1 pb-1">
            <div className="relative w-56 h-56 flex items-center justify-center bg-white p-2 rounded-2xl shadow-2xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Deposit TRC20 QR Code"
                  className="w-52 h-52 object-contain"
                />
              ) : (
                <div className="w-52 h-52 bg-zinc-100 animate-pulse rounded-xl" />
              )}

              {/* Centered Teal Circular Tether ₮ Logo matching screenshot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-[#26a17b] border-[2.5px] border-white flex items-center justify-center shadow-md">
                  <span className="text-white font-extrabold text-lg select-none leading-none">₮</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1: Deposit Network (Tron TRC20) matching screenshot */}
          <div className="bg-[#f7f8fa] rounded-2xl p-4 flex items-center justify-between border border-zinc-100">
            <div>
              <div className="text-xs text-zinc-400 font-medium">Deposit network</div>
              <div className="text-base font-bold text-zinc-950 mt-0.5">Tron (TRC20)</div>
            </div>
            <div className="text-zinc-700 hover:text-black cursor-pointer p-1">
              <ArrowRightLeft className="w-5 h-5 text-zinc-800" />
            </div>
          </div>

          {/* Card 2: Deposit Address with Highlighted Colors matching screenshot */}
          <div className="bg-[#f7f8fa] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-zinc-100">
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-0.5 text-xs text-zinc-400 font-medium mb-1">
                <span>Deposit Address</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div
                onClick={handleCopy}
                className="font-mono text-[13px] leading-relaxed break-all select-all font-bold cursor-pointer hover:opacity-85 transition"
                title="Click to copy TRC20 address"
              >
                <span className="text-[#c96b20] font-bold">{addrPrefix}</span>
                <span className="text-zinc-950 font-bold">{addrMiddle}</span>
                <span className="text-[#c96b20] font-bold">{addrSuffix}</span>
              </div>
            </div>

            {/* Copy to Clipboard Button next to TRC20 Address */}
            <button
              type="button"
              onClick={handleCopy}
              title="Copy to Clipboard"
              aria-label="Copy to Clipboard"
              className="bg-[#1677ff] hover:bg-blue-600 active:scale-95 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.8]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.2]" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Direct USDT Payment Confirmation Button */}
          {onOpenConfirmPaymentStatus && (
            <button
              type="button"
              onClick={onOpenConfirmPaymentStatus}
              className="w-full py-3 bg-zinc-900 hover:bg-black active:scale-[0.99] text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>I Have Transferred / Confirm Payment Status</span>
            </button>
          )}

          {/* Information Rows matching screenshot */}
          <div className="space-y-3 px-1 pt-1">
            {/* Minimum Deposit */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Minimum Deposit</span>
              <span className="text-zinc-900 font-bold font-mono">≥ 1 USDT</span>
            </div>

            {/* Receiving Account */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-zinc-400 font-medium">
                <span>Receiving account</span>
                <Info className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="flex items-center gap-1 text-zinc-900 font-bold cursor-pointer">
                <span>Fund Account</span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-600" />
              </div>
            </div>

            {/* View More Collapsible Toggle matching screenshot */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsViewMoreExpanded(!isViewMoreExpanded)}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 font-semibold cursor-pointer"
              >
                <span>View More</span>
                {isViewMoreExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Expanded Detailed Network Specs */}
            {isViewMoreExpanded && (
              <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-2 text-[11px] text-zinc-600 animate-in fade-in duration-150">
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Contract Address</span>
                  <span className="font-mono text-zinc-900 font-semibold truncate max-w-[170px]">
                    TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Deposit Confirmation</span>
                  <span className="font-semibold text-zinc-900">1 network confirmation</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200/50">
                  <span className="text-zinc-400">Withdrawal Unlock</span>
                  <span className="font-semibold text-zinc-900">1 network confirmation</span>
                </div>
                <div className="pt-1 text-[10px] text-zinc-400 leading-normal">
                  * Send only Tether USD (TRC20) to this deposit address. Sending any other currency will result in irreversible deposit failure.
                </div>
              </div>
            )}
          </div>

          {/* Sticky/Prominent Bottom Button: "Share & Save Address" matching screenshot */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleSaveToAlbum}
              className="w-full py-3.5 bg-[#1677ff] hover:bg-[#1366db] text-white font-bold text-sm rounded-2xl shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Share & Save Address</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: SHARE & SAVE ADDRESS ================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-zinc-950">Share TRC20 Address</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-zinc-400 hover:text-zinc-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-2xl p-4 flex flex-col items-center text-center space-y-2">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Tron (TRC20) Deposit Address
              </span>

              {qrDataUrl && (
                <div className="relative w-44 h-44 flex items-center justify-center bg-white rounded-xl">
                  <img src={qrDataUrl} alt="Deposit QR" className="w-40 h-40 rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-[#26a17b] border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-white font-extrabold text-sm select-none leading-none">₮</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="font-mono text-xs font-bold text-zinc-900 break-all select-all px-2">
                <span className="text-[#c96b20] font-bold">{addrPrefix}</span>
                <span className="text-zinc-950 font-bold">{addrMiddle}</span>
                <span className="text-[#c96b20] font-bold">{addrSuffix}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-3 bg-[#1677ff] text-white font-bold text-xs rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Address'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (qrDataUrl) {
                    const link = document.createElement('a');
                    link.download = `SharkPay_TRC20_${targetAddress.slice(0, 6)}.png`;
                    link.href = qrDataUrl;
                    link.click();
                  }
                }}
                className="px-4 py-3 bg-zinc-100 text-zinc-800 font-bold text-xs rounded-xl hover:bg-zinc-200 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Image</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HELP & FAQ ================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl relative space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-zinc-950">TRC20 Deposit Guide</h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-zinc-400 hover:text-zinc-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-600 leading-relaxed">
              <div className="p-2.5 bg-zinc-50 rounded-xl">
                <div className="font-bold text-zinc-900">Supported Network</div>
                <div>Only transfer USDT over the TRON TRC20 network.</div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded-xl">
                <div className="font-bold text-zinc-900">Crediting Time</div>
                <div>Usually 1-3 minutes after 1 network confirmation.</div>
              </div>

              <div className="p-2.5 bg-zinc-50 rounded-xl">
                <div className="font-bold text-zinc-900">Minimum Limit</div>
                <div>Minimum deposit is 1 USDT. Deposits below 1 USDT cannot be recovered.</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-3 bg-zinc-900 text-white font-bold text-xs rounded-xl hover:bg-black transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
