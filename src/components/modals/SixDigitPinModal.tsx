import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface SixDigitPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  expectedPin?: string;
  onSuccess: (pin: string) => void;
  /** 'set' mode requires typing PIN once, then re-entering to confirm */
  mode?: 'verify' | 'set';
  onResetPin?: () => void;
  onModeSwitchToNativeKeyboard?: () => void;
}

export const SixDigitPinModal: React.FC<SixDigitPinModalProps> = ({
  isOpen,
  onClose,
  title = 'Please enter PIN',
  subtitle,
  expectedPin,
  onSuccess,
  mode = 'verify',
  onResetPin,
}) => {
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [useNativeKeyboard, setUseNativeKeyboard] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setFirstPin('');
      setStage('enter');
      setError('');
      setIsShaking(false);
      setUseNativeKeyboard(false);
    }
  }, [isOpen]);

  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch {
      // ignore
    }
  };

  const handleComplete = useCallback(
    (enteredPin: string) => {
      if (mode === 'set') {
        if (stage === 'enter') {
          // Move to confirm stage
          setFirstPin(enteredPin);
          setPin('');
          setStage('confirm');
          setError('');
        } else {
          // Confirm stage
          if (enteredPin === firstPin) {
            triggerHaptic();
            onSuccess(enteredPin);
            onClose();
          } else {
            setError('PIN does not match. Please try again.');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setPin('');
            setFirstPin('');
            setStage('enter');
          }
        }
      } else {
        // verify mode
        if (expectedPin && enteredPin !== expectedPin) {
          setError('Incorrect PIN. Please try again.');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setPin('');
        } else {
          triggerHaptic();
          onSuccess(enteredPin);
          onClose();
        }
      }
    },
    [mode, stage, firstPin, expectedPin, onSuccess, onClose]
  );

  const handleKeyPress = (num: string) => {
    if (pin.length >= 6) return;
    triggerHaptic();
    const nextPin = pin + num;
    setPin(nextPin);
    setError('');

    if (nextPin.length === 6) {
      setTimeout(() => {
        handleComplete(nextPin);
      }, 120);
    }
  };

  const handleDelete = () => {
    triggerHaptic();
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  // Physical keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin, handleComplete]);

  if (!isOpen) return null;

  const currentTitle =
    mode === 'set'
      ? stage === 'enter'
        ? 'Please enter PIN'
        : 'Please confirm PIN'
      : title;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 cursor-default"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
      >
        {/* Top Sheet Header */}
        <div className="pt-6 pb-4 px-6 text-center relative select-none">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 p-1 text-zinc-400 hover:text-zinc-700 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-base font-semibold text-zinc-950 tracking-normal">
            {currentTitle}
          </h3>

          {error ? (
            <p className="text-xs text-rose-500 font-semibold mt-1 animate-pulse">
              {error}
            </p>
          ) : mode === 'set' ? (
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {stage === 'enter' ? 'Set a 6-digit transaction PIN' : 'Re-enter your 6-digit PIN'}
            </p>
          ) : null}
        </div>

        {/* 6 Square PIN Digits Display (matching Screenshot_20261102_235229) */}
        <div className="pb-6 pt-2 px-6 flex justify-center">
          <div
            className={`flex items-center gap-2 sm:gap-2.5 ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
            }`}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = index < pin.length;
              const isCurrent = index === pin.length;

              return (
                <div
                  key={index}
                  className={`w-11 h-12 sm:w-12 sm:h-13 rounded-lg bg-[#f4f5f7] flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'border-2 border-zinc-400 shadow-2xs'
                      : 'border border-transparent'
                  }`}
                >
                  {isFilled && (
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-950 inline-block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden input for native keyboard support when toggle pressed */}
        {useNativeKeyboard && (
          <div className="px-6 pb-4">
            <input
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              autoFocus
              onChange={(e) => {
                const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(clean);
                if (clean.length === 6) {
                  setTimeout(() => handleComplete(clean), 120);
                }
              }}
              placeholder="Enter PIN on keyboard"
              className="w-full text-center py-2.5 bg-zinc-100 rounded-xl text-lg font-mono tracking-widest text-zinc-900 border border-zinc-300 focus:outline-none"
            />
          </div>
        )}

        {/* Authentic Numeric Keypad (matching Screenshot_20261102_235229) */}
        {!useNativeKeyboard && (
          <div className="bg-[#edf0f5] p-2 sm:p-2.5 select-none border-t border-zinc-200/80">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Row 1 */}
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900"
                >
                  {num}
                </button>
              ))}

              {/* Row 2 */}
              {[4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900"
                >
                  {num}
                </button>
              ))}

              {/* Row 3 */}
              {[7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900"
                >
                  {num}
                </button>
              ))}

              {/* Row 4: Keyboard Toggle, 0, Backspace */}
              {/* Keyboard toggle icon */}
              <button
                type="button"
                onClick={() => setUseNativeKeyboard(true)}
                className="h-12 sm:h-14 bg-transparent active:bg-zinc-200 rounded-lg transition flex items-center justify-center text-zinc-800"
                title="Use System Keyboard"
                aria-label="Use System Keyboard"
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="6" y1="8" x2="6.01" y2="8" strokeWidth="2.5" />
                  <line x1="10" y1="8" x2="10.01" y2="8" strokeWidth="2.5" />
                  <line x1="14" y1="8" x2="14.01" y2="8" strokeWidth="2.5" />
                  <line x1="18" y1="8" x2="18.01" y2="8" strokeWidth="2.5" />
                  <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="2.5" />
                  <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="2.5" />
                  <line x1="10" y1="12" x2="14" y2="12" strokeWidth="2" />
                  <line x1="8" y1="16" x2="16" y2="16" strokeWidth="2" />
                </svg>
              </button>

              {/* Number 0 */}
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900"
              >
                0
              </button>

              {/* Backspace icon (exact match to screenshot) */}
              <button
                type="button"
                onClick={handleDelete}
                className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-zinc-800"
                aria-label="Delete"
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="17" y1="9" x2="12" y2="14" />
                  <line x1="12" y1="9" x2="17" y2="14" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
