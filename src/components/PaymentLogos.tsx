import React from 'react';

export const PaytmLogo: React.FC<{ className?: string }> = ({ className = 'h-5' }) => (
  <div className={`inline-flex items-center font-black tracking-tighter ${className}`}>
    <span className="text-[#002e6e] text-base font-black">pay</span>
    <span className="text-[#00baf2] text-base font-black">tm</span>
  </div>
);

export const PhonePeLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-[#5f259f] rounded-xl flex items-center justify-center text-white shadow-xs ${className}`}>
    <span className="text-white font-bold text-lg leading-none">पे</span>
  </div>
);

export const MobikwikLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-[#008de4] rounded-xl flex items-center justify-center text-white shadow-xs ${className}`}>
    <span className="text-white font-black text-lg italic leading-none font-sans">M</span>
  </div>
);

export const PhonePeBusinessLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-[#118844] rounded-xl flex items-center justify-center text-white shadow-xs ${className}`}>
    <span className="text-white font-bold text-lg leading-none">पे</span>
  </div>
);

export const PaytmBusinessLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`border border-zinc-200 bg-white rounded-xl flex flex-col items-center justify-center p-1 shadow-xs ${className}`}>
    <div className="flex items-center leading-none scale-75">
      <span className="text-[#002e6e] text-[10px] font-black">pay</span>
      <span className="text-[#00baf2] text-[10px] font-black">tm</span>
    </div>
    <span className="text-[7px] font-bold text-[#002e6e] leading-none uppercase tracking-tighter mt-0.5">
      Business
    </span>
  </div>
);

export const SuperMoneyLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-[#3d5afe] rounded-xl flex items-center justify-center text-white shadow-xs ${className}`}>
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" stroke="currentColor" fill="none" />
    </svg>
  </div>
);

export const MoneyViewLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-white border border-zinc-200 rounded-xl flex flex-col items-center justify-center p-1 shadow-xs ${className}`}>
    <svg className="w-5 h-5 text-emerald-600 fill-current" viewBox="0 0 24 24">
      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.5l5 4.5v6H7v-6l5-4.5z" />
    </svg>
  </div>
);

export const AirtelMerchantLogoIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`bg-white border border-rose-100 rounded-xl flex flex-col items-center justify-center p-1 shadow-xs ${className}`}>
    <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full border border-white"></div>
    </div>
    <span className="text-[6px] font-bold text-red-700 leading-none uppercase mt-0.5 tracking-tighter">
      airtel
    </span>
  </div>
);

export const FreeChargeLogoTile: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`bg-[#f26522] rounded-lg flex flex-col items-center justify-center text-white p-2 shadow-sm ${className}`}>
    <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
    <span className="text-[8px] font-extrabold tracking-widest uppercase mt-0.5 font-sans">FREECHARGE</span>
  </div>
);

export const IndusIndLogoTile: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`bg-[#881922] rounded-lg flex flex-col items-center justify-center text-white p-2 shadow-sm ${className}`}>
    <span className="text-xs font-serif font-bold italic tracking-tight leading-none text-center">IndusInd</span>
    <span className="text-[10px] font-sans font-semibold tracking-wider uppercase mt-1 leading-none text-center">Bank</span>
  </div>
);

export const PhonePeMultiLogoTile: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <div className={`bg-[#5f259f] rounded-lg flex flex-col items-center justify-center text-white p-1.5 shadow-sm space-y-1 ${className}`}>
    <div className="flex items-center gap-1">
      <span className="bg-white text-[#5f259f] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold text-[9px] leading-none">पे</span>
      <span className="text-[9px] font-bold leading-none">PhonePe</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-2.5 h-2.5 rounded-full bg-red-600 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full border border-white"></div>
      </div>
      <span className="text-[8px] font-semibold text-white/90 leading-none">Airtel</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-2.5 h-2.5 rounded bg-blue-500 flex items-center justify-center text-[7px] font-bold">M</div>
      <span className="text-[8px] font-semibold text-blue-200 leading-none">MobiKwik</span>
    </div>
  </div>
);

export const TetherUsdtIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`bg-[#26a17b] rounded-full flex items-center justify-center text-white shadow-sm font-bold ${className}`}>
    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07c-2.83-.24-4.83-1.08-4.83-2.08 0-1 2-1.84 4.83-2.08V11.2c-2.48-.19-4.22-.85-4.22-1.63 0-.91 2.37-1.66 5.39-1.66s5.39.75 5.39 1.66c0 .78-1.74 1.44-4.22 1.63v1.57c2.83.24 4.83 1.08 4.83 2.08 0 1-2 1.84-4.83 2.08zM12 9.07c-2.3 0-4.04.5-4.04 1.05s1.74 1.05 4.04 1.05 4.04-.5 4.04-1.05-1.74-1.05-4.04-1.05z" />
    </svg>
  </div>
);
