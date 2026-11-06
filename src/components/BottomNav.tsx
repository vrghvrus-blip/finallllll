import React from 'react';
import { TabType } from '../types/rswallet';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[460px] mx-auto bg-white/95 backdrop-blur-md border-t border-zinc-200/80 z-40 px-2 py-2 flex items-center justify-around select-none shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {/* Home */}
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-zinc-950 font-bold' : 'text-zinc-400 font-medium hover:text-zinc-600'
        }`}
      >
        <svg className="w-5 h-5 fill-current transition-transform duration-200" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
        {activeTab === 'home' && (
          <div className="w-1.5 h-1 bg-[#c96b20] rounded-full mt-0.5 transition-all shadow-[0_0_4px_rgba(201,107,32,0.4)]" />
        )}
      </button>

      {/* Deposit */}
      <button
        type="button"
        onClick={() => onSelectTab('deposit')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'deposit' ? 'text-zinc-950 font-bold' : 'text-zinc-400 font-medium hover:text-zinc-600'
        }`}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 fill-current transition-transform duration-200" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2H8v-2h3v-2l3 3-3 3zm5-6h-3V9h3V7l3 3-3 3z" />
          </svg>
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">Deposit</span>
        {activeTab === 'deposit' && (
          <div className="w-1.5 h-1 bg-[#c96b20] rounded-full mt-0.5 transition-all shadow-[0_0_4px_rgba(201,107,32,0.4)]" />
        )}
      </button>

      {/* UPI */}
      <button
        type="button"
        onClick={() => onSelectTab('upi')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'upi' ? 'text-zinc-950 font-bold' : 'text-zinc-400 font-medium hover:text-zinc-600'
        }`}
      >
        <svg className="w-5 h-5 fill-current transition-transform duration-200" viewBox="0 0 24 24">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
        <span className="text-[11px] mt-0.5 tracking-tight">UPI</span>
        {activeTab === 'upi' && (
          <div className="w-1.5 h-1 bg-[#c96b20] rounded-full mt-0.5 transition-all shadow-[0_0_4px_rgba(201,107,32,0.4)]" />
        )}
      </button>

      {/* Team */}
      <button
        type="button"
        onClick={() => onSelectTab('team')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'team' ? 'text-zinc-950 font-bold' : 'text-zinc-400 font-medium hover:text-zinc-600'
        }`}
      >
        <svg className="w-5 h-5 fill-current transition-transform duration-200" viewBox="0 0 24 24">
          <path d="M4 6h16a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v0a2 2 0 002 2zm0 8h16a2 2 0 002-2v0a2 2 0 00-2-2H4a2 2 0 00-2 2v0a2 2 0 002 2zm0 8h16a2 2 0 002-2v0a2 2 0 00-2-2H4a2 2 0 00-2 2v0a2 2 0 002 2z" />
        </svg>
        <span className="text-[11px] mt-0.5 tracking-tight">Team</span>
        {activeTab === 'team' && (
          <div className="w-1.5 h-1 bg-[#c96b20] rounded-full mt-0.5 transition-all shadow-[0_0_4px_rgba(201,107,32,0.4)]" />
        )}
      </button>

      {/* Me */}
      <button
        type="button"
        onClick={() => onSelectTab('me')}
        className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'me' ? 'text-zinc-950 font-bold' : 'text-zinc-400 font-medium hover:text-zinc-600'
        }`}
      >
        <svg className="w-5 h-5 fill-current transition-transform duration-200" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5L2 22l5.22-1.31C8.61 21.46 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-3 8c.83 0 1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5S8.17 10 9 10zm6 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-3 7c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
        </svg>
        <span className="text-[11px] mt-0.5 tracking-tight">Me</span>
        {activeTab === 'me' && (
          <div className="w-1.5 h-1 bg-[#c96b20] rounded-full mt-0.5 transition-all shadow-[0_0_4px_rgba(201,107,32,0.4)]" />
        )}
      </button>
    </nav>
  );
};
