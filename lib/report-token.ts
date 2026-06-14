import { randomBytes, createHash, timingSafeEqual } from "crypto";

// ---------------------------------------------------------------------------
// One-time deletion token for anonymous reports (RGPD right to erasure).
//
// At creation we generate a random secret, show it to the author exactly once,
// and store only its SHA-256 hash. Presenting the secret later proves authorship
// and authorises deletion — no account needed.
// ---------------------------------------------------------------------------

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateDeletionToken(): { token: string; hash: string } {
  const token = randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token) };
}

// Constant-time comparison of a presented token against the stored hash.
export function verifyDeletionToken(token: string, storedHash: string): boolean {
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(storedHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
