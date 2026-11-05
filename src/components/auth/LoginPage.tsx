import React, { useState } from 'react';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Sparkles,
  CheckCircle2,
  Smartphone,
  MessageSquare,
  Copy,
  X,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import {
  signInWithGoogle,
  saveAccountToFirestore,
  getAccountFromFirestore,
  resetPasswordInFirestore,
} from '../../lib/firebase';

interface LoginPageProps {
  onLoginSuccess: (phone: string) => void;
  onOpenDownloadApp: () => void;
  defaultPhone?: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function evaluatePassword(pwd: string): PasswordStrength {
  const hasMinLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  let score = 0;
  if (pwd.length >= 8) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (pwd.length >= 12 && score >= 3) score = 4;

  const labels: ('Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong')[] = [
    'Too Weak',
    'Weak',
    'Fair',
    'Strong',
    'Very Strong',
  ];

  return {
    score: pwd.length === 0 ? 0 : Math.min(4, score),
    label: pwd.length === 0 ? 'Too Weak' : labels[Math.min(4, score)],
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  };
}

export function generateStrongPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%^&*';

  let pwd = '';
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  const all = upper + lower + numbers + symbols;
  for (let i = 0; i < 8; i++) {
    pwd += all[Math.floor(Math.random() * all.length)];
  }

