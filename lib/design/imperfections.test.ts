import { describe, expect, it } from "vitest";
import {
  getImperfection,
  imperfectionAngleVariants,
  imperfectionCutVariants,
  imperfectionLengthVariants,
} from "@/lib/design/imperfections";

describe("getImperfection", () => {
  it("returns the same variants for the same business identifier", () => {
    expect(getImperfection("theme:sakoku")).toEqual(getImperfection("theme:sakoku"));
  });

  it("keeps every geometric sample inside the documented deterministic range", () => {
    for (let index = 0; index < 500; index += 1) {
      const samples = getImperfection(`lesson:sample-${index}`).samples;
      expect(samples).toHaveLength(16);
      expect(samples.every((sample) => sample >= -1 && sample <= 1)).toBe(true);
    }
  });

  it("selects only documented variants", () => {
    const imperfection = getImperfection("lesson:procrastination-02");

    expect(imperfectionAngleVariants).toContain(imperfection.angle);
    expect(imperfectionLengthVariants).toContain(imperfection.length);
    expect(imperfectionCutVariants).toContain(imperfection.cut);
  });

  it("varies stable business identifiers without using display order", () => {
    const variants = new Set(
      [
        "theme:sakoku",
        "theme:procrastination",
        "theme:currents-war",
        "theme:vikings-america",
      ].map((identifier) => JSON.stringify(getImperfection(identifier))),
    );

    expect(variants.size).toBeGreaterThan(1);
  });

  it("rejects an empty identifier", () => {
    expect(() => getImperfection("  ")).toThrow(/business identifier/i);
  });
});
