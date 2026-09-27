import { describe, expect, it } from "vitest";
import { formatTypography } from "@/lib/i18n/typography";

describe("formatTypography", () => {
  it("keeps French numbers with what they count", () => {
    expect(formatTypography("2 sur 4, 3 minutes, 200 ans et 8 cartes", "fr")).toBe(
      "2\u00A0sur 4, 3\u00A0minutes, 200\u00A0ans et 8\u00A0cartes",
    );
  });

  it("keeps English numbers with what they count", () => {
    expect(formatTypography("2 of 4, 3 minutes, 200 years and 8 cards", "en")).toBe(
      "2\u00A0of 4, 3\u00A0minutes, 200\u00A0years and 8\u00A0cards",
    );
  });

  it("applies French apostrophes, punctuation and quotation spacing", () => {
    expect(formatTypography("L'essai : « oui ; vraiment ! »", "fr")).toBe(
      "L’essai\u00A0: «\u202Foui\u202F; vraiment\u202F!\u202F»",
    );
  });

  it("does not alter URLs or email addresses", () => {
    expect(formatTypography("https://example.com?q=3 minutes", "fr")).toBe(
      "https://example.com?q=3 minutes",
    );
    expect(formatTypography("toi@example.com", "fr")).toBe("toi@example.com");
  });
});
