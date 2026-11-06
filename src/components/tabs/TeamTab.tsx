import React, { useState } from 'react';
import { Copy, Check, User, ChevronRight, X, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { UserProfile, TeamMember } from '../../types/rswallet';

interface TeamTabProps {
  user: UserProfile;
  teamMembers?: TeamMember[];
  onShowShareModal?: () => void;
}

// Minimalist clean user avatar
export const TeamAvatar: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`${className} rounded-full overflow-hidden flex-shrink-0 bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-600 shadow-2xs`}>
    <User className="w-5 h-5 stroke-[1.8]" />
  </div>
);

export const TeamTab: React.FC<TeamTabProps> = ({
  user,
  teamMembers = [],
  onShowShareModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Invite URL matching the screenshot format
  const inviteCode = user.inviteCode || '0edatgwpa7r5';
  const fullInviteUrl = user.inviteUrl || `https://app-web.sharkpay-app.com/regist?code=${inviteCode}`;
  const displayInviteLink = `...b.sharkpay-app.com/regist?code=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Commission and Team Recharge values based on real user state
  const displayCommission = user.teamCommission ?? 0;
  const displayRecharge = user.totalRecharge ?? 0;
  const totalTeamCount = teamMembers.length;

  return (
    <div className="pt-2 pb-24 space-y-5 select-none font-sans">
      {/* Top Header */}
      <div className="pt-1 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 tracking-tight">Team & Affiliates</h1>
          <p className="text-xs text-zinc-500 font-medium">Earn two-tier referral commission</p>
        </div>
        {onShowShareModal && (
          <button
            type="button"
            onClick={onShowShareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-800 text-xs font-semibold transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        )}
      </div>

      {/* Commission Summary Card (Milk Colour Light UI) */}
      <div className="bg-gradient-to-b from-[#fdfcf9] to-[#f7f4ee] text-zinc-900 rounded-2xl p-5 border border-[#eee6d8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        {/* Top 2 Stats */}
        <div className="grid grid-cols-2 gap-4 items-start">
          <div>
            <span className="text-xs text-zinc-500 font-semibold">Team Commission</span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 tabular-nums">
              ₹{displayCommission.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          <div>
            <span className="text-xs text-zinc-500 font-semibold">Team Volume</span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1 tabular-nums">
              ₹{displayRecharge.toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        {/* Bottom 2 Stats */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#eee6d8]">
          <div>
            <span className="text-xs text-zinc-500 font-semibold">Active Partners</span>
            <div className="text-base font-bold text-zinc-950 mt-0.5 tabular-nums">
              {totalTeamCount} {totalTeamCount === 1 ? 'member' : 'members'}
            </div>
          </div>

          <div>
            <span className="text-xs text-zinc-500 font-semibold">Commission Rates</span>
            <div className="text-base font-bold text-emerald-600 mt-0.5">
              10% T1 · 5% T2
            </div>
          </div>
        </div>
      </div>

      {/* Live Commission Rail Status */}
      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-zinc-700 font-medium">Auto-credited directly to wallet on partner trades</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          Active
        </span>
      </div>

      {/* Invitation Link Input Box matching Screenshot_20261103_012840 */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-semibold text-zinc-500">My Referral Link</label>
          <span className="text-[11px] font-mono text-zinc-400">Code: {inviteCode}</span>
        </div>

        <div className="bg-[#f5f6f8] rounded-xl px-4 py-3 flex items-center justify-between gap-3 border border-zinc-200/60 shadow-2xs">
          <span className="text-sm text-zinc-600 font-mono tracking-tight truncate flex-1 select-all">
            {displayInviteLink}
          </span>

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 text-zinc-700 hover:text-black active:scale-95 transition flex-shrink-0 cursor-pointer"
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
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-black tracking-tight">Team Detail</h2>
          <span className="text-xs font-semibold text-zinc-400">
            {teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {teamMembers.length === 0 ? (
          <div className="py-12 px-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-zinc-200/80 shadow-2xs flex items-center justify-center mb-3">
              <User className="w-5 h-5 text-zinc-400 stroke-[1.8]" />
            </div>
            <p className="text-sm font-bold text-zinc-800 tracking-tight">No team members yet</p>
            <p className="text-xs text-zinc-400 mt-1 max-w-[240px] leading-relaxed">
              When friends or partners register using your invite link, they automatically join your team and generate commissions.
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
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-zinc-950 tracking-tight">
                          Phone: {member.phone}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                          Tier {member.tier}
                        </span>
                      </div>
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
                        <span className="text-zinc-600 font-semibold tabular-nums">
                          ₹{rechargeVal === 0 ? '0' : rechargeVal.toLocaleString('en-IN')}
                        </span>
                      </span>
                      <span>
                        Comm:{' '}
                        <span className="text-emerald-600 font-bold tabular-nums">
                          +₹{commVal === 0 ? '0' : commVal.toLocaleString('en-IN')}
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
                className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
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
              className="w-full py-2.5 bg-gradient-to-b from-[#fdfcf9] to-[#f4efe6] hover:bg-[#eee8dc] active:scale-[0.99] text-zinc-950 rounded-xl text-xs font-bold border border-[#e2d9ca] transition shadow-2xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
