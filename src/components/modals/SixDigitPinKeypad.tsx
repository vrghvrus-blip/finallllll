import React from 'react';

export interface SixDigitPinKeypadProps {
  pin: string;
  onKeyPress: (digit: string) => void;
  onDelete: () => void;
  onNativeKeyboardToggle?: () => void;
  error?: string;
  title?: string;
  subtitle?: string;
}

export const SixDigitPinKeypad: React.FC<SixDigitPinKeypadProps> = ({
  pin,
  onKeyPress,
  onDelete,
  onNativeKeyboardToggle,
  error,
  title,
  subtitle,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Subtitle */}
      {title && (
        <div className="pt-2 pb-3 text-center">
          <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
          {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {/* 6 Square Boxes with dots (matching Screenshot_20261102_235229) */}
      <div className="pb-5 pt-1 px-4 flex justify-center w-full">
        <div className="flex items-center gap-2 sm:gap-2.5">
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

      {error && (
        <p className="text-xs font-semibold text-rose-500 pb-3 text-center">
          {error}
        </p>
      )}

      {/* 3x4 Numeric Keypad */}
      <div className="w-full bg-[#edf0f5] p-2 sm:p-2.5 select-none rounded-2xl border border-zinc-200/80">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {/* Row 1 */}
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onKeyPress(num.toString())}
              className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900 cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Row 2 */}
          {[4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onKeyPress(num.toString())}
              className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900 cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Row 3 */}
          {[7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onKeyPress(num.toString())}
              className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900 cursor-pointer"
            >
              {num}
            </button>
          ))}

          {/* Row 4: Keyboard icon, 0, Backspace icon */}
          <button
            type="button"
            onClick={onNativeKeyboardToggle}
            className="h-12 sm:h-14 bg-transparent active:bg-zinc-200 rounded-lg transition flex items-center justify-center text-zinc-800 cursor-pointer"
            title="Toggle keyboard"
            aria-label="Toggle keyboard"
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

          <button
            type="button"
            onClick={() => onKeyPress('0')}
            className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-2xl font-normal text-zinc-900 cursor-pointer"
          >
            0
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="h-12 sm:h-14 bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-zinc-200 active:scale-[0.98] transition flex items-center justify-center text-zinc-800 cursor-pointer"
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
    </div>
  );
};
