import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock next/headers so admin-auth can be imported and isAdmin() driven from a
// controllable cookie value.
const state = vi.hoisted(() => ({ cookieValue: undefined as string | undefined }));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: () =>
      state.cookieValue === undefined ? undefined : { value: state.cookieValue },
  }),
}));

import { verifyPassword, adminToken, isAdmin } from "@/lib/admin-auth";

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "s3cret";
  state.cookieValue = undefined;
});

describe("verifyPassword", () => {
  it("accepts the correct password", () => {
    expect(verifyPassword("s3cret")).toBe(true);
  });

  it("rejects a wrong password", () => {
    expect(verifyPassword("nope")).toBe(false);
  });

  it("rejects everything when no password is configured", () => {
    delete process.env.ADMIN_PASSWORD;
    expect(verifyPassword("s3cret")).toBe(false);
  });
});

describe("isAdmin", () => {
  it("is true with a valid admin cookie", () => {
    state.cookieValue = adminToken();
    expect(isAdmin()).toBe(true);
  });

  it("is false with no cookie", () => {
    state.cookieValue = undefined;
    expect(isAdmin()).toBe(false);
  });

  it("is false with a forged cookie", () => {
    state.cookieValue = "forged-value";
    expect(isAdmin()).toBe(false);
  });
});
