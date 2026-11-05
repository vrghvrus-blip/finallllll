import React from 'react';
import { X, Plus, Check } from 'lucide-react';
import { UPIAccount } from '../../types/rswallet';

interface SelectSendUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  sendAccounts: UPIAccount[];
  selectedAccountId?: string;
  onSelectAccount: (account: UPIAccount) => void;
  onAddNewSendUpi: () => void;
}

export const SelectSendUpiModal: React.FC<SelectSendUpiModalProps> = ({
  isOpen,
  onClose,
  sendAccounts,
  selectedAccountId,
  onSelectAccount,
  onAddNewSendUpi,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-3xl p-6 sm:p-7 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
        {/* Close Icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-zinc-400 hover:text-zinc-800 rounded-full transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title matching Screenshot_20261102_235210 */}
        <h3 className="text-xl font-bold text-zinc-950 mb-6">
          Select Send UPI
        </h3>

        {sendAccounts.length === 0 ? (
          /* Empty state: Direct "Add Send UPI" button matching Screenshot_20261102_235210 exactly */
          <div className="w-full space-y-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNewSendUpi();
              }}
              className="w-full py-4 bg-black text-white font-bold text-base rounded-2xl hover:bg-zinc-800 active:scale-[0.98] transition shadow-md"
            >
              Add Send UPI
            </button>
          </div>
        ) : (
          /* List of available send accounts with selection */
          <div className="w-full space-y-3">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
              {sendAccounts.map((account) => {
                const isSelected = selectedAccountId === account.id;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => onSelectAccount(account)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{account.appName}</div>
                      <div className="text-xs font-mono opacity-80 mt-0.5">{account.upiId}</div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-white text-zinc-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-zinc-300" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNewSendUpi();
              }}
              className="w-full py-3 bg-zinc-100 text-zinc-900 font-bold text-xs rounded-xl hover:bg-zinc-200 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Send UPI</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
