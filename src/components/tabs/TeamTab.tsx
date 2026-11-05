import React, { useState } from 'react';
import { Copy, Check, User, ChevronRight, X } from 'lucide-react';
import { UserProfile, TeamMember } from '../../types/rswallet';

interface TeamTabProps {
  user: UserProfile;
  teamMembers?: TeamMember[];
  onAddTeammate?: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  onShowShareModal?: () => void;
}

// Glowing Teal Neural Orb Avatar matching the exact avatar shown in Screenshot_20261103_012840
export const TeamAvatar: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <div className={`${className} rounded-full overflow-hidden flex-shrink-0 bg-[#06151c] relative shadow-2xs`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="tealOrbGlow" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#0d9488" stopOpacity="0.5" />
          <stop offset="75%" stopColor="#042f2e" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#021417" stopOpacity="0" />
        </radialGradient>
        <filter id="tealGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Deep cosmic teal base */}
      <circle cx="50" cy="50" r="48" fill="#04171d" />
      <circle cx="50" cy="50" r="48" fill="url(#tealOrbGlow)" />

      {/* Abstract undulating wave strands */}
      <path
        d="M 12 62 Q 38 46, 88 56"
        stroke="#2dd4bf"
        strokeWidth="2.4"
        fill="none"
        opacity="0.85"
        filter="url(#tealGlow)"
      />
      <path
        d="M 18 42 Q 52 64, 82 36"
        stroke="#14b8a6"
        strokeWidth="2"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M 22 74 Q 58 68, 76 80"
        stroke="#0f766e"
        strokeWidth="1.6"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M 24 26 Q 54 16, 76 30"
        stroke="#5eead4"
        strokeWidth="1.6"
        fill="none"
        opacity="0.7"
      />

      {/* Glowing network particle dots */}
      <circle cx="34" cy="50" r="3.2" fill="#ffffff" filter="url(#tealGlow)" />
      <circle cx="54" cy="54" r="3.4" fill="#a7f3d0" filter="url(#tealGlow)" />
      <circle cx="70" cy="40" r="2.8" fill="#5eead4" filter="url(#tealGlow)" />
      <circle cx="82" cy="54" r="3" fill="#ffffff" filter="url(#tealGlow)" />
      <circle cx="28" cy="38" r="2" fill="#2dd4bf" />
      <circle cx="76" cy="64" r="2.2" fill="#2dd4bf" />
      <circle cx="46" cy="34" r="2.2" fill="#99f6e4" />
      <circle cx="62" cy="70" r="2.2" fill="#14b8a6" />
      <circle cx="20" cy="62" r="2.5" fill="#5eead4" />
      <circle cx="42" cy="66" r="2.2" fill="#2dd4bf" />
    </svg>
  </div>
);

export const TeamTab: React.FC<TeamTabProps> = ({
  user,
  teamMembers = [],
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Invite URL matching the screenshot format
  const inviteCode = user.inviteCode || '0edatgwpa7r5';
  const fullInviteUrl = `https://app-web.sharkpay-app.com/regist?code=${inviteCode}`;
  const displayInviteLink = `...b.sharkpay-app.com/regist?code=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Commission and Team Recharge values based on real user state (0 by default)
  const displayCommission = user.teamCommission ?? 0;
  const displayRecharge = user.totalRecharge ?? 0;
  const totalTeamCount = teamMembers.length;


  return (
    <div className="pt-2 pb-24 space-y-5 select-none font-sans">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">Team</h1>
      </div>

      {/* Dark Charcoal Summary Card matching Screenshot_20261103_012840 */}
      <div className="bg-[#3e3e3e] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Top 2 Stats */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <div className="text-[30px] sm:text-[32px] font-extrabold tracking-tight text-white leading-none">
              {displayCommission === 0
                ? '0'
                : displayCommission.toLocaleString('en-US', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
            </div>
            <div className="text-sm font-medium text-zinc-300 mt-2">Commission</div>
          </div>

          <div>
            <div className="text-[24px] sm:text-[26px] font-extrabold tracking-tight text-white leading-none">
              {displayRecharge === 0
                ? '0.00'
                : displayRecharge.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </div>
            <div className="text-sm font-medium text-zinc-300 mt-2">Team Recharge</div>
          </div>
        </div>

        {/* Member Count at Bottom Left */}
        <div className="mt-7 flex items-center gap-1.5 text-white">
          <User className="w-4 h-4 text-white stroke-[2.2]" />
          <span className="text-base font-bold leading-none">{totalTeamCount}</span>
        </div>
      </div>

      {/* Invite Code Section */}
      <div className="space-y-2">
        <h2 className="text-base font-bold text-black tracking-tight">Invite Code</h2>
        <div className="bg-[#fafafa] border border-zinc-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <span className="text-xs sm:text-[13px] font-medium text-zinc-900 tracking-tight truncate flex-1 font-mono">
            {displayInviteLink}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-8 h-8 rounded-lg bg-white border border-zinc-300/80 hover:bg-zinc-50 active:scale-95 flex items-center justify-center text-zinc-700 transition flex-shrink-0 shadow-2xs"
            title="Copy Invite Link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 stroke-[1.8]" />
            )}
          </button>
        </div>
      </div>

      {/* Team Detail Section */}
      <div className="space-y-2 pt-1">
        <h2 className="text-base font-bold text-black tracking-tight">Team Detail</h2>

        {teamMembers.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center mb-3">
              <User className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
            </div>
            <p className="text-sm font-bold text-zinc-800 tracking-tight">No team members</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-[220px] leading-relaxed">
              Share your invite link above to invite members to your team
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {teamMembers.map((member) => {
              const hasSubMembers = (member.subMembersCount ?? 0) > 0;
              const rechargeVal = member.rechargeAmount ?? member.tradingVolume ?? 0;
              const commVal = member.commissionAmount ?? member.commissionEarned ?? 0;

              return (
                <div
                  key={member.id}
                  onClick={() => {
                    if (hasSubMembers) {
                      setSelectedMember(member);
                    }
                  }}
                  className={`py-3 flex items-center gap-3 transition rounded-xl ${
                    hasSubMembers ? 'cursor-pointer hover:bg-zinc-50/80 px-1.5 -mx-1.5' : 'px-0'
                  }`}
                >
                  {/* Glowing Neural Teal Avatar */}
                  <TeamAvatar className="w-12 h-12 flex-shrink-0" />

                  {/* Member Details */}
                  <div className="flex-1 min-w-0">
                    {/* Top Line: Phone number + Team count / Chevron */}
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-bold text-zinc-950 tracking-tight">
                        Phone: {member.phone}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <User className="w-3.5 h-3.5 text-zinc-400 stroke-[2]" />
                        <span className="text-sm font-medium text-zinc-500">
                          {member.subMembersCount ?? 0}
                        </span>
                        {hasSubMembers && (
                          <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[1.8]" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Line: Recharge & Commission */}
                    <div className="flex items-center justify-between mt-0.5 text-xs text-zinc-400 font-medium">
                      <span>
                        Recharge:{' '}
                        <span className="text-zinc-500 font-normal">
                          {rechargeVal === 0 ? '0' : rechargeVal.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        Comm:{' '}
                        <span className="text-zinc-500 font-normal">
                          {commVal === 0 ? '0' : commVal}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sub-Team Details Drawer/Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <TeamAvatar className="w-10 h-10" />
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    Phone: {selectedMember.phone}
                  </h3>
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{selectedMember.subMembersCount ?? 0} Sub-members</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1 text-center py-6">
              <p className="text-xs text-zinc-400">No further sub-level records.</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="w-full py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-black transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
