import { createHmac, timingSafeEqual } from "crypto";

// ---------------------------------------------------------------------------
// Anti-spam: signed form token (time-trap) + honeypot check.
//
// A signed token carrying the page-render time is embedded in each public form.
// On submit we verify the signature (so a bot can't forge one by hitting the
// API directly) and that the elapsed time is plausible for a human:
//   - too fast (< MIN_MS)  → bot filling instantly
//   - too old  (> MAX_MS)  → stale / replayed token
// No IP or personal data is involved.
// ---------------------------------------------------------------------------

const MIN_MS = 2_000; // 2s — humans don't submit faster
const MAX_MS = 24 * 60 * 60 * 1_000; // 24h — token lifetime

function secret(): string {
  // Falls back to ADMIN_PASSWORD (already a required server secret) so no extra
  // configuration is mandatory. Set FORM_SECRET to decouple it if you prefer.
  return (
    process.env.FORM_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "algosignal-insecure-dev-secret"
  );
}

function sign(timestamp: string): string {
  return createHmac("sha256", secret()).update(timestamp).digest("hex");
}

// Minted server-side when a form page is rendered.
export function issueFormToken(now: number = Date.now()): string {
  const ts = String(now);
  return `${ts}.${sign(ts)}`;
}

export function verifyFormToken(
  token: string,
  now: number = Date.now(),
): boolean {
  const [ts, sig] = (token ?? "").split(".");
  if (!ts || !sig) return false;

  const expected = sign(ts);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const age = now - Number(ts);
  return Number.isFinite(age) && age >= MIN_MS && age <= MAX_MS;
}

// Returns a reason string when the submission looks like spam, else null.
// `website` is the honeypot field: hidden from humans, often filled by bots.
export function detectSpam(body: unknown): string | null {
  const b = (body ?? {}) as Record<string, unknown>;

  if (typeof b.website === "string" && b.website.trim() !== "") {
    return "honeypot";
  }
  if (!verifyFormToken(typeof b.formToken === "string" ? b.formToken : "")) {
    return "token";
  }
  return null;
}
