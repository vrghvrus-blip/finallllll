import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Fingerprint,
  Scan,
  Smartphone,
  KeyRound,
  Check,
  Copy,
  AlertTriangle,
  History,
  Lock,
} from 'lucide-react';
import QRCode from 'qrcode';
import { UserProfile, SecurityEvent } from '../../types/rswallet';
import { verifyTotpCode, generateTotpCode, getSecondsRemaining } from '../../utils/totp';

interface SecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateSecurity: (updates: Partial<UserProfile>) => void;
  onTestBiometric: (type: 'fingerprint' | 'face_id') => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateSecurity,
  onTestBiometric,
}) => {
  const [activeSubView, setActiveSubView] = useState<'main' | 'totp' | 'sms'>('main');
  const [totpCode, setTotpCode] = useState('');
  const [currentLiveTotp, setCurrentLiveTotp] = useState('');
  const [totpSecondsLeft, setTotpSecondsLeft] = useState(30);

  const [smsOtp, setSmsOtp] = useState('');
  const [generatedSmsCode, setGeneratedSmsCode] = useState('');
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [incomingSmsText, setIncomingSmsText] = useState<string | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Sample security audit records
  const [auditEvents] = useState<SecurityEvent[]>([
    {
      id: 'sec-1',
      type: 'login',
      description: 'Session logged in with device token',
      timestamp: 'Today, 10:14 AM',
      status: 'success',
    },
    {
      id: 'sec-2',
      type: 'pin_verified',
      description: '6-digit UPI PIN authorized for transaction',
      timestamp: 'Yesterday, 04:30 PM',
      status: 'success',
    },
    {
      id: 'sec-3',
      type: 'biometric_auth',
      description: 'Fingerprint hardware sensor authenticated',
      timestamp: '2 days ago',
      status: 'success',
    },
  ]);

  useEffect(() => {
    if (isOpen && activeSubView === 'totp') {
      const otpAuthUrl = `otpauth://totp/SharkPay:${user.phone || 'User'}?secret=${user.twoFactorSecret}&issuer=SharkPay`;
      QRCode.toDataURL(otpAuthUrl, { width: 160, margin: 1 })
        .then((url) => setQrUrl(url))
        .catch((err) => console.error(err));

      // Compute initial live code
      generateTotpCode(user.twoFactorSecret).then((code) => setCurrentLiveTotp(code));
    }
  }, [isOpen, activeSubView, user.phone, user.twoFactorSecret]);

  // Clock sync for TOTP period and countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOpen && activeSubView === 'totp') {
      timer = setInterval(() => {
        const remaining = getSecondsRemaining();
        setTotpSecondsLeft(remaining);
        if (remaining === 30 || remaining === 1) {
          generateTotpCode(user.twoFactorSecret).then((code) => setCurrentLiveTotp(code));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, activeSubView, user.twoFactorSecret]);

  // SMS cooldown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (smsCountdown > 0 && activeSubView === 'sms') {
      timer = setInterval(() => {
        setSmsCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [smsCountdown, activeSubView]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(user.twoFactorSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleOpenSmsSetup = () => {
    setErrorMsg('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSmsCode(code);
    setSmsOtp('');
    setSmsCountdown(60);
    setIncomingSmsText(`SharkPay Security Code: ${code}. Do not share this OTP.`);
    setActiveSubView('sms');
  };

  const handleResendSms = () => {
    if (smsCountdown > 0) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedSmsCode(code);
    setSmsCountdown(60);
    setIncomingSmsText(`New SharkPay Security Code: ${code}.`);
    setErrorMsg('');
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.length !== 6) {
      setErrorMsg('Please enter a 6-digit TOTP code');
      return;
    }
    setIsVerifying(true);
    setErrorMsg('');
    const isValid = await verifyTotpCode(user.twoFactorSecret, totpCode);
    setIsVerifying(false);

    if (!isValid) {
      setErrorMsg('Invalid authenticator code. Please check your app and try again.');
      return;
    }

    onUpdateSecurity({ is2FAEnabled: true });
    setActiveSubView('main');
    setErrorMsg('');
  };

  const handleVerifySms = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit SMS code');
      return;
    }
    if (smsOtp !== generatedSmsCode) {
      setErrorMsg('Incorrect verification code. Please check your SMS or resend.');
      return;
    }
    onUpdateSecurity({ isSmsMfaEnabled: true });
    setActiveSubView('main');
    setErrorMsg('');
  };

  const toggleBiometrics = () => {
    const nextState = !user.isBiometricEnabled;
    onUpdateSecurity({ isBiometricEnabled: nextState });
    if (nextState) {
      onTestBiometric(user.biometricType || 'fingerprint');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-950" />
            <h3 className="text-base font-black text-zinc-950">Security & MFA Protection</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-zinc-800">
          {activeSubView === 'main' && (
            <>
              {/* Security Status Card */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-4 text-white shadow-md space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Account Defense Level</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    {user.isBiometricEnabled && (user.is2FAEnabled || user.isSmsMfaEnabled)
                      ? 'Maximum (3/3)'
                      : user.isBiometricEnabled || user.is2FAEnabled || user.isSmsMfaEnabled
                      ? 'High (2/3)'
                      : 'Basic (1/3)'}
                  </span>
                </div>
                <div className="text-xl font-black pt-1">
                  SharkPay Vault Defense
                </div>
                <p className="text-[11px] text-zinc-300">
                  Secures USDT transfers, UPI settlement accounts, and withdrawal approvals.
                </p>
              </div>

              {/* 1. Biometric Authentication */}
              <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      {user.biometricType === 'face_id' ? (
                        <Scan className="w-5 h-5" />
                      ) : (
                        <Fingerprint className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-zinc-950">Biometric Authentication</div>
                      <div className="text-[11px] text-zinc-500">
                        Fingerprint & Face ID instant validation
                      </div>
                    </div>
                  </div>

                  {/* Switch */}
                  <button
                    type="button"
                    onClick={toggleBiometrics}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                      user.isBiometricEnabled ? 'bg-emerald-600' : 'bg-zinc-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        user.isBiometricEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {user.isBiometricEnabled && (
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateSecurity({ biometricType: 'fingerprint' })}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                          user.biometricType === 'fingerprint'
                            ? 'bg-[#f4efe6] text-zinc-950 border border-[#e2d9ca] shadow-2xs'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        Fingerprint
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateSecurity({ biometricType: 'face_id' })}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                          user.biometricType === 'face_id'
                            ? 'bg-[#f4efe6] text-zinc-950 border border-[#e2d9ca] shadow-2xs'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        Face ID
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTestBiometric(user.biometricType)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Test Sensor ⚡
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Security PIN & Multi-Factor Authentication */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Security PIN & Multi-Factor Protection
                </h4>

                {/* 6-Digit Transaction / Account Authorization PIN */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-950">
                        6-Digit Security PIN
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {user.securityPin ? 'Protected with 6-digit PIN' : 'Not set yet (prompted on Add Account)'}
                      </div>
                    </div>
                  </div>

                  {user.securityPin ? (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateSecurity({ securityPin: '' });
                        localStorage.removeItem('sharkpay_security_pin');
                      }}
                      className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-lg hover:bg-rose-100 cursor-pointer"
                    >
                      Reset PIN
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-zinc-400 px-2.5 py-1 bg-zinc-100 rounded-lg">
                      Unset
                    </span>
                  )}
                </div>

                {/* Authenticator App */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-950">
                        Authenticator App (TOTP)
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Google Authenticator, Authy, MS Authenticator
                      </div>
                    </div>
                  </div>

                  {user.is2FAEnabled ? (
                    <button
                      type="button"
                      onClick={() => onUpdateSecurity({ is2FAEnabled: false })}
                      className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-lg hover:bg-rose-100"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setActiveSubView('totp');
                      }}
                      className="text-xs font-bold text-zinc-900 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
                    >
                      Setup
                    </button>
                  )}
                </div>

                {/* SMS 2FA */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-950">SMS Phone MFA</div>
                      <div className="text-[10px] text-zinc-500">
                        SMS OTP sent to {user.phone ? `+91 ${user.phone}` : 'registered number'}
                      </div>
                    </div>
                  </div>

                  {user.isSmsMfaEnabled ? (
                    <button
                      type="button"
                      onClick={() => onUpdateSecurity({ isSmsMfaEnabled: false })}
                      className="text-xs font-bold text-rose-600 px-3 py-1 bg-rose-50 rounded-lg hover:bg-rose-100"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenSmsSetup}
                      className="text-xs font-bold text-zinc-900 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
                    >
                      Setup
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Security Audit Log */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Security Activity Log
                  </span>
                  <History className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3 divide-y divide-zinc-200/50">
                  {auditEvents.map((evt) => (
                    <div key={evt.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-zinc-900">{evt.description}</div>
                        <div className="text-[10px] text-zinc-400">{evt.timestamp}</div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ================= SUB VIEW: TOTP SETUP ================= */}
          {activeSubView === 'totp' && (
            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubView('main')}
                  className="text-xs font-bold text-zinc-500 hover:text-black"
                >
                  ← Back
                </button>
                <h4 className="text-sm font-black text-zinc-950">Setup Authenticator App</h4>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Scan this QR code with Google Authenticator, or paste the secret key:
              </p>

              <div className="flex justify-center p-3 bg-white border border-zinc-200 rounded-2xl">
                {qrUrl ? (
                  <img src={qrUrl} alt="TOTP QR" className="w-36 h-36" />
                ) : (
                  <div className="w-36 h-36 bg-zinc-100 animate-pulse rounded" />
                )}
              </div>

              <div className="bg-zinc-100 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase">Secret Key</div>
                  <div className="font-mono font-bold text-zinc-900 tracking-wider">
                    {user.twoFactorSecret}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="px-2.5 py-1 bg-white border border-zinc-300 rounded-lg font-semibold text-zinc-700 flex items-center gap-1"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-900 block">
                  Enter 6-Digit Code from App
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => {
                    setTotpCode(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center text-xl font-mono font-bold tracking-widest text-zinc-900 focus:outline-none focus:border-black"
                  autoFocus
                />
              </div>

              {errorMsg && <p className="text-xs font-bold text-rose-500">{errorMsg}</p>}

              <button
                type="submit"
                disabled={totpCode.length !== 6}
                className="w-full py-3.5 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-[0.99] text-zinc-950 font-bold text-sm rounded-xl border border-[#e2d9ca] transition shadow-2xs disabled:opacity-50"
              >
                Verify & Activate Authenticator
              </button>
            </form>
          )}

          {/* ================= SUB VIEW: SMS MFA SETUP ================= */}
          {activeSubView === 'sms' && (
            <form onSubmit={handleVerifySms} className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubView('main')}
                  className="text-xs font-bold text-zinc-500 hover:text-black"
                >
                  ← Back
                </button>
                <h4 className="text-sm font-black text-zinc-950">Setup SMS Two-Factor</h4>
              </div>

              {/* Real Incoming SMS notification banner */}
              {incomingSmsText && (
                <div
                  onClick={() => {
                    setSmsOtp(generatedSmsCode);
                    setErrorMsg('');
                  }}
                  className="p-3 bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] text-zinc-900 rounded-2xl shadow-xs border border-[#eee6d8] cursor-pointer active:scale-[0.99] transition flex items-center justify-between"
                  title="Tap to autofill received verification code"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      SMS
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        SharkPay Security Service
                      </div>
                      <div className="text-xs font-semibold text-zinc-900">
                        Code: <span className="font-mono font-bold text-emerald-700 tracking-wider">{generatedSmsCode}</span>
                        <span className="text-zinc-500 ml-1.5 text-[10px]">(Tap to paste)</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">just now</span>
                </div>
              )}

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900">
                SMS verification code sent to{' '}
                <strong className="font-mono">+91 {user.phone || '9096793517'}</strong>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900">
                    Enter 6-Digit SMS Verification Code
                  </label>
                  {smsCountdown > 0 ? (
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Resend in {smsCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendSms}
                      className="text-[11px] font-bold text-purple-700 hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  value={smsOtp}
                  onChange={(e) => {
                    setSmsOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center text-xl font-mono font-bold tracking-widest text-zinc-900 focus:outline-none focus:border-black"
                  autoFocus
                />

                <div className="flex justify-between items-center pt-1 px-1 text-[11px] text-zinc-500">
                  <span>Standard carrier SMS verification</span>
                  {generatedSmsCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setSmsOtp(generatedSmsCode);
                        setErrorMsg('');
                      }}
                      className="font-bold text-purple-700 hover:underline"
                    >
                      Paste Code ({generatedSmsCode})
                    </button>
                  )}
                </div>
              </div>

              {errorMsg && <p className="text-xs font-bold text-rose-500">{errorMsg}</p>}

              <button
                type="submit"
                disabled={smsOtp.length !== 6}
                className="w-full py-3.5 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-[0.99] text-zinc-950 font-bold text-sm rounded-xl border border-[#e2d9ca] transition shadow-2xs disabled:opacity-50"
              >
                Verify & Activate SMS MFA
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
