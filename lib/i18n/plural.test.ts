import { describe, expect, it } from "vitest";
import { formatCardinalMessage } from "@/lib/i18n/plural";

const fr = {
  one: "{count} réponse sur {total}",
  other: "{count} réponses sur {total}",
};
const en = {
  one: "{count} answer out of {total}",
  other: "{count} answers out of {total}",
};

describe("formatCardinalMessage", () => {
  it("uses French plural rules, including the singular category for zero", () => {
    expect(formatCardinalMessage(fr, 0, "fr", { total: 9 })).toBe("0 réponse sur 9");
    expect(formatCardinalMessage(fr, 1, "fr", { total: 9 })).toBe("1 réponse sur 9");
    expect(formatCardinalMessage(fr, 2, "fr", { total: 9 })).toBe("2 réponses sur 9");
  });

  it("uses English plural rules without assembling sentence fragments", () => {
    expect(formatCardinalMessage(en, 0, "en", { total: 9 })).toBe("0 answers out of 9");
    expect(formatCardinalMessage(en, 1, "en", { total: 9 })).toBe("1 answer out of 9");
    expect(formatCardinalMessage(en, 8, "en", { total: 9 })).toBe("8 answers out of 9");
  });
});
