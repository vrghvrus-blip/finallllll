import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  MessageSquare,
  LogOut,
  Target,
} from 'lucide-react';
import { UserProfile } from '../../types/rswallet';

interface MeTabProps {
  user: UserProfile;
  onOpenTopUp: () => void;
  onOpenEditProfile: () => void;
  onOpenRechargeHistory: () => void;
  onOpenTokenHistory: () => void;
  onOpenLanguages: () => void;
  onOpenGoogleAuth: () => void;
  onOpenSecuritySettings?: () => void;
  onOpenContactUs: () => void;
  onOpenNativeApp?: () => void;
  onSignOut: () => void;
}

export const MeTab: React.FC<MeTabProps> = ({
  user,
  onOpenTopUp,
  onOpenEditProfile,
  onOpenRechargeHistory,
  onOpenTokenHistory,
  onOpenLanguages,
  onOpenGoogleAuth,
  onOpenSecuritySettings,
  onOpenContactUs,
  onOpenNativeApp,
  onSignOut,
}) => {
  return (
    <div className="space-y-4 pb-24">
      {/* User Profile Card */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={onOpenEditProfile}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-[#f4efe6] text-zinc-800 border border-[#e2d9ca] flex items-center justify-center font-bold text-sm shadow-xs">
            {user.phone ? user.phone.slice(-2) : 'SP'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-zinc-950">
                {user.phone || 'SharkPay User'}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 transition" />
            </div>
            <span className="text-xs text-zinc-400 font-mono">UID: {user.id.slice(0, 12)}</span>
          </div>
        </button>
      </div>

      {/* Quota Balance Card (Milk Colour Light UI) */}
      <div className="bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] text-zinc-900 rounded-2xl p-4.5 border border-[#eee6d8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Settlement Quota</span>
          </div>
          <div className="text-2xl font-black text-zinc-950 tracking-tight mt-1 tabular-nums">
            ₹{user.quota.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-semibold text-zinc-500">INR</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-0.5 block">
            Bonus Reward: {user.rewardRatio}%
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenTopUp}
          className="px-5 py-2.5 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-[#faf7f2] border border-[#e2d9ca] active:scale-95 transition shadow-2xs cursor-pointer"
        >
          + Top up
        </button>
      </div>

      {/* Settings Group 1: Wallet Activity */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
        {/* Recharge History */}
        <button
          type="button"
          onClick={onOpenRechargeHistory}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-900">Recharge & Deposit History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Token History */}
        <button
          type="button"
          onClick={onOpenTokenHistory}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-900">Token & Reward Ledger</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Languages */}
        <button
          type="button"
          onClick={onOpenLanguages}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-900">App Language</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="text-xs font-medium text-zinc-500">{user.language}</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </button>
      </div>

      {/* Settings Group 2: Security & Authentication */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs divide-y divide-zinc-100 overflow-hidden">
        {/* Security & MFA */}
        <button
          type="button"
          onClick={onOpenSecuritySettings || onOpenGoogleAuth}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900 block">Security & Biometrics</span>
              <span className="text-[11px] text-zinc-400">
                {user.isBiometricEnabled ? 'Biometrics Active' : 'Configure PIN & 2FA'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              user.isBiometricEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {user.isBiometricEnabled ? 'Protected' : 'Setup'}
            </span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </button>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={onOpenGoogleAuth}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-zinc-900">Google Authentication</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Contact Us */}
        <button
          type="button"
          onClick={onOpenContactUs}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-50/80 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-zinc-600" />
            <span className="text-xs font-bold text-zinc-900">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      {/* Cloud Database Info & Sign Out */}
      <div className="space-y-2 pt-1">
        <div className="w-full bg-zinc-50 rounded-xl px-4 py-3 border border-zinc-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-zinc-600">Cloud Sync Active</span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">Firestore Connected</span>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="w-full p-3.5 bg-white border border-zinc-200/80 rounded-xl flex items-center justify-center gap-2 text-rose-600 font-bold text-xs hover:bg-rose-50/50 hover:border-rose-200 transition active:scale-98 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
