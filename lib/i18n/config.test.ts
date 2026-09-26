import { describe, expect, it } from "vitest";
import { resolveLocale } from "@/lib/i18n/config";

describe("resolveLocale", () => {
  it("uses the profile language first", () => {
    expect(
      resolveLocale({
        profileLanguage: "en",
        cookieLanguage: "fr",
        acceptLanguage: "fr-FR",
      }),
    ).toBe("en");
  });

  it("uses the language cookie before the browser language", () => {
    expect(
      resolveLocale({ cookieLanguage: "fr", acceptLanguage: "en-US" }),
    ).toBe("fr");
  });

  it("uses French for a French browser", () => {
    expect(resolveLocale({ acceptLanguage: "fr-CA,fr;q=0.9,en;q=0.8" })).toBe(
      "fr",
    );
  });

  it("uses English for other browser languages", () => {
    expect(resolveLocale({ acceptLanguage: "de-DE,de;q=0.9" })).toBe("en");
  });

  it("falls back to French when no preference exists", () => {
    expect(resolveLocale({})).toBe("fr");
  });
});
