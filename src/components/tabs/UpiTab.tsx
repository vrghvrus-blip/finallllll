import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  PlayCircle,
  Smartphone,
  Lock,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Shield,
  Trash2,
  Zap,
} from 'lucide-react';
import { UPIAccount } from '../../types/rswallet';
import { PaytmLogo } from '../PaymentLogos';
import { SixDigitPinModal } from '../modals/SixDigitPinModal';

interface UpiTabProps {
  accounts: UPIAccount[];
  onToggleSaleStatus: (id: string) => void;
  onAddNewAccount: (type?: 'receive' | 'send' | 'both') => void;
  onOpenHowBindUpi: () => void;
  onOpenUpiApp: (appName: string, upiId: string) => void;
  onAccountPinVerified?: (account: UPIAccount) => void;
  onDeleteAccount?: (id: string) => void;
  onTriggerInstantSettlement?: () => void;
  userQuota?: number;
}

export const UpiTab: React.FC<UpiTabProps> = ({
  accounts,
  onToggleSaleStatus,
  onAddNewAccount,
  onOpenHowBindUpi,
  onOpenUpiApp,
  onAccountPinVerified,
  onDeleteAccount,
  onTriggerInstantSettlement,
  userQuota = 0,
}) => {
  const [upiSubTab, setUpiSubTab] = useState<'receive' | 'send'>('receive');
  const [isAvailableOpen, setIsAvailableOpen] = useState(true);
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);

  // 6-Digit PIN Modal state (Screenshot match)
  const [pinModalAccount, setPinModalAccount] = useState<UPIAccount | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinActionType, setPinActionType] = useState<'sale_toggle' | 'open_upi' | 'authorize' | 'delete'>('authorize');

  // Filter accounts
  const availableAccounts = accounts.filter(
    (acc) => acc.status === 'Authorized' && (acc.type === 'both' || acc.type === upiSubTab)
  );

  const unavailableAccounts = accounts.filter(
    (acc) => acc.status !== 'Authorized' && (acc.type === 'both' || acc.type === upiSubTab)
  );

  const hasOnSaleAccount = availableAccounts.some((acc) => acc.isOnSale);

  const handleOpenUpiWithPin = (account: UPIAccount) => {
    setPinModalAccount(account);
    setPinActionType('open_upi');
    setIsPinModalOpen(true);
  };

  const handleToggleSaleWithPin = (account: UPIAccount) => {
    setPinModalAccount(account);
    setPinActionType('sale_toggle');
    setIsPinModalOpen(true);
  };

  const handleDeleteWithPin = (account: UPIAccount) => {
    setPinModalAccount(account);
    setPinActionType('delete');
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    if (!pinModalAccount) return;
    if (pinActionType === 'open_upi') {
      onOpenUpiApp(pinModalAccount.appName, pinModalAccount.upiId);
    } else if (pinActionType === 'sale_toggle') {
      onToggleSaleStatus(pinModalAccount.id);
    } else if (pinActionType === 'delete') {
      if (onDeleteAccount) {
        onDeleteAccount(pinModalAccount.id);
      }
    }
    if (onAccountPinVerified) {
      onAccountPinVerified(pinModalAccount);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Title */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight">UPI Accounts</h1>
          <p className="text-xs text-zinc-500 font-medium">Manage linked settlement UPI IDs</p>
        </div>
        <button
          type="button"
          onClick={onOpenHowBindUpi}
          className="flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 bg-zinc-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
        </button>
      </div>

      {/* Sub-tabs Segmented Controls */}
      <div className="flex bg-zinc-100 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setUpiSubTab('receive')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
            upiSubTab === 'receive'
              ? 'bg-white text-zinc-950 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Receive Payment
        </button>
        <button
          type="button"
          onClick={() => setUpiSubTab('send')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
            upiSubTab === 'send'
              ? 'bg-white text-zinc-950 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Send Payment
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-zinc-600 text-xs">
        <div className="w-4 h-4 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          i
        </div>
        <span>Keep your account set to "on sale" with active quota to receive orders</span>
      </div>

      {/* Dynamic Settlement Engine Status */}
      {hasOnSaleAccount ? (
        userQuota > 0 ? (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-emerald-900 shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-emerald-950 font-black flex items-center gap-1.5">
                  <span>Auto Settlement Engine Active</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Dispatches orders against available Quota (₹{userQuota.toLocaleString()})
                </div>
              </div>
            </div>
            {onTriggerInstantSettlement && (
              <button
                type="button"
                onClick={onTriggerInstantSettlement}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                title="Trigger simulated incoming payment"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Match Order</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-amber-800">
            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Account is on sale, but Quota is 0 INR. Top up or buy Quota in Deposit tab to receive settlements.</span>
          </div>
        )
      ) : null}

      {/* How to bind UPI? */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={onOpenHowBindUpi}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-black cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 fill-none stroke-current" />
          <span>How to bind UPI?</span>
        </button>
      </div>

      {/* Accordion: Available */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsAvailableOpen(!isAvailableOpen)}
          className="w-full flex items-center justify-between text-left py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-zinc-950">Available</span>
            <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
              {availableAccounts.length}
            </span>
          </div>
          {isAvailableOpen ? (
            <ChevronUp className="w-5 h-5 text-zinc-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-700" />
          )}
        </button>

        {isAvailableOpen && (
          <div className="space-y-3 pt-2">
            {availableAccounts.length === 0 ? (
              /* 0 Data Empty State */
              <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-zinc-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-700">No UPI Account Bound</p>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    Bind your Paytm, PhonePe, or GPay account, set your secure 6-digit UPI PIN, then open
                    UPI to start receiving payments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddNewAccount(upiSubTab === 'send' ? 'send' : 'both')}
                  className="px-4 py-2 bg-white text-zinc-950 border border-[#e2d9ca] text-xs font-bold rounded-lg hover:bg-[#faf7f2] transition active:scale-95 inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Bind Account & Set PIN</span>
                </button>
              </div>
            ) : (
              availableAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-xl p-4 border border-zinc-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* App Logo */}
                      {account.appType === 'paytm' ? (
                        <PaytmLogo className="w-12 h-6" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#f4efe6] text-zinc-900 border border-[#e2d9ca] font-black flex items-center justify-center text-xs shadow-2xs">
                          {account.appName.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="text-base font-black text-zinc-950">{account.title}</div>
                        <div className="text-xs text-zinc-500 font-medium mt-0.5">
                          {account.upiId}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-[#0891b2]">
                            Status: {account.status}
                          </span>
                          {account.pin && (
                            <button
                              type="button"
                              onClick={() => handleOpenUpiWithPin(account)}
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 hover:bg-emerald-100 transition"
                            >
                              <Lock className="w-2.5 h-2.5" />
                              <span>6-Digit PIN Set</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Switch toggle: not sale / on sale */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSaleWithPin(account)}
                        className={`relative inline-flex h-7 w-24 items-center rounded-full transition-colors ${
                          account.isOnSale ? 'bg-emerald-500' : 'bg-zinc-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                            account.isOnSale ? 'translate-x-17' : 'translate-x-0.5'
                          }`}
                        />
                        <span
                          className={`absolute text-[10px] font-bold ${
                            account.isOnSale ? 'left-2 text-white' : 'right-2.5 text-zinc-500'
                          }`}
                        >
                          {account.isOnSale ? 'on sale' : 'not sale'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Open UPI Action Bar */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {account.bankName || 'Direct NPCI Settlement'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteWithPin(account)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition active:scale-95 cursor-pointer"
                        title="Unbind Account"
                        aria-label="Unbind Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenUpiWithPin(account)}
                        className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-800 flex items-center gap-1 transition active:scale-95 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Open UPI</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Accordion: Unavailable */}
      <div className="pt-2 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => setIsUnavailableOpen(!isUnavailableOpen)}
          className="w-full flex items-center justify-between text-left py-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-zinc-950">Unavailable</span>
            <span className="text-xs font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
              {unavailableAccounts.length}
            </span>
          </div>
          {isUnavailableOpen ? (
            <ChevronUp className="w-5 h-5 text-zinc-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-700" />
          )}
        </button>

        {isUnavailableOpen && (
          <div className="space-y-3 pt-2">
            {unavailableAccounts.length === 0 ? (
              <div className="bg-white rounded-xl p-4 text-center text-xs text-zinc-400 border border-zinc-100">
                No unavailable accounts.
              </div>
            ) : (
              unavailableAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white/80 rounded-xl p-4 border border-zinc-200/70 shadow-sm flex items-center justify-between opacity-75"
                >
                  <div>
                    <div className="text-sm font-bold text-zinc-800">{account.title}</div>
                    <div className="text-xs text-zinc-500">{account.upiId}</div>
                    <div className="text-xs font-semibold text-rose-500 mt-1">
                      Status: {account.status}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteWithPin(account)}
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition active:scale-95 cursor-pointer"
                    title="Unbind Account"
                    aria-label="Unbind Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="pt-10 space-y-3">
        {/* Counters: Available & Unavailable */}
        <div className="flex items-center gap-6 text-sm">
          <span className="text-zinc-500 font-medium">
            Available <strong className="text-zinc-950 font-black">{availableAccounts.length}</strong>
          </span>
          <span className="text-zinc-500 font-medium">
            Unavailable{' '}
            <strong className="text-zinc-950 font-black">{unavailableAccounts.length}</strong>
          </span>
        </div>

        {/* Add new account button (Milk Colour Light UI) */}
        <button
          type="button"
          onClick={() => onAddNewAccount(upiSubTab === 'send' ? 'send' : 'both')}
          className="w-full py-3.5 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] text-zinc-950 border border-[#e2d9ca] font-bold text-base rounded-2xl hover:bg-[#eee8dc] active:scale-98 transition shadow-xs text-center cursor-pointer"
        >
          + Add new account
        </button>
      </div>

      {/* Authentic 6-Digit PIN Modal matching Screenshot_20261102_235229 */}
      <SixDigitPinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPinModalAccount(null);
        }}
        title="Please enter PIN"
        expectedPin={pinModalAccount?.pin}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
};
