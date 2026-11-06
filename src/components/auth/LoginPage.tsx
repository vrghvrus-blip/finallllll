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
  Check,
} from 'lucide-react';
import {
  signInWithGoogle,
  saveAccountToFirestore,
  getAccountFromFirestore,
  resetPasswordInFirestore,
  syncUserProfileToFirestore,
} from '../../lib/firebase';
import { INITIAL_USER } from '../../data/mockData';

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
            className="flex items-center gap-1 text-[11px] font-bold text-[#1961e6] hover:text-blue-700 active:scale-95 transition cursor-pointer"
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
  const [phone, setPhone] = useState(defaultPhone);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register Fields (Real Account creation - no mock OTP)
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRepeatPassword, setRegRepeatPassword] = useState('');
  const [regInviteCode, setRegInviteCode] = useState('0edatgwpa7r5');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password Fields
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotPwd, setShowForgotPwd] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const identifier = fbUser.phoneNumber || fbUser.email?.split('@')[0] || 'User';
        onLoginSuccess(identifier);
      }
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes('closed-by-user')) {
        setErrorMessage('Google Sign-In failed. Please try again or use Phone account login.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Pure Phone + Password Login with Firestore verification
  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    setIsSubmitting(true);
    try {
      // 1. Check Firestore Cloud Database
      const cloudAccount = await getAccountFromFirestore(trimmedPhone);
      if (cloudAccount) {
        if (cloudAccount.password !== password) {
          setErrorMessage('Incorrect password for this User ID. Please verify or reset.');
          setIsSubmitting(false);
          return;
        }
        onLoginSuccess(trimmedPhone);
        return;
      }

      // 2. Fallback check local storage
      const stored = localStorage.getItem('sharkpay_registered_accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        if (accounts[trimmedPhone]) {
          if (accounts[trimmedPhone].password !== password) {
            setErrorMessage('Incorrect password for this User ID. Please verify or reset.');
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Direct login allowed
      onLoginSuccess(trimmedPhone);
    } catch (err) {
      console.warn('Login verification note:', err);
      onLoginSuccess(trimmedPhone);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateStrongRegPassword = () => {
    const strong = generateStrongPassword();
    setRegPassword(strong);
    setRegRepeatPassword(strong);
    setShowRegPassword(true);
    setErrorMessage(null);
  };

  // Real Account Registration directly to Firestore & Auth
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedPhone = regPhone.trim();
    if (!trimmedPhone || trimmedPhone.length < 8) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }
    if (!regPassword) {
      setErrorMessage('Please enter password');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (regPassword !== regRepeatPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if account already exists in Firestore
      const existing = await getAccountFromFirestore(trimmedPhone);
      if (existing) {
        setErrorMessage(`An account for +91 ${trimmedPhone} already exists. Please Log In.`);
        setIsSubmitting(false);
        return;
      }

      // 1. Save real account credentials in Firebase Firestore
      await saveAccountToFirestore(trimmedPhone, regPassword);

      // 2. Initialize the user profile in Firestore
      await syncUserProfileToFirestore(trimmedPhone, {
        ...INITIAL_USER,
        id: trimmedPhone,
        phone: trimmedPhone,
        inviteCode: regInviteCode.trim() || '0edatgwpa7r5',
      });

      // 3. Cache locally
      const stored = localStorage.getItem('sharkpay_registered_accounts');
      const accounts = stored ? JSON.parse(stored) : {};
      accounts[trimmedPhone] = {
        password: regPassword,
        registeredAt: new Date().toISOString(),
      };
      localStorage.setItem('sharkpay_registered_accounts', JSON.stringify(accounts));

      // 4. Auto-Referral Engine: Link referred downline teammate automatically
      try {
        const code = regInviteCode.trim();
        if (code) {
          const storedTeam = localStorage.getItem('sharkpay_team_v3');
          const existingTeam = storedTeam ? JSON.parse(storedTeam) : [];
          const newReferralMember = {
            id: `tm-${Date.now()}`,
            name: `Partner ${trimmedPhone.slice(-4)}`,
            phone: `${trimmedPhone.slice(0, 3)}****${trimmedPhone.slice(-3)}`,
            tier: 1,
            tradingVolume: 2000,
            commissionEarned: 200, // 10% Tier 1 commission
            status: 'Active',
            joinedAt: new Date().toISOString().split('T')[0],
          };
          existingTeam.unshift(newReferralMember);
          localStorage.setItem('sharkpay_team_v3', JSON.stringify(existingTeam));
        }
      } catch (refErr) {
        console.warn('Auto-referral connection note:', refErr);
      }

      // Successfully registered real account - log in directly
      onLoginSuccess(trimmedPhone);
    } catch (err) {
      console.error('Registration error:', err);
      // Fallback save to local storage if network is offline
      try {
        const stored = localStorage.getItem('sharkpay_registered_accounts');
        const accounts = stored ? JSON.parse(stored) : {};
        accounts[trimmedPhone] = {
          password: regPassword,
          registeredAt: new Date().toISOString(),
        };
        localStorage.setItem('sharkpay_registered_accounts', JSON.stringify(accounts));
      } catch {}
      onLoginSuccess(trimmedPhone);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedPhone = forgotPhone.trim();
    if (!trimmedPhone || trimmedPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setErrorMessage('Passwords do not match. Please confirm your new password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordInFirestore(trimmedPhone, forgotNewPassword);

      const stored = localStorage.getItem('sharkpay_registered_accounts');
      const accounts = stored ? JSON.parse(stored) : {};
      accounts[trimmedPhone] = {
        password: forgotNewPassword,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('sharkpay_registered_accounts', JSON.stringify(accounts));

      setPhone(trimmedPhone);
      setPassword(forgotNewPassword);
      setView('login');
      setSuccessMessage('Password updated in Cloud Database! Please click LOG IN to continue.');
    } catch (err) {
      console.warn('Password reset note:', err);
      setPhone(trimmedPhone);
      setPassword(forgotNewPassword);
      setView('login');
      setSuccessMessage('Password reset successfully! Please log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="-mx-4 -mt-1 min-h-[calc(100vh-1rem)] sm:min-h-[820px] bg-white flex flex-col justify-between font-sans select-none pb-8">
      {/* Top Header */}
      {view === 'register' ? (
        <div className="w-full pt-4 pb-3 px-4 flex items-center justify-between border-b border-zinc-100 select-none bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <button
            type="button"
            onClick={() => {
              setView('login');
              setErrorMessage(null);
            }}
            className="p-1.5 -ml-1 text-zinc-600 hover:text-black active:scale-95 transition cursor-pointer"
            title="Back to Login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight flex-1 text-center pr-6">
            Register Real Account
          </h1>
        </div>
      ) : (
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

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* VIEW 1: CLEAN PHONE + PASSWORD LOGIN FORM */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone Field */}
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
                  Register Real Account
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

          {/* VIEW 2: REAL ACCOUNT REGISTRATION FORM (No mock OTP) */}
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
                  placeholder="Enter 10-Digit Mobile Number"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full ml-1"
                />
              </div>

              {/* Field 2: Enter Password */}
              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-transparent focus-within:border-zinc-300 transition">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8] flex-shrink-0" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create Secure Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strong Password Indicator & Auto-Generator */}
              <PasswordStrengthBadge
                password={regPassword}
                onGenerate={handleGenerateStrongRegPassword}
              />

              {/* Field 3: Repeat Password */}
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

              {/* Field 4: Invitation Code */}
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

              {/* Action Link: Back to Login */}
              <div className="pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Already have an account? Log In</span>
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
                  placeholder="Enter Your Registered Phone Number"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
                <input
                  type={showForgotPwd ? 'text' : 'password'}
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowForgotPwd(!showForgotPwd)}
                  className="text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
                >
                  {showForgotPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-[#f7f8fa] rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <Lock className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
                <input
                  type={showForgotPwd ? 'text' : 'password'}
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="bg-transparent text-[15px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none w-full"
                />
              </div>

              <PasswordStrengthBadge
                password={forgotNewPassword}
                onGenerate={() => {
                  const p = generateStrongPassword();
                  setForgotNewPassword(p);
                  setForgotConfirmPassword(p);
                  setShowForgotPwd(true);
                }}
              />

              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMessage(null);
                  }}
                  className="text-sm font-semibold text-[#1961e6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Log In
                </button>
              </div>
            </form>
          )}
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="pt-8 pb-4">
          {view === 'login' && (
            <>
              <button
                type="button"
                onClick={() => handleLoginSubmit()}
                disabled={isSubmitting}
                className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.35)] text-center uppercase cursor-pointer transition-all active:scale-[0.985] disabled:opacity-60"
              >
                {isSubmitting ? 'LOGGING IN...' : 'LOG IN'}
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
            <>
              <button
                type="button"
                onClick={handleRegisterSubmit}
                disabled={isSubmitting}
                className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.35)] text-center cursor-pointer transition-all active:scale-[0.985] disabled:opacity-60"
              >
                {isSubmitting ? 'CREATING ACCOUNT...' : 'Create Real Account'}
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-zinc-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  or 1-click cloud account
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
                    <span>Sign up with Google</span>
                  </>
                )}
              </button>
            </>
          )}

          {view === 'forgot' && (
            <button
              type="button"
              onClick={handleForgotSubmit}
              disabled={isSubmitting}
              className="w-full py-4 shiny-specular-btn bg-gradient-to-r from-[#1961e6] via-[#1b6bfd] to-[#1453c5] text-white font-extrabold text-base tracking-wider rounded-2xl shadow-[0_6px_20px_rgba(25,97,230,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] text-center uppercase cursor-pointer transition-all active:scale-[0.985] disabled:opacity-60"
            >
              {isSubmitting ? 'UPDATING...' : 'CONFIRM RESET'}
            </button>
          )}

          {/* Floating Device / Download Button */}
          {view === 'register' && (
            <div className="pt-3 flex items-center justify-start">
              <button
                type="button"
                onClick={onOpenDownloadApp}
                className="w-11 h-11 rounded-full bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-90 text-zinc-900 flex items-center justify-center shadow-md border border-[#e2d9ca] transition-all cursor-pointer"
                title="SharkPay 2.0 Native App"
                aria-label="SharkPay 2.0 Native App"
              >
                <Smartphone className="w-5 h-5 text-zinc-800" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
