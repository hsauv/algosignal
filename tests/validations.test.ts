import { describe, it, expect } from "vitest";
import {
  createReportSchema,
  createCommentSchema,
  listReportsQuerySchema,
} from "@/lib/validations";

const validReport = {
  domain: "EMPLOYMENT",
  systemName: "Filtre de CV",
  biasTypes: ["GENDER"],
  description:
    "Une description suffisamment longue pour passer la validation minimale.",
  consent: true,
};

describe("createReportSchema", () => {
  it("accepts a valid report", () => {
    expect(createReportSchema.safeParse(validReport).success).toBe(true);
  });

  it("rejects when consent is missing", () => {
    const { consent, ...withoutConsent } = validReport;
    expect(createReportSchema.safeParse(withoutConsent).success).toBe(false);
  });

  it("rejects when consent is false", () => {
    expect(
      createReportSchema.safeParse({ ...validReport, consent: false }).success,
    ).toBe(false);
  });

  it("rejects an empty bias type list", () => {
    expect(
      createReportSchema.safeParse({ ...validReport, biasTypes: [] }).success,
    ).toBe(false);
  });

  it("rejects a too-short description", () => {
    expect(
      createReportSchema.safeParse({ ...validReport, description: "trop court" })
        .success,
    ).toBe(false);
  });

  it("rejects an invalid domain", () => {
    expect(
      createReportSchema.safeParse({ ...validReport, domain: "NOPE" }).success,
    ).toBe(false);
  });
});

describe("createCommentSchema", () => {
  it("accepts a valid comment", () => {
    expect(createCommentSchema.safeParse({ content: "Bien vu" }).success).toBe(
      true,
    );
  });

  it("rejects a too-short comment", () => {
    expect(createCommentSchema.safeParse({ content: "a" }).success).toBe(false);
  });
});

describe("listReportsQuerySchema", () => {
  it("defaults page to 1", () => {
    const parsed = listReportsQuerySchema.parse({});
    expect(parsed.page).toBe(1);
  });

  it("coerces a numeric page string", () => {
    expect(listReportsQuerySchema.parse({ page: "3" }).page).toBe(3);
  });

  it("rejects an invalid status", () => {
    expect(
      listReportsQuerySchema.safeParse({ status: "BOGUS" }).success,
    ).toBe(false);
  });
});
