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
      {/* User Header */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onOpenEditProfile}
          className="flex items-center gap-2 group text-left"
        >
          {/* User Icon Circle */}
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="text-lg font-black text-zinc-950">Edit profile</span>
          <ChevronDown className="w-4 h-4 text-zinc-600 group-hover:text-black transition" />
        </button>

        <div className="text-xs font-semibold text-zinc-400 mt-1 pl-10">
          ID: {user.id}
        </div>
      </div>

      {/* Quota Card */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
              {/* Target / Quota Icon */}
              <div className="w-4 h-4 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
              </div>
              <span>Quota</span>
            </div>

            <div className="text-4xl font-black text-zinc-950 tracking-tight mt-1.5">
              {user.quota} <span className="text-base font-black">INR</span>
            </div>

            <div className="text-xs text-zinc-400 font-medium mt-1">
              Reward ratio {user.rewardRatio}%
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenTopUp}
            className="px-6 py-2.5 bg-black text-white font-bold text-sm rounded-full hover:bg-zinc-800 active:scale-95 transition shadow-sm"
          >
            Top up
          </button>
        </div>
      </div>

      {/* Action Menu List */}
      <div className="space-y-3 pt-3">
        {/* Recharge History */}
        <button
          type="button"
          onClick={onOpenRechargeHistory}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-bold text-zinc-950">Recharge History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition" />
        </button>

        {/* Token History */}
        <button
          type="button"
          onClick={onOpenTokenHistory}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-bold text-zinc-950">Token History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition" />
        </button>

        {/* Languages */}
        <button
          type="button"
          onClick={onOpenLanguages}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-bold text-zinc-950">Languages</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-600 transition">
            <span className="text-xs font-semibold text-zinc-400">{user.language}</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </button>

        {/* Security & MFA */}
        <button
          type="button"
          onClick={onOpenSecuritySettings || onOpenGoogleAuth}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-950 block">Security & Biometrics</span>
              <span className="text-[11px] text-zinc-400">
                {user.isBiometricEnabled ? 'Fingerprint/Face ID Active' : 'Configure MFA & PIN'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-600 transition">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              user.isBiometricEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'
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
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            {/* Multi-color Google Star/Cross Icon */}
            <div className="w-5 h-5 flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-zinc-950">Google Authentication</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition" />
        </button>

        {/* Contact Us */}
        <button
          type="button"
          onClick={onOpenContactUs}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-bold text-zinc-950">Contact Us</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition" />
        </button>

        {/* Firebase Cloud Sync Info */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-xl p-3.5 border border-blue-200/60 flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ☁️
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <span>Firebase Firestore</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">
                Active Cloud Database
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onSignOut}
          className="w-full bg-white rounded-xl p-4 border border-zinc-100 shadow-sm flex items-center justify-between text-left group hover:border-zinc-200 transition"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-bold text-zinc-950">Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition" />
        </button>
      </div>
    </div>
  );
};