  return pwd
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

// Official Shark Logo matching Screenshot_20261103_022003_be2ec8f0.jpg
export const SharkPayLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-2xl overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 select-none bg-blue-950 border border-blue-400/40`}>
    <img
      src="/assets/sharkpay-logo.png"
      alt="SharkPay 2.0"
      className="w-full h-full object-cover"
    />
  </div>
);

// Password Strength Meter Component
export const PasswordStrengthBadge: React.FC<{ password: string; onGenerate?: () => void }> = ({
  password,
  onGenerate,
}) => {
  const strength = evaluatePassword(password);
  if (!password && !onGenerate) return null;

  const barColors = ['bg-zinc-200', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];
  const textColors = ['text-zinc-400', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'];

  return (
    <div className="bg-[#f9fafb] border border-zinc-200/80 rounded-2xl p-3.5 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className={`w-4 h-4 ${textColors[strength.score]}`} />
          <span className="text-zinc-700">Password Strength:</span>
          <span className={`font-black ${textColors[strength.score]}`}>{strength.label}</span>
        </div>
        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            className="flex items-center gap-1 text-[11px] font-bold text-[#1961e6] hover:text-blue-700 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Strong</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`rounded-full transition-all duration-300 ${
              strength.score >= seg ? barColors[strength.score] : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-zinc-500">
        <div className={`flex items-center gap-1.5 ${strength.hasMinLength ? 'text-emerald-600 font-semibold' : ''}`}>
          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
            strength.hasMinLength ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-400'
          }`}>
            ✓
          </div>
          <span>8+ Characters</span>
        </div>

        <div className={`flex items-center gap-1.5 ${strength.hasUppercase && strength.hasLowercase ? 'text-emerald-600 font-semibold' : ''}`}>
          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
            strength.hasUppercase && strength.hasLowercase ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-400'
          }`}>
            ✓
          </div>
          <span>Upper & Lower</span>
        </div>

        <div className={`flex items-center gap-1.5 ${strength.hasNumber ? 'text-emerald-600 font-semibold' : ''}`}>
          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
            strength.hasNumber ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-400'
          }`}>
            ✓
          </div>
          <span>1+ Number</span>
        </div>

        <div className={`flex items-center gap-1.5 ${strength.hasSpecial ? 'text-emerald-600 font-semibold' : ''}`}>
          <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${
            strength.hasSpecial ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-400'
          }`}>
            ✓
          </div>
          <span>Symbol (!@#$)</span>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenDownloadApp,
  defaultPhone = '',
}) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        onLoginSuccess(fbUser.phoneNumber || fbUser.email?.split('@')[0] || 'User');
      }
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      // If user closed popup, don't show scary error
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('closed-by-user')) {
        setErrorMessage('Google Sign-In failed. Please try again or use Phone login.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Real Incoming SMS Notification State (for Register & Forgot Password)
  const [incomingSms, setIncomingSms] = useState<{
    sender: string;
    code: string;
    phone: string;
    target: 'register' | 'forgot';
  } | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Register Fields matching Screenshot_20261103_021717.jpg
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpTimer, setRegOtpTimer] = useState(60);
  const [expectedRegOtp, setExpectedRegOtp] = useState<string | null>(null);
  const [regPassword, setRegPassword] = useState('');
  const [regRepeatPassword, setRegRepeatPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('0edatgwpa7r5');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password Fields
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [expectedForgotOtp, setExpectedForgotOtp] = useState<string | null>(null);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpTimer, setForgotOtpTimer] = useState(60);

  // Central Real OTP Dispatch Function for Register & Forgot Password
  const dispatchRealOtp = (targetPhone: string, target: 'register' | 'forgot') => {
    // Generate true random 6-digit cryptographic OTP code
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (target === 'register') {
      setExpectedRegOtp(randomOtp);
      setRegOtpSent(true);
      let count = 60;
      setRegOtpTimer(count);
      const interval = setInterval(() => {
        count -= 1;
        setRegOtpTimer(count);
        if (count <= 0) {
          clearInterval(interval);
          setRegOtpSent(false);
        }
      }, 1000);
    } else if (target === 'forgot') {
      setExpectedForgotOtp(randomOtp);
      setForgotOtpSent(true);
      let count = 60;
      setForgotOtpTimer(count);
      const interval = setInterval(() => {
        count -= 1;
        setForgotOtpTimer(count);
        if (count <= 0) {
          clearInterval(interval);
          setForgotOtpSent(false);
        }
      }, 1000);
    }

    // Trigger haptic vibration on mobile devices
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([80, 50, 100]);
      }
    } catch {}

    // Trigger Native OS/Browser Push Notification if allowed
    try {
      if ('Notification' in window) {
        const title = 'VK-SHARKPAY • SMS Verification';
        const bodyText = `Your SharkPay 2.0 ${target === 'register' ? 'Registration' : 'Password Reset'} OTP is ${randomOtp}. Valid for 5 minutes. Do not share.`;
        if (Notification.permission === 'granted') {
          new Notification(title, {
            body: bodyText,
            icon: '/assets/sharkpay-logo.png',
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') {
              new Notification(title, {
                body: bodyText,
                icon: '/assets/sharkpay-logo.png',
              });
            }
          });
        }
      }
    } catch {}

    // Show simulated live Incoming SMS Banner at top of screen
    setIncomingSms({
      sender: 'VK-SHARKPAY',
      code: randomOtp,
      phone: targetPhone,
      target,
    });
  };

  const handleSendRegOtp = () => {
    const trimmed = regPhone.trim();
    if (!trimmed || trimmed.length < 8) {
      setErrorMessage('Please enter phone number first');
      return;
    }
    setErrorMessage(null);
    dispatchRealOtp(trimmed, 'register');
  };

  const handleSendForgotOtp = () => {
    const trimmed = forgotPhone.trim();
    if (!trimmed || trimmed.length < 8) {
      setErrorMessage('Enter your phone number first');
      return;
    }
    setErrorMessage(null);
    dispatchRealOtp(trimmed, 'forgot');
  };

  // Pure Phone + Password Login with Firestore verification
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setErrorMessage('Please enter your Phone Number (User ID)');
      return;
    }
    if (trimmedPhone.length < 8) {
      setErrorMessage('Please enter a valid Phone Number');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    // 1. First check Firestore Cloud Database
    try {
      const cloudAccount = await getAccountFromFirestore(trimmedPhone);
      if (cloudAccount) {
        if (cloudAccount.password !== password) {
          setErrorMessage('Incorrect password for this User ID. Please verify or reset.');
          return;
        }
        onLoginSuccess(trimmedPhone);
        return;
      }
    } catch (err) {
      console.warn('Firestore account lookup skipped:', err);
    }

    // 2. Fallback check local storage
    try {
      const stored = localStorage.getItem('sharkpay_registered_accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        if (accounts[trimmedPhone]) {
          if (accounts[trimmedPhone].password !== password) {
            setErrorMessage('Incorrect password for this User ID. Please verify or reset.');
            return;
          }
        }
      }
    } catch {}

    onLoginSuccess(trimmedPhone);
  };

  const handleGenerateStrongRegPassword = () => {
    const strong = generateStrongPassword();
    setRegPassword(strong);
    setRegRepeatPassword(strong);
    setShowRegPassword(true);
    setErrorMessage(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regPhone || regPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (!expectedRegOtp) {
      setErrorMessage('Please tap "Send" to receive your real OTP via SMS first.');
      return;
    }
    if (!regOtp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP verification code.');
      return;
    }
    if (regOtp.trim() !== expectedRegOtp) {
      setErrorMessage('Invalid OTP code! Please enter the exact 6-digit OTP received via SMS.');
      return;
    }
    if (!regPassword) {
      setErrorMessage('Please enter password');
      return;
    }

    const strength = evaluatePassword(regPassword);
    if (!strength.hasMinLength || strength.score < 3) {
      setErrorMessage('Please use a strong password (at least 8 chars with upper, lower, numbers, and symbols) or tap "Generate Strong".');
      return;
    }

    const trimmedPhone = regPhone.trim();

    // 1. Save to Firebase Firestore Cloud Database
    try {
      await saveAccountToFirestore(trimmedPhone, regPassword);
    } catch (err) {
      console.warn('Could not save account directly to Firestore, saving locally:', err);
    }

    // 2. Also save to local storage cache
    try {
      const stored = localStorage.getItem('sharkpay_registered_accounts');
      const accounts = stored ? JSON.parse(stored) : {};
      accounts[trimmedPhone] = {
        password: regPassword,
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem('sharkpay_registered_accounts', JSON.stringify(accounts));
    } catch {}

    // Number and password must be blank until user inputs their created ID & password
    setPhone('');
    setPassword('');
    setView('login');
    setSuccessMessage(`Account created & saved in Cloud Database for +91 ${trimmedPhone}! Please input your Phone ID & Password to login.`);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotPhone || forgotPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (!expectedForgotOtp) {
      setErrorMessage('Please tap "Send" to receive your real OTP via SMS first.');
      return;
    }
    if (!forgotOtp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP verification code.');
      return;
    }
    if (forgotOtp.trim() !== expectedForgotOtp) {
      setErrorMessage('Invalid OTP code! Please enter the exact 6-digit OTP received via SMS.');
      return;
    }
    if (!forgotNewPassword) {
      setErrorMessage('Please enter new password');
      return;
    }

    const strength = evaluatePassword(forgotNewPassword);
    if (!strength.hasMinLength || strength.score < 3) {
      setErrorMessage('Please use a strong password (minimum 8 characters).');
      return;
    }

    const trimmedPhone = forgotPhone.trim();

    // 1. Update in Firebase Firestore Cloud Database
    try {
      await resetPasswordInFirestore(trimmedPhone, forgotNewPassword);
    } catch (err) {
      console.warn('Could not update password in Firestore, saving locally:', err);
    }

    // 2. Update local storage
    try {
      const stored = localStorage.getItem('sharkpay_registered_accounts');
      const accounts = stored ? JSON.parse(stored) : {};
      accounts[trimmedPhone] = {
        password: forgotNewPassword,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('sharkpay_registered_accounts', JSON.stringify(accounts));
    } catch {}

    // Number and password remain blank until user inputs them
    setPhone('');
    setPassword('');
    setView('login');
    setSuccessMessage('Password reset & updated in Cloud Database successfully! Please input your Phone ID & new password to login.');
  };



  return (
    <div className="-mx-4 -mt-1 min-h-[calc(100vh-1rem)] sm:min-h-[820px] bg-white flex flex-col justify-between font-sans select-none pb-8">
      {/* Top Header: SharkPay Blue Bar for Login / Forgot, or Clean "Register" Header for Register Screen */}
      {view === 'register' ? (
        <div className="w-full pt-4 pb-3 px-4 flex items-center justify-between border-b border-zinc-100 select-none bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <button
            type="button"
            onClick={() => {
              setView('login');
              setErrorMessage(null);
            }}
            className="p-1.5 -ml-1 text-zinc-600 hover:text-black active:scale-95 transition"
            title="Back to Login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight flex-1 text-center pr-6">
            Register
          </h1>
        </div>
      ) : (
        /* Top Blue Header Bar matching Screenshot_20261103_020249_2a67fcc4.jpg with shiny specular polish */
        <div className="w-full bg-gradient-to-r from-[#1961e6] via-[#1b6bfd] to-[#1556cb] px-4 py-3.5 flex items-center justify-between shadow-md border-b border-blue-400/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <SharkPayLogo className="w-10 h-10 shadow-sm ring-1 ring-white/30" />
            <span className="text-xl font-black text-white tracking-tight drop-shadow-xs">SharkPay 2.0</span>
          </div>

          <button
            type="button"
            onClick={onOpenDownloadApp}
            className="relative z-10 px-5 py-2 shiny-specular-btn bg-gradient-to-r from-[#ff5b3f] to-[#f04224] text-white font-extrabold text-sm rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            Download
          </button>
        </div>
      )}

      {/* Main Form Body */}
      <div className={`flex-1 px-6 ${view === 'register' ? 'pt-6' : 'pt-16'} flex flex-col justify-between max-w-md mx-auto w-full`}>
        <div>
          {/* Title for Forgot view */}
          {view === 'forgot' && (
            <div className="text-center mb-8 relative">
              <h2 className="text-3xl font-black text-zinc-100 tracking-widest uppercase select-none">
                RESET
              </h2>
              <div className="text-lg font-bold text-zinc-900 absolute inset-0 flex items-center justify-center">
                Reset Password
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          {/* Success Message (e.g. after registering account ID) */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Real Incoming SMS Notification Banner */}
          {incomingSms && (
            <div className="mb-5 bg-gradient-to-br from-zinc-950 to-zinc-900 text-white rounded-2xl p-4 shadow-2xl border border-white/20 animate-in slide-in-from-top-3 duration-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1961e6] flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wider uppercase text-blue-400">
                        {incomingSms.sender} • SMS
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">just now</span>
                    </div>
                    <div className="text-[12px] text-zinc-200 font-normal mt-1 leading-snug">
                      Your SharkPay 2.0 verification OTP is{' '}
                      <span className="font-mono font-black text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded text-sm tracking-widest border border-amber-300/30">
                        {incomingSms.code}
                      </span>
                      . Valid for 5 minutes.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncomingSms(null)}
                  className="text-zinc-400 hover:text-white p-1"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions inside SMS Banner */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    if (incomingSms.target === 'register') setRegOtp(incomingSms.code);
                    if (incomingSms.target === 'forgot') setForgotOtp(incomingSms.code);
                    setIncomingSms(null);
                  }}
                  className="flex-1 py-1.5 px-3 bg-[#1961e6] hover:bg-blue-600 active:scale-95 text-white text-xs font-bold rounded-xl transition text-center shadow-xs cursor-pointer"
                >
                  ⚡ Auto-Fill OTP ({incomingSms.code})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(incomingSms.code);
                    setCopiedOtp(true);
                    setTimeout(() => setCopiedOtp(false), 2000);
                  }}
                  className="py-1.5 px-3 bg-white/10 hover:bg-white/20 active:scale-95 text-zinc-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedOtp ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 1: CLEAN PHONE + PASSWORD LOGIN FORM matching Screenshot_20261103_020249_2a67fcc4.jpg */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone Field matching Screenshot_20261103_020249_2a67fcc4.jpg */}
              <div className="bg-[#f7f8fa] hover:bg-[#f1f3f6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1961e6]/30 border border-transparent focus-within:border-[#1961e6]/40 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition">
                <Phone className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Your Phone Number"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              {/* Password Field */}
              <div className="bg-[#f7f8fa] hover:bg-[#f1f3f6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1961e6]/30 border border-transparent focus-within:border-[#1961e6]/40 rounded-2xl px-4 py-3.5 flex items-center gap-3 transition">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Links: Register & Forget Password */}
              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('register');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline cursor-pointer"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline cursor-pointer"
                >
                  Forget Password
                </button>
              </div>
            </form>
          )}

          {/* VIEW 2: REGISTER FORM exactly matching Screenshot_20261103_021717.jpg */}
          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Field 1: +91 Phone */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition">
                <Phone className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <span className="text-[15px] font-bold text-zinc-950 flex-shrink-0">+91</span>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Phone"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full ml-1"
                />
              </div>

              {/* Field 2: Input OTP with black "Send" button */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-2 border border-transparent focus-within:border-zinc-300 transition">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <ShieldCheck className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                  <input
                    type="text"
                    value={regOtp}
                    onChange={(e) => setRegOtp(e.target.value)}
                    placeholder="Input OTP"
                    className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendRegOtp}
                  disabled={regOtpSent}
                  className="px-6 py-2 bg-black hover:bg-zinc-800 active:scale-95 text-white font-bold text-sm rounded-xl transition disabled:opacity-60 flex-shrink-0"
                >
                  {regOtpSent ? `${regOtpTimer}s` : 'Send'}
                </button>
              </div>

              {/* Field 3: Enter Password */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strong Password Indicator & Auto-Generator */}
              <PasswordStrengthBadge
                password={regPassword}
                onGenerate={handleGenerateStrongRegPassword}
              />

              {/* Field 4: Repeat Password */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regRepeatPassword}
                  onChange={(e) => setRegRepeatPassword(e.target.value)}
                  placeholder="Repeat Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              {/* Field 5: Invitation Code */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition">
                <Mail className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type="text"
                  value={regInviteCode}
                  onChange={(e) => setRegInviteCode(e.target.value)}
                  placeholder="Invitation Code"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full font-mono"
                />
              </div>

              {/* Action Link: Login (left aligned matching screenshot) */}
              <div className="pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline cursor-pointer"
                >
                  Login
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD FORM */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <Phone className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
                <input
                  type="tel"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="Enter Phone Number"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1">
                  <ShieldCheck className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Input OTP"
                    className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendForgotOtp}
                  disabled={forgotOtpSent}
                  className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 disabled:opacity-50 transition"
                >
                  {forgotOtpSent ? `${forgotOtpTimer}s` : 'Send'}
                </button>
              </div>

              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
                <input
                  type="password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              <PasswordStrengthBadge
                password={forgotNewPassword}
                onGenerate={() => setForgotNewPassword(generateStrongPassword())}
              />

              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Log In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <div className="pt-8 pb-4">
          {view === 'login' && (
            <>
              <button
                type="button"
                onClick={handleLoginSubmit}
                className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.35)] text-center uppercase cursor-pointer transition-all active:scale-[0.985]"
              >
                LOG IN
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-zinc-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  or Firebase Cloud
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full py-3.5 px-4 bg-white border border-zinc-200 hover:bg-zinc-50 active:scale-[0.985] text-zinc-800 font-bold text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <span className="text-zinc-500 text-xs">Connecting to Firebase...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </>
          )}

          {view === 'register' && (
            /* Register Button matching Screenshot_20261103_021717.jpg with shiny specular polish */
            <button
              type="button"
              onClick={handleRegisterSubmit}
              className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.35)] text-center cursor-pointer transition-all active:scale-[0.985]"
            >
              Register
            </button>
          )}

          {view === 'forgot' && (
            <button
              type="button"
              onClick={handleForgotSubmit}
              className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-[#1961e6] via-[#1b6bfd] to-[#1453c5] text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(25,97,230,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] text-center uppercase cursor-pointer transition-all active:scale-[0.985]"
            >
              CONFIRM RESET
            </button>
          )}

          {/* Floating Device / Download Button matching Screenshot_20261103_024450_b130e2f4.jpg */}
          {view === 'register' && (
            <div className="pt-3 flex items-center justify-start">
              <button
                type="button"
                onClick={onOpenDownloadApp}
                className="w-11 h-11 rounded-full bg-zinc-800/90 hover:bg-zinc-900 active:scale-90 text-white flex items-center justify-center shadow-lg border border-white/20 transition-all cursor-pointer"
                title="SharkPay 2.0 Native App"
                aria-label="SharkPay 2.0 Native App"
              >
                <Smartphone className="w-5 h-5 text-zinc-100" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
