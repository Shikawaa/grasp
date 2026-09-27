import { describe, expect, it } from "vitest";
import {
  AuthConfigurationError,
  parseAuthEnv,
} from "@/lib/env-validation";

describe("parseAuthEnv", () => {
  it("returns normalized, strictly validated auth settings", () => {
    const result = parseAuthEnv({
      NEON_AUTH_BASE_URL: "https://auth.example.com",
      NEON_AUTH_COOKIE_SECRET: "a".repeat(32),
      OWNER_EMAILS: " Owner@example.com,second@example.com ",
    });

    expect(result.NEON_AUTH_BASE_URL).toBe("https://auth.example.com");
    expect(result.OWNER_EMAILS).toEqual(
      new Set(["owner@example.com", "second@example.com"]),
    );
  });

  it("names every missing variable without exposing a value", () => {
    expect(() => parseAuthEnv({})).toThrowError(AuthConfigurationError);
    expect(() => parseAuthEnv({})).toThrowError(
      "NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET, OWNER_EMAILS",
    );
  });

  it("rejects malformed values", () => {
    expect(() =>
      parseAuthEnv({
        NEON_AUTH_BASE_URL: "not-a-url",
        NEON_AUTH_COOKIE_SECRET: "too-short",
        OWNER_EMAILS: "",
      }),
    ).toThrowError(AuthConfigurationError);
  });
});
