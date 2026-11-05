import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UserProfile } from '../../types/rswallet';
import { FreeChargeLogoTile, IndusIndLogoTile, PhonePeMultiLogoTile } from '../PaymentLogos';

interface HomeTabProps {
  user: UserProfile;
  onOpenTopUp: () => void;
  onOpenNewbieGuide: () => void;
  onOpenNewbieReward: () => void;
  onOpenTutorial: (type: 'freecharge' | 'indus' | 'phonepe') => void;
  onNavigateTab: (tab: 'deposit' | 'team' | 'me') => void;
  onOpenHistory: (type: 'recharge' | 'token') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  user,
  onOpenTopUp,
  onOpenNewbieGuide,
  onOpenNewbieReward,
  onOpenTutorial,
  onNavigateTab,
  onOpenHistory,
}) => {
  return (
    <div className="space-y-4 pb-20">
      {/* Title Header matching screenshot_1_65b9a505.png */}
      <div className="pt-2 flex items-center justify-between">
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-2.5">
          <img
            src="/assets/sharkpay-logo.png"
            alt="SharkPay 2.0"
            className="w-8 h-8 rounded-xl object-cover shadow-2xs border border-zinc-200/80"
          />
          <span className="font-black text-2xl tracking-tight text-zinc-950">SharkPay 2.0</span>
        </h1>
        <span className="text-xs font-bold text-zinc-600 bg-white/90 border border-zinc-200/90 px-3 py-0.5 rounded-lg shadow-2xs tracking-wider">
          V2.0
        </span>
      </div>

      {/* Hero Banner: A must read for newbies matching screenshot_1_65b9a505.png */}
      <div className="relative rounded-[24px] bg-[#0c0e14] text-white p-5 overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-[62%]">
          <h2 className="text-xl font-bold tracking-tight leading-snug">
            A must read <span className="text-[#38bdf8]">for</span>
            <span className="text-[#22c55e] block font-black text-2xl mt-0.5">newbies</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 mb-3.5 font-normal">How to make more profits</p>
          <button
            type="button"
            onClick={onOpenNewbieGuide}
            className="border border-white/60 bg-black/40 rounded-lg px-4 py-1.5 text-xs font-semibold text-white tracking-wide hover:bg-white/10 active:scale-95 transition"
          >
            Click to read
          </button>
        </div>

        {/* 3D Book Illustration on Right matching screenshot_1_65b9a505.png */}
        <div className="absolute right-3 top-2 bottom-2 w-32 flex items-center justify-center pointer-events-none select-none">
          <div className="relative transform rotate-[-6deg] hover:rotate-0 transition duration-300">
            {/* 3D Green Book */}
            <div className="w-24 h-28 bg-gradient-to-br from-[#52c41a] via-[#49aa19] to-[#237804] rounded-xl shadow-xl border-l-4 border-[#389e0d] flex items-center justify-center relative">
              {/* Dollar Coin Emblem on Book */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#ffd666] to-[#d48806] shadow-md border-2 border-[#fffb8f] flex items-center justify-center">
                <span className="text-xl font-black text-[#874d00] leading-none">$</span>
              </div>
              {/* Bookmark Ribbon */}
              <div className="absolute -bottom-2 right-4 w-4 h-6 bg-[#ff4d4f] rounded-b-xs shadow-xs"></div>
            </div>
            {/* Subtle floating confetti dots */}
            <div className="absolute -top-1 -left-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute top-4 -right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full opacity-80"></div>
          </div>
        </div>

        {/* Carousel Pagination Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-1">
          <div className="w-5 h-1 bg-white rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Ratio Card matching screenshot_1_65b9a505.png */}
      <div className="bg-white rounded-[22px] p-4.5 border border-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
        <div className="flex-1 pr-3">
          <div className="text-xs font-bold text-zinc-900 tracking-tight">USDT Ratio</div>
          <div className="text-base font-black text-zinc-950 mt-1">
            1 USDT ≈ {user.usdtRatio.toFixed(1)} INR
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5 font-medium">
            Bonus ratio: {user.rewardRatio}%
          </div>
        </div>

        <div className="h-10 w-[1px] bg-zinc-200/80"></div>

        <div className="flex-1 pl-5">
          <div className="text-xs font-bold text-zinc-900 tracking-tight">INR Bonus Ratio</div>
          <div className="text-2xl font-black text-zinc-950 mt-0.5">
            {user.inrBonusRatio.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Newbie Reward Banner matching screenshot_1_65b9a505.png */}
      <button
        type="button"
        onClick={onOpenNewbieReward}
        className="w-full text-left relative rounded-[22px] bg-gradient-to-r from-[#e8eff8] via-[#f2f6fc] to-[#e4eefb] p-4 flex items-center justify-between overflow-hidden border border-zinc-200/70 shadow-[0_4px_16px_rgba(0,0,0,0.04)] group hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
      >
        {/* Pink rounded icon with arch door and rupee coin on left */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#fca5a5] border border-[#f87171]/50 flex items-center justify-center relative flex-shrink-0 shadow-xs">
            {/* White arch/vault */}
            <div className="w-5 h-6 bg-white rounded-t-lg shadow-2xs"></div>
            {/* Rupee coin badge on top right */}
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-black text-[10px] flex items-center justify-center shadow-xs border border-amber-300">
              ₹
            </div>
          </div>
          <span className="text-lg font-black text-[#1e1b4b] tracking-tight">Newbie Reward</span>
        </div>

        {/* 3D Orange car / machine on right */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-10 relative flex items-center justify-end">
            <div className="w-16 h-7 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg relative flex items-center shadow-md">
              <div className="absolute -top-2 left-3 w-8 h-4 bg-white/90 rounded-t-md shadow-2xs"></div>
              <div className="absolute -bottom-1 left-2 w-3.5 h-3.5 bg-zinc-900 rounded-full border border-white"></div>
              <div className="absolute -bottom-1 right-2 w-3.5 h-3.5 bg-zinc-900 rounded-full border border-white"></div>
            </div>
          </div>
        </div>
      </button>

      {/* Top Up Button with "First 🪙" Badge matching screenshot_1_65b9a505.png */}
      <div className="relative">
        <button
          type="button"
          onClick={onOpenTopUp}
          className="w-full py-4 bg-black text-white font-bold text-base rounded-[18px] shadow-sm text-center relative overflow-hidden active:scale-[0.99] hover:bg-zinc-900 transition cursor-pointer"
        >
          Top up
          {/* Diagonal Corner Ribbon "First" */}
          <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
            <div className="absolute transform rotate-45 bg-[#2563eb] text-[10px] font-black text-white py-0.5 right-[-26px] top-[14px] w-[95px] text-center shadow-sm flex items-center justify-center gap-0.5">
              <span>🪙</span>
              <span>First</span>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Grid matching screenshot_1_65b9a505.png */}
      <div className="bg-white rounded-[22px] border border-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4.5 space-y-4">
        {/* Top 4 interactive stats - centered vertically without arrow clutter */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
          {/* Balance */}
          <button
            type="button"
            onClick={() => onOpenHistory('recharge')}
            className="flex flex-col items-center justify-center text-center group py-1.5 px-3 hover:bg-zinc-50/60 rounded-xl transition cursor-pointer"
          >
            <div className="text-xs font-semibold text-zinc-400">Balance</div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">{user.balance}</div>
          </button>

          {/* Today Received */}
          <button
            type="button"
            onClick={() => onOpenHistory('token')}
            className="flex flex-col items-center justify-center text-center group py-1.5 px-3 hover:bg-zinc-50/60 rounded-xl transition cursor-pointer"
          >
            <div className="text-xs font-semibold text-zinc-400">Today Received</div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              {user.todayReceived.toFixed(2)}
            </div>
          </button>

          {/* Top up Bonus */}
          <button
            type="button"
            onClick={() => onOpenHistory('token')}
            className="flex flex-col items-center justify-center text-center group py-1.5 px-3 hover:bg-zinc-50/60 rounded-xl transition cursor-pointer"
          >
            <div className="text-xs font-semibold text-zinc-400">Top up Bonus</div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              {user.topUpBonus.toFixed(2)}
            </div>
          </button>

          {/* Team Commission */}
          <button
            type="button"
            onClick={() => onNavigateTab('team')}
            className="flex flex-col items-center justify-center text-center group py-1.5 px-3 hover:bg-zinc-50/60 rounded-xl transition cursor-pointer"
          >
            <div className="text-xs font-semibold text-zinc-400">Team Commission</div>
            <div className="text-xl font-bold text-zinc-900 mt-0.5">
              {user.teamCommission.toFixed(2)}
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-100"></div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-center">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Yesterday's Recharge</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">{user.yesterdayRecharge}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400">Today's Recharge</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">{user.todayRecharge}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total Recharge</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">{user.totalRecharge}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400">Total Commission</div>
            <div className="text-base font-bold text-zinc-900 mt-0.5">{user.totalCommission}</div>
          </div>
        </div>
      </div>

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
