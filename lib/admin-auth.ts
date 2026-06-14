import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

// ---------------------------------------------------------------------------
// Single-moderator authentication.
//
// There are no user accounts. Access to /admin is granted by a single shared
// password held in the ADMIN_PASSWORD environment variable.
//
// On login we set an httpOnly cookie whose value is HMAC(ADMIN_PASSWORD, tag).
// The raw password never touches the cookie, and the value can't be forged
// without knowing the password. Changing ADMIN_PASSWORD invalidates all
// existing sessions.
// ---------------------------------------------------------------------------

export const ADMIN_COOKIE = "algosignal_admin";
const COOKIE_TAG = "admin-session-v1";

// Constant-time string comparison that is also length-safe.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// The opaque token stored in the cookie. Empty string when no password is set
// (which keeps the admin area locked rather than open).
export function adminToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "";
  return createHmac("sha256", password).update(COOKIE_TAG).digest("hex");
}

// True when the submitted password matches ADMIN_PASSWORD.
export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return safeEqual(input, password);
}

// True when the current request carries a valid admin cookie.
export function isAdmin(): boolean {
  const expected = adminToken();
  if (!expected) return false;
  const got = cookies().get(ADMIN_COOKIE)?.value ?? "";
  return safeEqual(got, expected);
}
