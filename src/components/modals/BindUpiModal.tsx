import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CreditCard,
  User,
  Zap,
} from 'lucide-react';
import { UPIAccount } from '../../types/rswallet';
import {
  PhonePeLogoIcon,
  MobikwikLogoIcon,
  PaytmLogo,
  PhonePeBusinessLogoIcon,
  PaytmBusinessLogoIcon,
  AirtelMerchantLogoIcon,
} from '../PaymentLogos';

interface BindUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (newAccount: Omit<UPIAccount, 'id' | 'createdAt'>) => void;
  onLaunchUpiApp?: (appName: string, upiId: string) => void;
  initialType?: 'receive' | 'send' | 'both';
}

interface UpiAppOption {
  id: UPIAccount['appType'];
  name: string;
  badge?: string;
  defaultHandles: string[];
  color: string;
  icon: React.ReactNode;
}

const UPI_APPS: UpiAppOption[] = [
  {
    id: 'phonepe',
    name: 'PhonePe',
    badge: 'Popular',
    color: '#5f259f',
    defaultHandles: ['@ybl', '@ibl', '@axl'],
    icon: <PhonePeLogoIcon className="w-8 h-8" />,
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    badge: 'Fast',
    color: '#4285F4',
    defaultHandles: ['@okaxis', '@okhdfcbank', '@okicici', '@oksbi'],
    icon: (
      <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-zinc-200 flex items-center justify-center p-1.5">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'paytm',
    name: 'Paytm',
    color: '#002e6e',
    defaultHandles: ['@paytm', '@ptyes'],
    icon: (
      <div className="w-12 h-6 flex items-center justify-center">
        <PaytmLogo />
      </div>
    ),
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    color: '#00843d',
    defaultHandles: ['@upi'],
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#00843d] text-white font-black text-[10px] flex items-center justify-center shadow-xs">
        BHIM
      </div>
    ),
  },
  {
    id: 'airtel',
    name: 'Airtel Payments',
    color: '#e40000',
    defaultHandles: ['@airtel', '@airtelpayments'],
    icon: <AirtelMerchantLogoIcon className="w-8 h-8" />,
  },
  {
    id: 'mobikwik',
    name: 'Mobikwik',
    color: '#00a3e0',
    defaultHandles: ['@ikwik', '@mbk'],
    icon: <MobikwikLogoIcon className="w-8 h-8" />,
  },
];

