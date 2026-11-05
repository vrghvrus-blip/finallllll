import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { DepositTab } from './components/tabs/DepositTab';
import { UpiTab } from './components/tabs/UpiTab';
import { TeamTab } from './components/tabs/TeamTab';
import { MeTab } from './components/tabs/MeTab';

import {
  NewbieGuideModal,
  NewbieRewardModal,
} from './components/modals/NewbieModals';
import { TutorialModal } from './components/modals/TutorialModal';
import { HowBindUpiModal, HowBuyQuotaModal } from './components/modals/HowToModals';
import { BindUpiModal } from './components/modals/BindUpiModal';
import { OpenUpiSimulatorModal } from './components/modals/OpenUpiSimulatorModal';
import { BuyQuotaModal } from './components/modals/BuyQuotaModal';
import { TopUpModal } from './components/modals/TopUpModal';
import { RechargeHistoryModal, TokenHistoryModal } from './components/modals/HistoryModals';
import {
  GoogleAuthModal,
  ContactUsModal,
  LanguagesModal,
  EditProfileModal,
  ShareModal,
} from './components/modals/ProfileAndSettingsModals';
import { SecuritySettingsModal } from './components/modals/SecuritySettingsModal';
import { BiometricPromptModal } from './components/modals/BiometricPromptModal';
import { SelectSendUpiModal } from './components/modals/SelectSendUpiModal';
import { SixDigitPinModal } from './components/modals/SixDigitPinModal';
import { NativeAppModal } from './components/modals/NativeAppModal';
import { LoginPage } from './components/auth/LoginPage';
import { PWAInstallBanner } from './components/pwa/PWAInstallBanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import {
  TabType,
  UserProfile,
  UPIAccount,
  QuotaPackage,
  RechargeRecord,
  TokenRecord,
  TeamMember,
} from './types/rswallet';
import {
  INITIAL_USER,
  INITIAL_UPI_ACCOUNTS,
  INITIAL_QUOTA_PACKAGES,
  INITIAL_RECHARGES,
  INITIAL_TOKEN_RECORDS,
  INITIAL_TEAM_MEMBERS,
  TRC20_WALLET_ADDRESS,
} from './data/mockData';
import {
  auth,
  signOutFirebase,
  syncUserProfileToFirestore,
  syncUpiAccountToFirestore,
  syncRechargeRecordToFirestore,
  syncTokenRecordToFirestore,
  syncTeamMemberToFirestore,
  subscribeToUserData,
} from './lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Core User State (0 data baseline, 118.3 USDT rate)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sharkpay_user_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    try {
      localStorage.removeItem('sharkpay_user_v2');
    } catch {}
    return INITIAL_USER;
  });

  // UPI Accounts (0 data baseline)
  const [upiAccounts, setUpiAccounts] = useState<UPIAccount[]>(() => {
    const saved = localStorage.getItem('sharkpay_upi_v2');
    return saved ? JSON.parse(saved) : INITIAL_UPI_ACCOUNTS;
  });

  // Quota Packages
  const [quotaPackages] = useState<QuotaPackage[]>(INITIAL_QUOTA_PACKAGES);

  // Recharge Records (0 data baseline)
  const [rechargeRecords, setRechargeRecords] = useState<RechargeRecord[]>(() => {
    const saved = localStorage.getItem('sharkpay_recharges_v2');
    return saved ? JSON.parse(saved) : INITIAL_RECHARGES;
  });

  // Token / Reward Records (0 data baseline)
  const [tokenRecords, setTokenRecords] = useState<TokenRecord[]>(() => {
    const saved = localStorage.getItem('sharkpay_tokens_v2');
    return saved ? JSON.parse(saved) : INITIAL_TOKEN_RECORDS;
  });

  // Team Members (0 data baseline)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('sharkpay_team_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    try {
      localStorage.removeItem('sharkpay_team_v2');
    } catch {}
    return INITIAL_TEAM_MEMBERS;
  });

  // Daily check-in status
  const [alreadyClaimedDaily, setAlreadyClaimedDaily] = useState<boolean>(() => {
    return localStorage.getItem('sharkpay_claimed_daily') === 'true';
  });

  // Modal Open States
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isNewbieGuideOpen, setIsNewbieGuideOpen] = useState(false);
  const [isNewbieRewardOpen, setIsNewbieRewardOpen] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState<'freecharge' | 'indus' | 'phonepe' | null>(null);
  const [isHowBindUpiOpen, setIsHowBindUpiOpen] = useState(false);
  const [isHowBuyQuotaOpen, setIsHowBuyQuotaOpen] = useState(false);
  const [isBindUpiOpen, setIsBindUpiOpen] = useState(false);
  const [bindUpiInitialType, setBindUpiInitialType] = useState<'receive' | 'send' | 'both'>('both');
  const [isSelectSendUpiOpen, setIsSelectSendUpiOpen] = useState(false);
  const [pendingQuotaPkg, setPendingQuotaPkg] = useState<QuotaPackage | null>(null);
  const [selectedSendUpiId, setSelectedSendUpiId] = useState<string>('');
  const [selectedQuotaForBuy, setSelectedQuotaForBuy] = useState<QuotaPackage | null>(null);
  const [isRechargeHistoryOpen, setIsRechargeHistoryOpen] = useState(false);
  const [isTokenHistoryOpen, setIsTokenHistoryOpen] = useState(false);
  const [isLanguagesOpen, setIsLanguagesOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSecuritySettingsOpen, setIsSecuritySettingsOpen] = useState(false);
  const [isNativeAppModalOpen, setIsNativeAppModalOpen] = useState(false);
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [biometricPromptType, setBiometricPromptType] = useState<'fingerprint' | 'face_id'>('fingerprint');
  const [biometricActionTitle, setBiometricActionTitle] = useState('Authorize Transaction');
  const [biometricSuccessCallback, setBiometricSuccessCallback] = useState<(() => void) | null>(null);

  const handleTestBiometric = (type: 'fingerprint' | 'face_id') => {
    setBiometricPromptType(type);
    setBiometricActionTitle(`Test ${type === 'face_id' ? 'Face ID' : 'Fingerprint'} Sensor`);
    setBiometricSuccessCallback(() => () => {
      showToast(`${type === 'face_id' ? 'Face ID' : 'Fingerprint'} authentication successful!`);
    });
    setIsBiometricPromptOpen(true);
  };

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(auth.currentUser);

  // Auth State (shows Login page when unauthenticated)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sharkpay_auth') === 'true';
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsAuthenticated(true);
        localStorage.setItem('sharkpay_auth', 'true');
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          email: fbUser.email || prev.email,
          phone: fbUser.phoneNumber || prev.phone || fbUser.email?.split('@')[0] || 'User',
        }));
      }
    });
    return () => unsub();
  }, []);

  // Active Cloud Database User ID: either Firebase Auth UID or authenticated Phone ID
  const activeCloudId = firebaseUser?.uid || (isAuthenticated && user.phone && user.phone.trim().length >= 8 ? user.phone.trim() : null);

  // Subscribe to real-time changes from Firestore Cloud Database
  useEffect(() => {
    if (!activeCloudId) return;
    const unsub = subscribeToUserData(
      activeCloudId,
      (remoteUser) => {
        setUser((prev) => ({ ...prev, ...remoteUser }));
      },
      (remoteUpi) => {
        setUpiAccounts(remoteUpi);
      },
      (remoteRecharges) => {
        setRechargeRecords(remoteRecharges);
      },
      (remoteTokens) => {
        setTokenRecords(remoteTokens);
      },
      (remoteTeam) => {
        setTeamMembers(remoteTeam);
      }
    );
    return () => unsub();
  }, [activeCloudId]);

  const handleLoginSuccess = (loginPhone: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('sharkpay_auth', 'true');
    if (loginPhone) {
      setUser((prev) => ({
        ...prev,
        phone: loginPhone,
      }));
    }
    showToast('Login successful! Welcome to SharkPay');
  };

  const handleSignOut = () => {
    signOutFirebase();
    setIsAuthenticated(false);
    localStorage.removeItem('sharkpay_auth');
    showToast('Logged out successfully');
  };

  // Open UPI App Simulator
  const [isUpiSimulatorOpen, setIsUpiSimulatorOpen] = useState(false);
  const [simulatedAppInfo, setSimulatedAppInfo] = useState<{ name: string; upiId: string; pin?: string }>({
    name: 'PhonePe',
    upiId: '',
    pin: '',
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User 6-Digit Security PIN (asks to set first time, then verifies before adding accounts)
  const [securityPin, setSecurityPin] = useState<string>(() => {
    return localStorage.getItem('sharkpay_security_pin') || user.securityPin || '';
  });

  // State for Add Account PIN modal
  const [isAddAccountPinOpen, setIsAddAccountPinOpen] = useState(false);
  const [pendingAddAccountType, setPendingAddAccountType] = useState<'receive' | 'send' | 'both'>('both');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Sync to localStorage & Firestore Cloud Database
  useEffect(() => {
    localStorage.setItem('sharkpay_user_v3', JSON.stringify(user));
    if (activeCloudId) {
      syncUserProfileToFirestore(activeCloudId, user);
    }
  }, [user, activeCloudId]);

  useEffect(() => {
    localStorage.setItem('sharkpay_team_v3', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('sharkpay_upi_v2', JSON.stringify(upiAccounts));
  }, [upiAccounts]);

  useEffect(() => {
    localStorage.setItem('sharkpay_recharges_v2', JSON.stringify(rechargeRecords));
  }, [rechargeRecords]);

  useEffect(() => {
    localStorage.setItem('sharkpay_tokens_v2', JSON.stringify(tokenRecords));
  }, [tokenRecords]);

  // Reset to initial clean 0 data
  const handleResetData = () => {
    setUser(INITIAL_USER);
    setUpiAccounts(INITIAL_UPI_ACCOUNTS);
    setRechargeRecords(INITIAL_RECHARGES);
    setTokenRecords(INITIAL_TOKEN_RECORDS);
    setTeamMembers([]);
    localStorage.removeItem('sharkpay_team_v2');
    setAlreadyClaimedDaily(false);
    localStorage.removeItem('sharkpay_claimed_daily');
    setSecurityPin('');
    localStorage.removeItem('sharkpay_security_pin');
    showToast('Account data reset');
  };

  // Open Add New UPI Account page directly
  const handleRequestAddNewAccount = (type: 'receive' | 'send' | 'both' = 'both') => {
    setBindUpiInitialType(type);
    setIsBindUpiOpen(true);
  };

  // Toggle UPI sale status
  const handleToggleUpiSale = (id: string) => {
    setUpiAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === id) {
          const nextVal = !acc.isOnSale;
          const updated = { ...acc, isOnSale: nextVal };
          if (activeCloudId) {
            syncUpiAccountToFirestore(activeCloudId, updated);
          }
          showToast(`Account ${acc.title} is now ${nextVal ? 'on sale' : 'not sale'}`);
          return updated;
        }
        return acc;
      })
    );
  };

  // Add new UPI account (from clean Add UPI page with 6-digit PIN)
  const handleAddUpiAccount = (newAcc: Omit<UPIAccount, 'id' | 'createdAt'>) => {
    const acc: UPIAccount = {
      ...newAcc,
      id: `upi-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    if (newAcc.pin && !securityPin) {
      setSecurityPin(newAcc.pin);
      localStorage.setItem('sharkpay_security_pin', newAcc.pin);
      setUser((prev) => ({ ...prev, securityPin: newAcc.pin }));
    }
    setUpiAccounts((prev) => [...prev, acc]);
    if (activeCloudId) {
      syncUpiAccountToFirestore(activeCloudId, acc);
    }
    showToast(`Bound ${acc.appName} (${acc.upiId}) successfully!`);

    // If there was a pending quota order and this is a Send-capable account, select it and continue
    if (pendingQuotaPkg && (acc.type === 'send' || acc.type === 'both')) {
      setSelectedSendUpiId(acc.id);
      setTimeout(() => {
        setSelectedQuotaForBuy(pendingQuotaPkg);
      }, 400);
    }
  };

  // Buy Quota request handler (checks Send UPI matching Screenshot 20261102_235210)
  const handleBuyQuotaRequest = (pkg: QuotaPackage) => {
    const sendAccounts = upiAccounts.filter((a) => a.type === 'send' || a.type === 'both');
    setPendingQuotaPkg(pkg);
    if (sendAccounts.length === 0) {
      // Direct modal matching Screenshot 20261102_235210 ("Select Send UPI" with "Add Send UPI")
      setIsSelectSendUpiOpen(true);
    } else {
      setSelectedQuotaForBuy(pkg);
    }
  };

  // Open UPI app simulator with verified PIN
  const handleLaunchUpiApp = (appName: string, upiId: string) => {
    const targetAcc = upiAccounts.find((a) => a.upiId === upiId);
    setSimulatedAppInfo({ name: appName, upiId, pin: targetAcc?.pin });
    setIsUpiSimulatorOpen(true);
  };

  // Confirm Quota Purchase
  const handleConfirmQuotaPurchase = (pkg: QuotaPackage, utr: string) => {
    const isBalancePayment = utr.startsWith('BAL-REF');

    const newRecord: RechargeRecord = {
      id: `rec-${Date.now()}`,
      type: 'QUOTA',
      amount: pkg.amount,
      amountUnit: 'INR',
      inrValue: pkg.amount,
      status: 'success',
      upiRef: utr,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const newToken: TokenRecord = {
      id: `tok-${Date.now()}`,
      type: 'QUOTA_PURCHASE',
      title: `Quota Purchase (${pkg.amount.toLocaleString()} INR)`,
      amount: pkg.quota,
      isPositive: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setUser((prev) => ({
      ...prev,
      balance: isBalancePayment ? Math.max(0, prev.balance - pkg.amount) : prev.balance,
      quota: prev.quota + pkg.quota,
      todayReceived: prev.todayReceived + pkg.income,
      todayRecharge: prev.todayRecharge + pkg.amount,
      totalRecharge: prev.totalRecharge + pkg.amount,
    }));

    setRechargeRecords((prev) => [newRecord, ...prev]);
    setTokenRecords((prev) => [newToken, ...prev]);
    if (activeCloudId) {
      syncRechargeRecordToFirestore(activeCloudId, newRecord);
      syncTokenRecordToFirestore(activeCloudId, newToken);
    }
    showToast(`Quota order for ₹${pkg.amount.toLocaleString()} activated! +${pkg.quota.toLocaleString()} Quota`);
  };

  // Confirm Top Up
  const handleConfirmTopUp = (amount: number, method: 'UPI' | 'USDT') => {
    const firstBonus = Math.round(amount * 0.05);
    const totalAdded = amount + firstBonus;

    const newRecord: RechargeRecord = {
      id: `rec-${Date.now()}`,
      type: method,
      amount: amount,
      amountUnit: method === 'USDT' ? 'USDT' : 'INR',
      inrValue: amount,
      status: 'success',
      upiRef: `TOPUP/${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const newToken: TokenRecord = {
      id: `tok-${Date.now()}`,
      type: 'TOP_UP',
      title: `Wallet Top Up (${method}) + First Bonus`,
      amount: totalAdded,
      isPositive: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + totalAdded,
      topUpBonus: prev.topUpBonus + firstBonus,
      todayRecharge: prev.todayRecharge + amount,
      totalRecharge: prev.totalRecharge + amount,
    }));

    setRechargeRecords((prev) => [newRecord, ...prev]);
    setTokenRecords((prev) => [newToken, ...prev]);
    if (activeCloudId) {
      syncRechargeRecordToFirestore(activeCloudId, newRecord);
      syncTokenRecordToFirestore(activeCloudId, newToken);
    }
    showToast(`Top up successful! Added ₹${totalAdded} (includes ₹${firstBonus} First Bonus)`);
  };

  // Real USDT Deposit handler
  const handleDepositUsdt = (usdtAmount: number, inrVal: number, txHash?: string) => {
    const firstBonus = Math.round(inrVal * 0.05);
    const totalAdded = inrVal + firstBonus;

    const newRecord: RechargeRecord = {
      id: `rec-${Date.now()}`,
      type: 'USDT',
      amount: usdtAmount,
      amountUnit: 'USDT',
      inrValue: inrVal,
      status: 'success',
      txHash: txHash || `TRON_${Date.now().toString(16)}`,
      upiRef: `TRC20/${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    const newToken: TokenRecord = {
      id: `tok-${Date.now()}`,
      type: 'TOP_UP',
      title: `USDT TRC20 Deposit (${usdtAmount} USDT)`,
      amount: totalAdded,
      isPositive: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + totalAdded,
      topUpBonus: prev.topUpBonus + firstBonus,
      todayRecharge: prev.todayRecharge + inrVal,
      totalRecharge: prev.totalRecharge + inrVal,
    }));

    setRechargeRecords((prev) => [newRecord, ...prev]);
    setTokenRecords((prev) => [newToken, ...prev]);
    if (activeCloudId) {
      syncRechargeRecordToFirestore(activeCloudId, newRecord);
      syncTokenRecordToFirestore(activeCloudId, newToken);
    }
    showToast(`Deposit confirmed! Added ₹${totalAdded.toLocaleString()} (${usdtAmount} USDT + ₹${firstBonus} Bonus)`);
  };

  // Daily Check-in claim
  const handleClaimDailyReward = (rewardAmount: number) => {
    setAlreadyClaimedDaily(true);
    localStorage.setItem('sharkpay_claimed_daily', 'true');

    const newToken: TokenRecord = {
      id: `tok-${Date.now()}`,
      type: 'DAILY_REWARD',
      title: 'Daily Check-in Reward',
      amount: rewardAmount,
      isPositive: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setUser((prev) => ({
      ...prev,
      balance: prev.balance + rewardAmount,
      quota: prev.quota + rewardAmount,
    }));

    setTokenRecords((prev) => [newToken, ...prev]);
    if (activeCloudId) {
      syncTokenRecordToFirestore(activeCloudId, newToken);
    }
    showToast(`Claimed +₹${rewardAmount} Daily Starter Reward!`);
  };

  // Register a new partner teammate
  const handleAddTeammate = (memberData: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
    };

    const newToken: TokenRecord = {
      id: `tok-${Date.now()}`,
      type: 'COMMISSION',
      title: `Team Commission (${newMember.name} - Tier ${newMember.tier})`,
      amount: newMember.commissionEarned,
      isPositive: true,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    setTeamMembers((prev) => [newMember, ...prev]);
    setUser((prev) => ({
      ...prev,
      teamCommission: prev.teamCommission + newMember.commissionEarned,
      totalRecharge: prev.totalRecharge + newMember.tradingVolume,
      balance: prev.balance + newMember.commissionEarned,
    }));

    setTokenRecords((prev) => [newToken, ...prev]);
    if (activeCloudId) {
      syncTeamMemberToFirestore(activeCloudId, newMember);
      syncTokenRecordToFirestore(activeCloudId, newToken);
    }
    showToast(`Teammate ${newMember.name} registered! Earned +₹${newMember.commissionEarned} Commission.`);
  };

  return (
    <MobileFrame
      onResetData={handleResetData}
      onOpenNativeApp={() => setIsNativeAppModalOpen(true)}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-white/10 animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* PWA In-App Install Prompt Banner */}
      <PWAInstallBanner />

      {/* Unauthenticated View: SharkPay Login Page matching Screenshot_20261103_020249 */}
      {!isAuthenticated ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenDownloadApp={() => setIsNativeAppModalOpen(true)}
          defaultPhone=""
        />
      ) : (
        <>
          {/* Screen Views based on Active Tab */}
          {activeTab === 'home' && (
            <HomeTab
              user={user}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              onOpenNewbieGuide={() => setIsNewbieGuideOpen(true)}
              onOpenNewbieReward={() => setIsNewbieRewardOpen(true)}
              onOpenTutorial={(type) => setActiveTutorial(type)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenHistory={(type) =>
                type === 'recharge' ? setIsRechargeHistoryOpen(true) : setIsTokenHistoryOpen(true)
              }
            />
          )}

          {activeTab === 'deposit' && (
            <DepositTab
              quotaPackages={quotaPackages}
              usdtRatio={user.usdtRatio}
              walletAddress={TRC20_WALLET_ADDRESS}
              onBuyQuota={handleBuyQuotaRequest}
              onOpenHowBuyQuota={() => setIsHowBuyQuotaOpen(true)}
              onDepositUsdt={handleDepositUsdt}
              onOpenRechargeHistory={() => setIsRechargeHistoryOpen(true)}
            />
          )}

          {activeTab === 'upi' && (
            <UpiTab
              accounts={upiAccounts}
              onToggleSaleStatus={handleToggleUpiSale}
              onAddNewAccount={handleRequestAddNewAccount}
              onOpenHowBindUpi={() => setIsHowBindUpiOpen(true)}
              onOpenUpiApp={handleLaunchUpiApp}
            />
          )}

          {activeTab === 'team' && (
            <TeamTab
              user={user}
              teamMembers={teamMembers}
              onAddTeammate={handleAddTeammate}
              onShowShareModal={() => setIsShareModalOpen(true)}
            />
          )}

          {activeTab === 'me' && (
            <MeTab
              user={user}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenRechargeHistory={() => setIsRechargeHistoryOpen(true)}
              onOpenTokenHistory={() => setIsTokenHistoryOpen(true)}
              onOpenLanguages={() => setIsLanguagesOpen(true)}
              onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
              onOpenSecuritySettings={() => setIsSecuritySettingsOpen(true)}
              onOpenContactUs={() => setIsContactUsOpen(true)}
              onOpenNativeApp={() => setIsNativeAppModalOpen(true)}
              onSignOut={handleSignOut}
            />
          )}

          {/* Floating Customer Service Button matching screenshot_1_65b9a505.png */}
          <button
            type="button"
            onClick={() => setIsContactUsOpen(true)}
            className="fixed bottom-[74px] right-4 sm:right-[calc(50%-185px)] z-40 w-14 h-14 rounded-full bg-[#00a2e8] hover:bg-[#0092d1] active:scale-95 shadow-lg flex items-center justify-center text-white transition cursor-pointer"
            title="Customer Support"
            aria-label="Customer Support"
          >
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </button>

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
        </>
      )}

      {/* 6-Digit PIN Modal required before Adding New Account (matching Screenshot_20261102_235229) */}
      <SixDigitPinModal
        isOpen={isAddAccountPinOpen}
        onClose={() => setIsAddAccountPinOpen(false)}
        mode={securityPin ? 'verify' : 'set'}
        title="Please enter PIN"
        subtitle={
          securityPin
            ? undefined
            : 'Set your 6-digit security PIN for adding accounts'
        }
        expectedPin={securityPin}
        onResetPin={() => {
          setSecurityPin('');
          localStorage.removeItem('sharkpay_security_pin');
          setUser((prev) => ({ ...prev, securityPin: '' }));
          showToast('PIN reset. Enter new 6-digit PIN.');
        }}
        onSuccess={(enteredPin) => {
          if (!securityPin) {
            setSecurityPin(enteredPin);
            localStorage.setItem('sharkpay_security_pin', enteredPin);
            setUser((prev) => ({ ...prev, securityPin: enteredPin }));
            showToast('6-Digit Security PIN set successfully!');
          }
          setIsAddAccountPinOpen(false);
          setBindUpiInitialType(pendingAddAccountType);
          setIsBindUpiOpen(true);
        }}
      />

      {/* 5-Step Bind UPI Modal with Set PIN & Open UPI */}
      <BindUpiModal
        isOpen={isBindUpiOpen}
        onClose={() => setIsBindUpiOpen(false)}
        onAddAccount={handleAddUpiAccount}
        onLaunchUpiApp={handleLaunchUpiApp}
        initialType={bindUpiInitialType}
      />

      {/* Select Send UPI Modal matching Screenshot 20261102_235210 */}
      <SelectSendUpiModal
        isOpen={isSelectSendUpiOpen}
        onClose={() => setIsSelectSendUpiOpen(false)}
        sendAccounts={upiAccounts.filter((a) => a.type === 'send' || a.type === 'both')}
        selectedAccountId={selectedSendUpiId}
        onSelectAccount={(account) => {
          setSelectedSendUpiId(account.id);
          setIsSelectSendUpiOpen(false);
          if (pendingQuotaPkg) {
            setSelectedQuotaForBuy(pendingQuotaPkg);
          }
        }}
        onAddNewSendUpi={() => {
          setIsSelectSendUpiOpen(false);
          handleRequestAddNewAccount('send');
        }}
      />

      {/* Open UPI App Terminal Simulator */}
      <OpenUpiSimulatorModal
        isOpen={isUpiSimulatorOpen}
        onClose={() => setIsUpiSimulatorOpen(false)}
        appName={simulatedAppInfo.name}
        upiId={simulatedAppInfo.upiId}
        expectedPin={simulatedAppInfo.pin}
      />

      {/* Other Modals & Dialogs */}
      <NewbieGuideModal
        isOpen={isNewbieGuideOpen}
        onClose={() => setIsNewbieGuideOpen(false)}
        onOpenReward={() => setIsNewbieRewardOpen(true)}
      />

      <NewbieRewardModal
        isOpen={isNewbieRewardOpen}
        onClose={() => setIsNewbieRewardOpen(false)}
        onClaimDaily={handleClaimDailyReward}
        alreadyClaimedToday={alreadyClaimedDaily}
      />

      <TutorialModal
        type={activeTutorial}
        onClose={() => setActiveTutorial(null)}
      />

      <HowBindUpiModal
        isOpen={isHowBindUpiOpen}
        onClose={() => setIsHowBindUpiOpen(false)}
        onOpenAddNew={() => {
          setIsHowBindUpiOpen(false);
          handleRequestAddNewAccount('both');
        }}
      />

      <HowBuyQuotaModal
        isOpen={isHowBuyQuotaOpen}
        onClose={() => setIsHowBuyQuotaOpen(false)}
      />

      <BuyQuotaModal
        pkg={selectedQuotaForBuy}
        userBalance={user.balance}
        onClose={() => setSelectedQuotaForBuy(null)}
        onConfirmPurchase={handleConfirmQuotaPurchase}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onConfirmTopUp={handleConfirmTopUp}
      />

      <RechargeHistoryModal
        isOpen={isRechargeHistoryOpen}
        onClose={() => setIsRechargeHistoryOpen(false)}
        records={rechargeRecords}
      />

      <TokenHistoryModal
        isOpen={isTokenHistoryOpen}
        onClose={() => setIsTokenHistoryOpen(false)}
        records={tokenRecords}
      />

      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        isEnabled={user.is2FAEnabled}
        secret={user.twoFactorSecret}
        onToggleAuth={(enabled) => {
          setUser((prev) => ({ ...prev, is2FAEnabled: enabled }));
          showToast(`Google Authenticator ${enabled ? 'enabled' : 'disabled'}`);
        }}
      />

      <ContactUsModal
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />

      <LanguagesModal
        isOpen={isLanguagesOpen}
        onClose={() => setIsLanguagesOpen(false)}
        currentLanguage={user.language}
        onSelectLanguage={(lang) => {
          setUser((prev) => ({ ...prev, language: lang }));
          showToast(`Language switched to ${lang}`);
        }}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updated) => {
          setUser((prev) => ({ ...prev, ...updated }));
          showToast('Profile updated');
        }}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        inviteCode={user.inviteCode}
        inviteUrl={user.inviteUrl}
      />

      <SecuritySettingsModal
        isOpen={isSecuritySettingsOpen}
        onClose={() => setIsSecuritySettingsOpen(false)}
        user={user}
        onUpdateSecurity={(updates) => {
          setUser((prev) => ({ ...prev, ...updates }));
          showToast('Security settings updated');
        }}
        onTestBiometric={handleTestBiometric}
      />

      <BiometricPromptModal
        isOpen={isBiometricPromptOpen}
        onClose={() => {
          setIsBiometricPromptOpen(false);
          setBiometricSuccessCallback(null);
        }}
        onSuccess={() => {
          if (biometricSuccessCallback) {
            biometricSuccessCallback();
          }
        }}
        actionTitle={biometricActionTitle}
        biometricType={biometricPromptType}
      />

      {/* Native Mobile App Installation & APK Download Modal */}
      <NativeAppModal
        isOpen={isNativeAppModalOpen}
        onClose={() => setIsNativeAppModalOpen(false)}
        onShowToast={showToast}
      />
    </MobileFrame>
  );
}
