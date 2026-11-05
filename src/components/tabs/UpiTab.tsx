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
}

export const UpiTab: React.FC<UpiTabProps> = ({
  accounts,
  onToggleSaleStatus,
  onAddNewAccount,
  onOpenHowBindUpi,
  onOpenUpiApp,
  onAccountPinVerified,
}) => {
  const [upiSubTab, setUpiSubTab] = useState<'receive' | 'send'>('receive');
  const [isAvailableOpen, setIsAvailableOpen] = useState(true);
  const [isUnavailableOpen, setIsUnavailableOpen] = useState(false);

  // 6-Digit PIN Modal state (Screenshot match)
  const [pinModalAccount, setPinModalAccount] = useState<UPIAccount | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinActionType, setPinActionType] = useState<'sale_toggle' | 'open_upi' | 'authorize'>('authorize');

  // Filter accounts
  const availableAccounts = accounts.filter(
    (acc) => acc.status === 'Authorized' && (acc.type === 'both' || acc.type === upiSubTab)
  );

  const unavailableAccounts = accounts.filter(
    (acc) => acc.status !== 'Authorized' && (acc.type === 'both' || acc.type === upiSubTab)
  );

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

  const handlePinSuccess = () => {
    if (!pinModalAccount) return;
    if (pinActionType === 'open_upi') {
      onOpenUpiApp(pinModalAccount.appName, pinModalAccount.upiId);
    } else if (pinActionType === 'sale_toggle') {
      onToggleSaleStatus(pinModalAccount.id);
    }
    if (onAccountPinVerified) {
      onAccountPinVerified(pinModalAccount);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Title */}
      <div className="pt-2">
        <h1 className="text-2xl font-black text-zinc-950 tracking-tight">UPI</h1>
      </div>

      {/* Sub-tabs: Receive Payment | Send Payment */}
      <div className="flex items-center gap-6 border-b border-zinc-100 pb-2">
        <button
          type="button"
          onClick={() => setUpiSubTab('receive')}
          className={`text-base font-bold transition-colors ${
            upiSubTab === 'receive' ? 'text-zinc-950 font-black' : 'text-zinc-400 font-semibold'
          }`}
        >
          Receive Payment
        </button>
        <button
          type="button"
          onClick={() => setUpiSubTab('send')}
          className={`text-base font-bold transition-colors ${
            upiSubTab === 'send' ? 'text-zinc-950 font-black' : 'text-zinc-400 font-semibold'
          }`}
        >
          Send Payment
        </button>
      </div>

      {/* Alert Banner: Please keep your account available */}
      <div className="bg-zinc-100/90 rounded-lg p-3 flex items-center justify-center gap-2.5 text-zinc-600 text-xs font-semibold">
        <div className="w-4 h-4 rounded-full bg-zinc-700 text-white flex items-center justify-center text-[10px] font-bold">
          !
        </div>
        <span>Please keep your account available</span>
      </div>

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
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition active:scale-95 inline-flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
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
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white font-black flex items-center justify-center text-xs shadow-xs">
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
                    <button
                      type="button"
                      onClick={() => handleOpenUpiWithPin(account)}
                      className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-800 flex items-center gap-1 transition active:scale-95"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Open UPI</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </button>
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

        {/* Add new account button */}
        <button
          type="button"
          onClick={() => onAddNewAccount(upiSubTab === 'send' ? 'send' : 'both')}
          className="w-full py-3.5 bg-black text-white font-bold text-base rounded-xl hover:bg-zinc-800 active:scale-95 transition shadow-sm text-center"
        >
          Add new account
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