export const BindUpiModal: React.FC<BindUpiModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
  onLaunchUpiApp,
  initialType = 'both',
}) => {
  const [selectedApp, setSelectedApp] = useState<UpiAppOption>(UPI_APPS[0]);
  const [upiId, setUpiId] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<'both' | 'receive' | 'send'>(initialType);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAccountType(initialType);
      setErrorMessage('');
      setIsSuccess(false);
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  // Handle suffix chip tap (e.g. "@ybl", "@okaxis")
  const handleSuffixClick = (suffix: string) => {
    const atIndex = upiId.indexOf('@');
    if (atIndex !== -1) {
      setUpiId(upiId.substring(0, atIndex) + suffix);
    } else if (upiId.trim().length > 0) {
      setUpiId(upiId.trim() + suffix);
    } else {
      setUpiId('username' + suffix);
    }
  };

  const handleSelectApp = (app: UpiAppOption) => {
    setSelectedApp(app);
    // If upiId already has a suffix, replace with first default handle of chosen app
    const atIndex = upiId.indexOf('@');
    if (atIndex !== -1 && app.defaultHandles[0]) {
      setUpiId(upiId.substring(0, atIndex) + app.defaultHandles[0]);
    }
    if (!accountTitle || UPI_APPS.some((a) => accountTitle === `${a.name} Account`)) {
      setAccountTitle(`${app.name} Account`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUpi = upiId.trim().toLowerCase();
    if (!cleanUpi) {
      setErrorMessage('Please enter your UPI ID (VPA)');
      return;
    }

    if (!cleanUpi.includes('@') || cleanUpi.indexOf('@') === 0 || cleanUpi.indexOf('@') === cleanUpi.length - 1) {
      setErrorMessage('Invalid UPI ID format! Must include username and handle (e.g. yourname@ybl)');
      return;
    }

    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setErrorMessage('Please enter a 6-digit numeric security PIN for this UPI account.');
      return;
    }

    const title = accountTitle.trim() || `${selectedApp.name} (${cleanUpi})`;

    const newAcc: Omit<UPIAccount, 'id' | 'createdAt'> = {
      appName: selectedApp.name,
      appType: selectedApp.id,
      title,
      upiId: cleanUpi,
      bankName: bankName.trim() || undefined,
      pin,
      status: 'Authorized',
      isOnSale: true,
      type: accountType,
    };

    setIsSuccess(true);
    setTimeout(() => {
      onAddAccount(newAcc);
      onClose();
      // Reset form
      setUpiId('');
      setAccountTitle('');
      setBankName('');
      setPin('');
      setIsSuccess(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition active:scale-95 cursor-pointer"
              title="Close"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-lg font-black text-zinc-950 tracking-tight">Add UPI Account</h2>
              <p className="text-[11px] text-zinc-500 font-medium">Link your UPI for instant payouts & settlements</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Live Card Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-4 text-white shadow-md border border-zinc-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1961e6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1 shadow-inner">
                  {selectedApp.icon}
                </div>
                <div>
                  <div className="text-xs font-black text-white tracking-tight">
                    {accountTitle || `${selectedApp.name} Account`}
                  </div>
                  <div className="text-[10px] text-zinc-400 capitalize">
                    {accountType === 'both' ? 'Receive & Send' : `${accountType} only`}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                NPCI Secured
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800/80 flex items-end justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block">
                  Virtual Payment Address (VPA)
                </span>
                <span className="font-mono text-xs font-black tracking-wide text-zinc-100">
                  {upiId.trim() || 'yourname@bank'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold block">
                  Security PIN
                </span>
                <span className="font-mono text-[11px] font-bold text-zinc-300">
                  {pin ? '••••••' : 'Not entered'}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center animate-in slide-in-from-top-1">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Choose UPI App */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-900 flex items-center justify-between">
              <span>1. Select UPI Provider</span>
              <span className="text-[10px] text-zinc-400 font-normal">Choose your preferred app</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {UPI_APPS.map((app) => {
                const isSelected = selectedApp.id === app.id;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelectApp(app)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 relative cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'border-[#1961e6] bg-blue-50/70 shadow-xs ring-1 ring-[#1961e6]'
                        : 'border-zinc-200 bg-white hover:border-zinc-300'
                    }`}
                  >
                    {app.badge && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-amber-400/20 text-amber-800 px-1 py-0.2 rounded-full">
                        {app.badge}
                      </span>
                    )}
                    <div className="h-8 flex items-center justify-center">{app.icon}</div>
                    <span className={`text-[11px] font-bold tracking-tight ${isSelected ? 'text-[#1961e6]' : 'text-zinc-800'}`}>
                      {app.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Enter UPI ID (VPA) */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-900 flex items-center justify-between">
              <span>2. UPI ID (Virtual Payment Address)</span>
              <span className="text-[10px] text-zinc-400 font-normal">e.g. 9876543210@ybl</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-zinc-400">
                <CreditCard className="w-4 h-4 stroke-[2]" />
              </span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                placeholder="Enter your UPI ID (e.g. mobile@bank)"
                className="w-full bg-[#f8f9fa] border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-[13px] font-mono font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#1961e6] focus:ring-2 focus:ring-[#1961e6]/20 transition"
              />
            </div>

            {/* Quick Suffix Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] text-zinc-400 font-semibold py-1">Quick handle:</span>
              {selectedApp.defaultHandles.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleSuffixClick(handle)}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 font-mono text-[10px] font-bold rounded-lg transition cursor-pointer"
                >
                  {handle}
                </button>
              ))}
              {selectedApp.id !== 'phonepe' && (
                <button
                  type="button"
                  onClick={() => handleSuffixClick('@ybl')}
                  className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 font-mono text-[10px] font-bold rounded-lg transition cursor-pointer"
                >
                  @ybl
                </button>
              )}
            </div>
          </div>

          {/* Section 3: Account / Bank Label */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-900">
              3. Account Title / Beneficiary Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-zinc-400">
                <User className="w-4 h-4 stroke-[2]" />
              </span>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder={`e.g. ${selectedApp.name} Main Account`}
                className="w-full bg-[#f8f9fa] border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#1961e6] focus:ring-2 focus:ring-[#1961e6]/20 transition"
              />
            </div>
          </div>

          {/* Section 4: Usage Purpose */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-zinc-900">
              4. Account Permission
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('both')}
                className={`py-2.5 px-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                  accountType === 'both'
                    ? 'border-black bg-zinc-900 text-white font-black'
                    : 'border-zinc-200 bg-white text-zinc-700 font-semibold'
                }`}
              >
                <div className="text-[11px]">Both (Recv & Send)</div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('receive')}
                className={`py-2.5 px-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                  accountType === 'receive'
                    ? 'border-black bg-zinc-900 text-white font-black'
                    : 'border-zinc-200 bg-white text-zinc-700 font-semibold'
                }`}
              >
                <div className="text-[11px]">Receive Only</div>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('send')}
                className={`py-2.5 px-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                  accountType === 'send'
                    ? 'border-black bg-zinc-900 text-white font-black'
                    : 'border-zinc-200 bg-white text-zinc-700 font-semibold'
                }`}
              >
                <div className="text-[11px]">Send Only</div>
              </button>
            </div>
          </div>

          {/* Section 5: 6-Digit Security PIN */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-600" />
                <span>5. 6-Digit Security PIN</span>
              </label>
              <span className="text-[10px] text-zinc-400">Required for authorizing transactions</span>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit numeric PIN"
                className="w-full bg-[#f8f9fa] border border-zinc-200 rounded-2xl py-3 px-4 text-center font-mono font-black text-base tracking-widest text-zinc-900 placeholder:text-xs placeholder:font-normal placeholder:tracking-normal placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#1961e6] focus:ring-2 focus:ring-[#1961e6]/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Guarantee Pill */}
          <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center gap-2.5 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.2]" />
            <span>Bank-grade 256-bit encryption. UPI verification powered by NPCI protocol.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-2">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white font-extrabold text-sm tracking-wide rounded-2xl shadow-md transition-all active:scale-[0.985] cursor-pointer text-center flex items-center justify-center gap-2"
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Account Bound Successfully!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Add & Bind UPI Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
