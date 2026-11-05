# Security Specification: SharkPay 2.0 Firestore Rules

## 1. Data Invariants
1. **Ownership & Identity Isolation**: All documents under `/users/{userId}` and its subcollections (`upiAccounts`, `recharges`, `tokens`, `teamMembers`) belong strictly to `userId`. A user cannot read, create, update, or delete another user's documents.
2. **Master Gate Enforcement**: Access to subcollections (`upiAccounts`, `recharges`, `tokens`, `teamMembers`) strictly requires the existence of the parent `/users/{userId}` document and `request.auth.uid == userId`.
3. **Immutability of Key Identifiers**: Document IDs and relational fields (`userId`, `id`, `createdAt`) cannot be altered during updates.
4. **Strict Schema & Anti-Update Gap**: Documents cannot have unauthorized ghost fields (enforced via key set constraints).
5. **String Boundary Limits**: All string inputs are bounded (`size() <= 128` or corresponding maximums) to prevent resource exhaustion attacks.

## 2. The Dirty Dozen Payloads
1. **Spoofed User ID Write**: Attacker attempting to write to `/users/victim_user_123` with `auth.uid = attacker_456`.
2. **Ghost Field Injection**: Attempting to inject `isAdmin: true` into `UserProfile`.
3. **Oversized String Payload**: Attempting to save a 50KB string in `phone` or `appName` to trigger denial-of-wallet.
4. **Subcollection Orphan Write**: Writing to `/users/{userId}/upiAccounts/{accountId}` where parent `/users/{userId}` does not exist.
5. **Cross-Tenant Subcollection Query**: An authenticated user listing another user's `recharges` or `tokens`.
6. **Immutable Field Tampering**: Attempting to change `userId` or `id` during a document update.
7. **Negative Balance Tampering**: Directly injecting negative or infinite amounts in `balance`.
8. **Invalid Enum in UPI Type**: Submitting `type: 'crypto_drainer'` instead of `'receive'`, `'send'`, or `'both'`.
9. **Unauthenticated Read**: Attempting to read `/users/{userId}` without logging in.
10. **ID Poisoning Attack**: Passing special symbols or 2000-char path variable as `{userId}`.
11. **Client-Controlled Ownership Flip**: User attempting to set `userId` in `recharges` to a third party.
12. **Malformed Timestamp Spoofing**: Attempting to bypass schema with invalid types on `isPositive` or `status`.

## 3. Test Runner Verification Plan
Every operation matching the Dirty Dozen must be strictly rejected with `PERMISSION_DENIED`.
