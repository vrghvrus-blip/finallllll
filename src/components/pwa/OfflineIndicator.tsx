import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-500/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-in slide-in-from-top-2 border border-amber-400">
      <span className="h-2 w-2 rounded-full bg-white animate-ping" />
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — Cached data is being used</span>
    </div>
  );
};
