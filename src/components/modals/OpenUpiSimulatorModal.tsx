import React, { useState } from 'react';
import { X, Smartphone, Check, Lock, ShieldCheck } from 'lucide-react';
import { SixDigitPinKeypad } from './SixDigitPinKeypad';

interface OpenUpiSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  upiId: string;
  expectedPin?: string;
}

export const OpenUpiSimulatorModal: React.FC<OpenUpiSimulatorModalProps> = ({
  isOpen,
  onClose,
  appName,
  upiId,
  expectedPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [testingPin, setTestingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [showPinKeypad, setShowPinKeypad] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pinInput.length >= 6 || testingPin) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setPinError('');

    if (nextPin.length === 6) {
      setTestingPin(true);
      setTimeout(() => {
        setTestingPin(false);
        if (expectedPin && nextPin !== expectedPin) {
          setPinError('Incorrect UPI PIN. Please enter the configured 6-digit PIN.');
          setPinInput('');
          return;
        }
        setPinVerified(true);
        setTimeout(() => {
          setPinVerified(false);
          setPinInput('');
          setShowPinKeypad(false);
        }, 2000);
      }, 500);
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setPinError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header with App Branding */}
        <div className="p-4 bg-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">{appName} UPI Terminal</h3>
              <p className="text-[10px] text-zinc-400">NPCI Direct Settlement Gateway</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-zinc-700">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Connected Virtual Address
            </span>
            <div className="text-base font-mono font-black text-zinc-900">{upiId}</div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>NPCI Link Active & Authorized</span>
            </div>
          </div>

          {/* Test UPI PIN Security */}
          <div className="border border-zinc-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <Lock className="w-4 h-4 text-zinc-700" />
                <span>6-Digit UPI PIN Authorization</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Secured
              </span>
            </div>

            {pinVerified ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>UPI PIN Verified! Ready for transactions.</span>
              </div>
            ) : !showPinKeypad ? (
              <button
                type="button"
                onClick={() => {
                  setShowPinKeypad(true);
                  setPinInput('');
                  setPinError('');
                }}
                className="w-full py-3 bg-zinc-900 text-white font-bold text-xs rounded-xl hover:bg-black transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize & Enter 6-Digit PIN</span>
              </button>
            ) : (
              <div className="space-y-2">
                <SixDigitPinKeypad
                  title="Please enter PIN"
                  subtitle="Authorize settlement with your 6-digit PIN"
                  pin={pinInput}
                  onKeyPress={handleKeyPress}
                  onDelete={handleDelete}
                  error={pinError}
                />
              </div>
            )}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center gap-2 text-xs text-zinc-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Inbound trade orders assigned to this UPI handle require this 6-digit PIN for final
              settlement approval.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition shadow-sm"
          >
            Close UPI Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
