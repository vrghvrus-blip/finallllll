import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UserProfile, TokenRecord, RechargeRecord, TeamMember } from '../../types/rswallet';
import { FreeChargeLogoTile, IndusIndLogoTile, PhonePeMultiLogoTile } from '../PaymentLogos';
import { HomeAnalytics } from '../analytics/HomeAnalytics';
import { HeaderAdBanner } from '../home/HeaderAdBanner';

interface HomeTabProps {
  user: UserProfile;
  tokenRecords?: TokenRecord[];
  rechargeRecords?: RechargeRecord[];
  teamMembers?: TeamMember[];
  onOpenTopUp: () => void;
  onOpenNewbieGuide: () => void;
  onOpenNewbieReward: () => void;
  onOpenLuckyWheel?: () => void;
  onOpenTutorial: (type: 'freecharge' | 'indus' | 'phonepe') => void;
  onNavigateTab: (tab: 'deposit' | 'team' | 'me') => void;
  onOpenHistory: (type: 'recharge' | 'token') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  tokenRecords,
  rechargeRecords,
  teamMembers,
  onOpenTopUp,
  onOpenNewbieGuide,
  onOpenNewbieReward,
  onOpenLuckyWheel,
  onOpenTutorial,
  onNavigateTab,
  onOpenHistory,
}) => {
  return (
    <div className="space-y-4 pb-20">
      {/* Single Clean Top Brand Header */}
      <div className="pt-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/sharkpay-logo.png"
            alt="SharkPay 2.0"
            className="w-9 h-9 rounded-xl object-cover border border-zinc-200/80 shadow-2xs"
          />
          <div>
            <h1 className="text-xl font-bold text-zinc-950 tracking-tight leading-none">SharkPay 2.0</h1>
            <span className="text-[11px] text-zinc-500 font-medium">Native UPI & USDT Settlement</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      {/* Rectangle Type Ad Photo Carousel matching uploaded banners */}
      <HeaderAdBanner
        onOpenNewbieGuide={onOpenNewbieGuide}
        onOpenTeam={() => onNavigateTab('team')}
        onOpenLuckyWheel={onOpenLuckyWheel || onOpenNewbieReward}
      />

      {/* Main Balance & Action Card (Milk Colour Light UI) */}
      <div className="bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] text-zinc-900 rounded-2xl p-5 border border-[#eee6d8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-500">Total Available Balance</span>
            <div className="text-3xl font-black text-zinc-950 tracking-tight mt-1 tabular-nums">
              ₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-zinc-500">Active Quota</span>
            <div className="text-lg font-black text-emerald-600 mt-1 tabular-nums">
              ₹{user.quota.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#eee6d8]">
          <button
            type="button"
            onClick={onOpenTopUp}
            className="w-full py-2.5 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-[#faf7f2] border border-[#e2d9ca] active:scale-95 transition text-center shadow-2xs cursor-pointer"
          >
            + Top Up
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('deposit')}
            className="w-full py-2.5 bg-white text-zinc-800 font-semibold text-xs rounded-xl hover:bg-[#faf7f2] border border-[#e2d9ca] active:scale-95 transition text-center shadow-2xs cursor-pointer"
          >
            Buy Quota
          </button>
          <button
            type="button"
            onClick={() => onOpenHistory('recharge')}
            className="w-full py-2.5 bg-white text-zinc-800 font-semibold text-xs rounded-xl hover:bg-[#faf7f2] border border-[#e2d9ca] active:scale-95 transition text-center shadow-2xs cursor-pointer"
          >
            History
          </button>
        </div>
      </div>

      {/* Live USDT Exchange Rate Strip */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">USDT Exchange Rate</span>
          <div className="text-base font-extrabold text-zinc-950 mt-0.5 tabular-nums">
            1 USDT ≈ ₹{user.usdtRatio.toFixed(2)} INR
          </div>
          <span className="text-xs text-emerald-600 font-medium">+{user.inrBonusRatio.toFixed(1)}% bonus on deposits</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigateTab('deposit')}
          className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition active:scale-95 cursor-pointer"
        >
          Deposit USDT →
        </button>
      </div>

      {/* 4-Stat Performance Overview */}
      <div className="grid grid-cols-2 gap-2.5">
        <div
          onClick={() => onOpenHistory('token')}
          className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-2xs cursor-pointer hover:border-zinc-300 transition"
        >
          <span className="text-xs font-medium text-zinc-400">Today Received</span>
          <div className="text-xl font-bold text-zinc-950 mt-1 tabular-nums">
            ₹{user.todayReceived.toFixed(2)}
          </div>
        </div>

        <div
          onClick={() => onOpenHistory('token')}
          className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-2xs cursor-pointer hover:border-zinc-300 transition"
        >
          <span className="text-xs font-medium text-zinc-400">Top up Bonus</span>
          <div className="text-xl font-bold text-zinc-950 mt-1 tabular-nums">
            ₹{user.topUpBonus.toFixed(2)}
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('team')}
          className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-2xs cursor-pointer hover:border-zinc-300 transition"
        >
          <span className="text-xs font-medium text-zinc-400">Team Commission</span>
          <div className="text-xl font-bold text-zinc-950 mt-1 tabular-nums">
            ₹{user.teamCommission.toFixed(2)}
          </div>
        </div>

        <div
          onClick={() => onOpenHistory('recharge')}
          className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-2xs cursor-pointer hover:border-zinc-300 transition"
        >
          <span className="text-xs font-medium text-zinc-400">Total Volume</span>
          <div className="text-xl font-bold text-zinc-950 mt-1 tabular-nums">
            ₹{user.totalRecharge.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Clean Guide & Rewards Callout */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenNewbieGuide}
          className="text-left bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/70 rounded-2xl p-3.5 transition cursor-pointer"
        >
          <div className="text-xs font-bold text-zinc-900">Beginner's Guide</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Learn how to maximize quota earnings</div>
          <div className="text-xs font-semibold text-zinc-700 mt-2 flex items-center gap-1">
            <span>Read guide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenNewbieReward}
          className="text-left bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/70 rounded-2xl p-3.5 transition cursor-pointer"
        >
          <div className="text-xs font-bold text-zinc-900">Newbie Rewards</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Claim first deposit welcome bonuses</div>
          <div className="text-xs font-semibold text-zinc-700 mt-2 flex items-center gap-1">
            <span>Claim bonus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Analytics & 7-Day Performance Visualization Section */}
      <HomeAnalytics
        user={user}
        tokenRecords={tokenRecords}
        rechargeRecords={rechargeRecords}
        teamMembers={teamMembers}
        onOpenHistory={onOpenHistory}
        onNavigateTeam={() => onNavigateTab('team')}
      />

      {/* Tutorial Section */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 space-y-4">
        <h3 className="text-lg font-bold text-zinc-950">Tutorial</h3>

        <div className="divide-y divide-zinc-100">
          {/* FreeCharge tutorial */}
          <div
            onClick={() => onOpenTutorial('freecharge')}
            className="py-3 flex items-center justify-between cursor-pointer group"
          >
            <div>
              <h4 className="text-sm font-bold text-zinc-900">How to link to FreeCharge?</h4>
              <div className="text-xs font-medium text-zinc-700 mt-2 flex items-center gap-1 group-hover:text-black">
                <span>Watch video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <FreeChargeLogoTile />
          </div>

          {/* Indus tutorial */}
          <div
            onClick={() => onOpenTutorial('indus')}
            className="py-3 flex items-center justify-between cursor-pointer group"
          >
            <div>
              <h4 className="text-sm font-bold text-zinc-900">How to link to Indus?</h4>
              <div className="text-xs font-medium text-zinc-700 mt-2 flex items-center gap-1 group-hover:text-black">
                <span>Watch video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <IndusIndLogoTile />
          </div>

          {/* PhonePe tutorial */}
          <div
            onClick={() => onOpenTutorial('phonepe')}
            className="py-3 flex items-center justify-between cursor-pointer group"
          >
            <div>
              <h4 className="text-sm font-bold text-zinc-900 leading-tight">
                How to link to PhonePe and other?
              </h4>
              <div className="text-xs font-medium text-zinc-700 mt-2 flex items-center gap-1 group-hover:text-black">
                <span>Watch video</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <PhonePeMultiLogoTile />
          </div>
        </div>
      </div>
    </div>
  );
};
