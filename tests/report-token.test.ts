import { describe, it, expect } from "vitest";
import {
  generateDeletionToken,
  verifyDeletionToken,
  hashToken,
} from "@/lib/report-token";

describe("deletion token", () => {
  it("verifies a freshly generated token against its hash", () => {
    const { token, hash } = generateDeletionToken();
    expect(verifyDeletionToken(token, hash)).toBe(true);
  });

  it("rejects a wrong token", () => {
    const { hash } = generateDeletionToken();
    expect(verifyDeletionToken("not-the-token", hash)).toBe(false);
  });

  it("rejects a mismatched hash", () => {
    const { token } = generateDeletionToken();
    const other = generateDeletionToken();
    expect(verifyDeletionToken(token, other.hash)).toBe(false);
  });

  it("hashes deterministically", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("generates unique tokens", () => {
    expect(generateDeletionToken().token).not.toBe(
      generateDeletionToken().token,
    );
  });
});
