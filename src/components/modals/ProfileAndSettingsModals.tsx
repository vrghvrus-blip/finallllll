import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  MessageCircle,
  Send,
  Phone,
  CheckCircle2,
  Globe,
  Share2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { UserProfile } from '../../types/rswallet';
import { verifyTotpCode } from '../../utils/totp';

/* --- Google Authenticator Modal --- */
interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  secret: string;
  onToggleAuth: (enable: boolean) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  isEnabled,
  secret,
  onToggleAuth,
}) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const otpAuthUrl = `otpauth://totp/SharkPay:Member?secret=${secret}&issuer=SharkPay`;
    QRCode.toDataURL(otpAuthUrl, { width: 160, margin: 1 })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [isOpen, secret]);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    const isValid = await verifyTotpCode(secret, code);
    if (!isValid) {
      setError('Invalid authenticator code. Check your Google Authenticator app and try again.');
      return;
    }
    onToggleAuth(!isEnabled);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">Google Authenticator</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-700">
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-zinc-900 text-sm">2-Step Verification</div>
              <div className="text-zinc-500 text-[11px] mt-0.5">
                {isEnabled ? 'Protection active' : 'Enhance withdrawal security'}
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {!isEnabled && (
            <div className="space-y-3">
              <p className="text-zinc-600 leading-relaxed">
                Scan the QR code with Google Authenticator or enter the secret key manually:
              </p>

              <div className="flex justify-center p-2 bg-white border border-zinc-200 rounded-xl">
                {qrUrl ? (
                  <img src={qrUrl} alt="Google Auth QR" className="w-36 h-36" />
                ) : (
                  <div className="w-36 h-36 bg-zinc-100 animate-pulse rounded"></div>
                )}
              </div>

              <div className="bg-zinc-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase">Secret Key</div>
                  <div className="font-mono font-bold text-zinc-900 tracking-wider text-xs">
                    {secret}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopySecret}
                  className="px-2.5 py-1 bg-white border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-700 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1 pt-1">
                <label className="font-bold text-zinc-900">Enter 6-Digit Google Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center text-lg font-mono font-bold tracking-widest text-zinc-900 focus:outline-none focus:border-black"
                />
              </div>

              {error && <p className="text-rose-500 font-semibold">{error}</p>}
            </div>
          )}

          <button
            type="button"
            onClick={isEnabled ? () => onToggleAuth(false) : handleVerify}
            className={`w-full py-3.5 font-bold text-sm rounded-xl transition active:scale-95 shadow-sm ${
              isEnabled
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                : 'bg-black text-white hover:bg-zinc-800'
            }`}
          >
            {isEnabled ? 'Disable Google Authenticator' : 'Verify & Enable'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Contact Us Modal --- */
interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const [ticketMsg, setTicketMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMsg) return;
    setSubmitted(true);
    setTimeout(() => {
      setTicketMsg('');
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-950">Customer Service</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-zinc-700">
          {/* Quick Channels */}
          <div className="space-y-2.5">
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0088cc]/10 border border-[#0088cc]/20 rounded-xl p-3.5 flex items-center justify-between text-[#0088cc] hover:bg-[#0088cc]/15 transition"
            >
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5" />
                <div>
                  <div className="font-bold text-sm text-zinc-900">Telegram Official Support</div>
                  <div className="text-[11px] text-zinc-500">24/7 Agent response: @SharkPayCare</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-[#0088cc] text-white px-3 py-1 rounded-lg">
                Connect
              </span>
            </a>

            <a
              href="https://wa.me/13236214940"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-3.5 flex items-center justify-between text-[#25D366] hover:bg-[#25D366]/15 transition"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-zinc-900">WhatsApp Support Team</div>
                  <div className="text-[11px] text-zinc-500 font-mono font-medium">+1 3236214940 Priority Channel</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-[#25D366] text-white px-3.5 py-1.5 rounded-lg active:scale-95 transition">
                Chat
              </span>
            </a>
          </div>

          {/* In-app fast ticket */}
          <form onSubmit={handleSendTicket} className="space-y-2 pt-2 border-t border-zinc-100">
            <label className="font-bold text-zinc-900 block text-xs">
              Send Instant Service Ticket
            </label>
            <textarea
              rows={3}
              placeholder="Describe your deposit, UPI settlement, or withdrawal query..."
              value={ticketMsg}
              onChange={(e) => setTicketMsg(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-black"
            />
            {submitted ? (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ticket dispatched to SharkPay Support team!</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!ticketMsg}
                className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-zinc-800 transition active:scale-95 disabled:opacity-50"
              >
                Submit Ticket
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

/* --- Languages Modal --- */
interface LanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const LanguagesModal: React.FC<LanguagesModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-zinc-900" />
            <h3 className="text-base font-black text-zinc-950">Select Language</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                onSelectLanguage(l.name);
                onClose();
              }}
              className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition ${
                currentLanguage === l.name
                  ? 'border-black bg-zinc-900 text-white font-bold'
                  : 'border-zinc-100 bg-white text-zinc-800 hover:border-zinc-200'
              }`}
            >
              <div>
                <div className="text-sm">{l.name}</div>
                <div className="text-[11px] opacity-75">{l.native}</div>
              </div>
              {currentLanguage === l.name && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* --- Edit Profile Modal --- */
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phone);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nickname, phone });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-950">Edit Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-zinc-900 text-white flex items-center justify-center text-3xl font-black shadow-md border-4 border-zinc-100">
              {nickname.slice(0, 1).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Account ID</label>
            <input
              type="text"
              disabled
              value={user.id}
              className="w-full bg-zinc-100 border border-zinc-200 rounded-xl p-3 text-xs font-semibold text-zinc-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Display Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">Mobile Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition active:scale-95 shadow-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

/* --- Share Invite Poster Modal --- */
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  inviteUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  inviteCode,
  inviteUrl,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(inviteUrl, { width: 180, margin: 1 })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [isOpen, inviteUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-base font-black text-zinc-950">Invitation Poster</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="bg-gradient-to-br from-zinc-900 via-neutral-900 to-black text-white rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              <span>🦈</span>
              <span>SharkPay Partner</span>
            </h4>
            <p className="text-xs text-zinc-300">
              Join my settlement team and earn 3.5% daily yields + 10% team commission!
            </p>

            <div className="w-44 h-44 bg-white rounded-xl mx-auto p-2 flex items-center justify-center shadow-md">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="Invite QR" className="w-40 h-40" />
              ) : (
                <div className="w-40 h-40 bg-zinc-100 animate-pulse rounded"></div>
              )}
            </div>

            <div className="bg-white/10 rounded-xl p-2.5">
              <span className="text-[10px] uppercase text-zinc-400 font-bold block">
                Exclusive Invite Code
              </span>
              <span className="text-lg font-mono font-black text-amber-300 tracking-wider">
                {inviteCode}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition active:scale-95 shadow-sm flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Invitation Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
