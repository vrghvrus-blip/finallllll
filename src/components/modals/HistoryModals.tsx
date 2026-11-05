import React, { useState } from 'react';
import { X, Clock, FileText, CheckCircle2, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { RechargeRecord, TokenRecord } from '../../types/rswallet';

interface RechargeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: RechargeRecord[];
}

export const RechargeHistoryModal: React.FC<RechargeHistoryModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  const [filter, setFilter] = useState<'all' | 'success' | 'pending'>('all');

  if (!isOpen) return null;

  const filtered = records.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">Recharge History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-100 pb-2">
          {(['all', 'success', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition ${
                filter === tab
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              No recharge records found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">
                      {item.type} Recharge
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.date}</div>
                    {item.upiRef && (
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Ref: {item.upiRef}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-zinc-950">
                    +{item.inrValue.toLocaleString()} INR
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      item.status === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : item.status === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface TokenHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: TokenRecord[];
}

export const TokenHistoryModal: React.FC<TokenHistoryModalProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">Token History</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {records.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              No token history records found.
            </div>
          ) : (
            records.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/80 rounded-xl p-3.5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-zinc-900">{item.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{item.date}</div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-sm font-black ${
                      item.isPositive ? 'text-emerald-600' : 'text-zinc-900'
                    }`}
                  >
                    {item.isPositive ? '+' : '-'}
                    {item.amount.toLocaleString()} INR
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {item.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
