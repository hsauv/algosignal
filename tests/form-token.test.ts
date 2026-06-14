import { describe, it, expect, beforeAll } from "vitest";
import {
  issueFormToken,
  verifyFormToken,
  detectSpam,
} from "@/lib/form-token";

beforeAll(() => {
  process.env.FORM_SECRET = "test-form-secret";
});

describe("form token (time-trap)", () => {
  it("accepts a token submitted after a human-plausible delay", () => {
    const t0 = 1_000_000_000_000;
    const token = issueFormToken(t0);
    expect(verifyFormToken(token, t0 + 5_000)).toBe(true);
  });

  it("rejects a token submitted too fast (< 2s)", () => {
    const t0 = 1_000_000_000_000;
    const token = issueFormToken(t0);
    expect(verifyFormToken(token, t0 + 500)).toBe(false);
  });

  it("rejects a stale token (> 24h)", () => {
    const t0 = 1_000_000_000_000;
    const token = issueFormToken(t0);
    expect(verifyFormToken(token, t0 + 25 * 60 * 60 * 1_000)).toBe(false);
  });

  it("rejects a forged / tampered token", () => {
    const t0 = 1_000_000_000_000;
    const token = issueFormToken(t0);
    const tampered = token.replace(/\.\w/, ".0");
    expect(verifyFormToken(tampered, t0 + 5_000)).toBe(false);
  });

  it("rejects an empty token", () => {
    expect(verifyFormToken("")).toBe(false);
  });
});

describe("detectSpam", () => {
  it("flags a filled honeypot", () => {
    const token = issueFormToken(Date.now() - 5_000);
    expect(detectSpam({ website: "http://spam", formToken: token })).toBe(
      "honeypot",
    );
  });

  it("flags a missing/invalid token", () => {
    expect(detectSpam({ website: "" })).toBe("token");
  });

  it("passes a clean submission (empty honeypot + valid token)", () => {
    const token = issueFormToken(Date.now() - 5_000);
    expect(detectSpam({ website: "", formToken: token })).toBeNull();
  });
});
