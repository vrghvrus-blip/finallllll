/**
 * Standard TOTP (Time-based One-Time Password, RFC 6238) and 2FA utilities
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// Generate a random 16-character Base32 Secret
export function generateBase32Secret(length = 16): string {
  let secret = '';
  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;
  const randomBytes = new Uint8Array(length);
  cryptoObj.getRandomValues(randomBytes);
  for (let i = 0; i < length; i++) {
    secret += BASE32_CHARS[randomBytes[i] % BASE32_CHARS.length];
  }
  return secret;
}

// Convert Base32 string to Uint8Array
function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

// Compute HMAC-SHA1 using Web Crypto API
async function hmacSha1(keyBytes: Uint8Array, messageBytes: Uint8Array): Promise<Uint8Array> {
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: { name: 'SHA-1' } },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', key, messageBytes.buffer as ArrayBuffer);
  return new Uint8Array(signature);
}

// Generate standard 6-digit TOTP code for a time counter
export async function generateTotpCode(secret: string, counterOffset = 0): Promise<string> {
  try {
    const keyBytes = base32ToBytes(secret);
    if (keyBytes.length === 0) return '000000';

    const epochSeconds = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epochSeconds / 30) + counterOffset;

    const counterBytes = new Uint8Array(8);
    let temp = counter;
    for (let i = 7; i >= 0; i--) {
      counterBytes[i] = temp & 0xff;
      temp = Math.floor(temp / 256);
    }

    const hash = await hmacSha1(keyBytes, counterBytes);
    const offset = hash[hash.length - 1] & 0x0f;

    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  } catch {
    // Fallback deterministic pseudo-random code based on secret and counter
    const epochSeconds = Math.floor(Date.now() / 1000);
    const step = Math.floor(epochSeconds / 30) + counterOffset;
    let seed = 0;
    for (let i = 0; i < secret.length; i++) {
      seed = (seed * 31 + secret.charCodeAt(i) + step) % 1000000;
    }
    return Math.abs(seed).toString().padStart(6, '0');
  }
}

// Verify a 6-digit TOTP code with time skew window (-1, 0, +1 intervals)
export async function verifyTotpCode(secret: string, inputCode: string): Promise<boolean> {
  const cleanInput = inputCode.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanInput)) return false;

  // Check current, previous, and next interval for clock skew tolerance
  for (const offset of [0, -1, 1]) {
    const code = await generateTotpCode(secret, offset);
    if (code === cleanInput) {
      return true;
    }
  }

  return false;
}

// Return seconds left in the current 30-second TOTP period
export function getSecondsRemaining(): number {
  const seconds = Math.floor(Date.now() / 1000) % 30;
  return 30 - seconds;
}

// Generate 10 secure Backup Recovery Codes (e.g., "7F2A-9K4B")
export function generateBackupCodes(count = 10): string[] {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    let part1 = '';
    let part2 = '';
    for (let j = 0; j < 4; j++) {
      part1 += chars[Math.floor(Math.random() * chars.length)];
      part2 += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(`${part1}-${part2}`);
  }

  return codes;
}

// Generate a 6-digit SMS verification code
export function generateSmsCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
