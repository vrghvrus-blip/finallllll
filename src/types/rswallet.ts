export type TabType = 'home' | 'deposit' | 'upi' | 'team' | 'me';

export interface SecurityEvent {
  id: string;
  type: 'biometric_auth' | '2fa_verified' | 'sms_verified' | 'pin_verified' | 'login';
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'failed';
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  nickname: string;
  avatarUrl?: string;
  balance: number;
  quota: number;
  rewardRatio: number;
  todayReceived: number;
  topUpBonus: number;
  teamCommission: number;
  yesterdayRecharge: number;
  todayRecharge: number;
  totalRecharge: number;
  totalCommission: number;
  usdtRatio: number;
  inrBonusRatio: number;
  inviteCode: string;
  inviteUrl: string;
  language: string;
  is2FAEnabled: boolean;
  twoFactorSecret: string;
  isBiometricEnabled: boolean;
  biometricType: 'fingerprint' | 'face_id';
  isSmsMfaEnabled: boolean;
  securityPin?: string;
}

export interface UPIAccount {
  id: string;
  appType: 'paytm' | 'phonepe' | 'gpay' | 'bhim' | 'indusind' | 'airtel' | 'mobikwik' | 'other';
  appName: string;
  title: string;
  upiId: string;
  bankName?: string;
  pin?: string; // 6-digit UPI PIN
  status: 'Authorized' | 'Pending' | 'Rejected';
  isOnSale: boolean;
  type: 'receive' | 'send' | 'both';
  createdAt: string;
}

export interface QuotaPackage {
  id: string;
  amount: number;
  income: number;
  incomePercent: number;
  quota: number;
  tier?: 'task' | 'vip';
  status?: 'available' | 'sold_out';
}

export interface RechargeRecord {
  id: string;
  type: 'USDT' | 'UPI' | 'QUOTA';
  amount: number;
  amountUnit: string;
  inrValue: number;
  status: 'success' | 'pending' | 'failed';
  txHash?: string;
  upiRef?: string;
  boundUpiId?: string;
  biddingAccountTitle?: string;
  date: string;
}

export interface TokenRecord {
  id: string;
  type: 'BONUS' | 'COMMISSION' | 'QUOTA_PURCHASE' | 'TOP_UP' | 'DAILY_REWARD';
  title: string;
  amount: number;
  isPositive: boolean;
  date: string;
}

export interface TaskMilestone {
  step: number;
  reward: number;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TeamMember {
  id: string;
  phone: string;
  name: string;
  joinedAt: string;
  tier: 1 | 2;
  tradingVolume: number;
  commissionEarned: number;
  status: 'Active' | 'Pending';
  subMembersCount?: number;
  rechargeAmount?: number;
  commissionAmount?: number;
}
