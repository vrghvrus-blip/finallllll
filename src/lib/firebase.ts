import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProfile,
  UPIAccount,
  RechargeRecord,
  TokenRecord,
  TeamMember,
} from '../types/rswallet';

// 1. Initialize Firebase App and Firestore with the configured Database ID
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 2. Validate Connection to Firestore on startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// 3. Error Handling conforming strictly to SKILL.md FirestoreErrorInfo
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 4. Google Sign-In with Popup
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// 5. Sign Out
export async function signOutFirebase(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
  }
}

// 5b. Registered Phone Accounts in Firestore
export async function saveAccountToFirestore(phone: string, password: string): Promise<void> {
  const normalizedPhone = phone.trim();
  const path = `accounts/${normalizedPhone}`;
  try {
    const accRef = doc(db, 'accounts', normalizedPhone);
    await setDoc(accRef, {
      phone: normalizedPhone,
      password,
      registeredAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAccountFromFirestore(phone: string): Promise<{ phone: string; password: string } | null> {
  const normalizedPhone = phone.trim();
  const path = `accounts/${normalizedPhone}`;
  try {
    const accRef = doc(db, 'accounts', normalizedPhone);
    const snap = await getDoc(accRef);
    if (snap.exists()) {
      return snap.data() as { phone: string; password: string };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function resetPasswordInFirestore(phone: string, newPassword: string): Promise<void> {
  const normalizedPhone = phone.trim();
  const path = `accounts/${normalizedPhone}`;
  try {
    const accRef = doc(db, 'accounts', normalizedPhone);
    await setDoc(accRef, {
      phone: normalizedPhone,
      password: newPassword,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 6. Firestore User Profile Synchronization
export async function syncUserProfileToFirestore(userId: string, profile: UserProfile) {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        userId,
        phone: profile.phone || 'Guest',
        email: profile.email || auth.currentUser?.email || '',
        balance: profile.balance ?? 0,
        quota: profile.quota ?? 0,
        topUpBonus: profile.topUpBonus ?? 0,
        teamCommission: profile.teamCommission ?? 0,
        todayReceived: profile.todayReceived ?? 0,
        todayRecharge: profile.todayRecharge ?? 0,
        totalRecharge: profile.totalRecharge ?? 0,
        usdtRatio: profile.usdtRatio ?? 114.01,
        inviteCode: profile.inviteCode || '0edatgwpa7r5',
        inviteUrl: profile.inviteUrl || 'https://sharkpay.in/invite/0edatgwpa7r5',
        securityPin: profile.securityPin || '',
        language: profile.language || 'English',
        is2FAEnabled: profile.is2FAEnabled ?? false,
        twoFactorSecret: profile.twoFactorSecret || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 7. Sync UPI Account
export async function syncUpiAccountToFirestore(userId: string, account: UPIAccount) {
  const path = `users/${userId}/upiAccounts/${account.id}`;
  try {
    const ref = doc(db, 'users', userId, 'upiAccounts', account.id);
    await setDoc(ref, {
      ...account,
      userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 8. Delete UPI Account
export async function deleteUpiAccountFromFirestore(userId: string, accountId: string) {
  const path = `users/${userId}/upiAccounts/${accountId}`;
  try {
    const ref = doc(db, 'users', userId, 'upiAccounts', accountId);
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 9. Sync Recharge Record
export async function syncRechargeRecordToFirestore(userId: string, record: RechargeRecord) {
  const path = `users/${userId}/recharges/${record.id}`;
  try {
    const ref = doc(db, 'users', userId, 'recharges', record.id);
    await setDoc(ref, {
      ...record,
      userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 10. Sync Token Record
export async function syncTokenRecordToFirestore(userId: string, record: TokenRecord) {
  const path = `users/${userId}/tokens/${record.id}`;
  try {
    const ref = doc(db, 'users', userId, 'tokens', record.id);
    await setDoc(ref, {
      ...record,
      userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 11. Sync Team Member
export async function syncTeamMemberToFirestore(userId: string, member: TeamMember) {
  const path = `users/${userId}/teamMembers/${member.id}`;
  try {
    const ref = doc(db, 'users', userId, 'teamMembers', member.id);
    await setDoc(ref, {
      ...member,
      userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 12. Real-Time Data Subscriptions
export function subscribeToUserData(
  userId: string,
  onUserUpdate: (profile: Partial<UserProfile>) => void,
  onUpiUpdate: (accounts: UPIAccount[]) => void,
  onRechargeUpdate: (recharges: RechargeRecord[]) => void,
  onTokenUpdate: (tokens: TokenRecord[]) => void,
  onTeamUpdate: (team: TeamMember[]) => void
): () => void {
  const unsubs: Unsubscribe[] = [];

  // User Profile listener
  const userRef = doc(db, 'users', userId);
  unsubs.push(
    onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUserUpdate(snapshot.data() as Partial<UserProfile>);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      }
    )
  );

  // UPI Accounts listener
  const upiRef = collection(db, 'users', userId, 'upiAccounts');
  unsubs.push(
    onSnapshot(
      upiRef,
      (snapshot) => {
        const accounts: UPIAccount[] = [];
        snapshot.forEach((d) => accounts.push(d.data() as UPIAccount));
        if (accounts.length > 0) {
          onUpiUpdate(accounts);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/upiAccounts`);
      }
    )
  );

  // Recharges listener
  const rechargesRef = collection(db, 'users', userId, 'recharges');
  unsubs.push(
    onSnapshot(
      rechargesRef,
      (snapshot) => {
        const records: RechargeRecord[] = [];
        snapshot.forEach((d) => records.push(d.data() as RechargeRecord));
        if (records.length > 0) {
          // Sort descending by date
          records.sort((a, b) => (b.date > a.date ? 1 : -1));
          onRechargeUpdate(records);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/recharges`);
      }
    )
  );

  // Tokens listener
  const tokensRef = collection(db, 'users', userId, 'tokens');
  unsubs.push(
    onSnapshot(
      tokensRef,
      (snapshot) => {
        const tokens: TokenRecord[] = [];
        snapshot.forEach((d) => tokens.push(d.data() as TokenRecord));
        if (tokens.length > 0) {
          tokens.sort((a, b) => (b.date > a.date ? 1 : -1));
          onTokenUpdate(tokens);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/tokens`);
      }
    )
  );

  // Team Members listener
  const teamRef = collection(db, 'users', userId, 'teamMembers');
  unsubs.push(
    onSnapshot(
      teamRef,
      (snapshot) => {
        const team: TeamMember[] = [];
        snapshot.forEach((d) => team.push(d.data() as TeamMember));
        if (team.length > 0) {
          onTeamUpdate(team);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/teamMembers`);
      }
    )
  );

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
}
