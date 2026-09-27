import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { themeColors } from "@/lib/design/theme-colors";

const tokenSource = readFileSync(resolve(process.cwd(), "styles/tokens.css"), "utf8");
const meterStyles = readFileSync(
  resolve(process.cwd(), "components/carnet/memory-meter.module.css"),
  "utf8",
);

function tokenHex(name: string): string {
  const match = tokenSource.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!match?.[1]) throw new Error(`Missing color token ${name}`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/../g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4,
    );
  if (!channels) throw new Error(`Invalid color token value for ${hex}`);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first: string, second: string): number {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

describe("theme colors", () => {
  it("keeps every displayed ink contrast synchronized with tokens", () => {
    const ink = tokenHex("--ink");

    for (const definition of themeColors) {
      const ratio = contrast(ink, tokenHex(`--highlight-${definition.tone}`));
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(definition.contrastWithInk).toBeCloseTo(ratio, 2);
    }
  });

  it("keeps ink focus outlines above 3:1 on notebook surfaces", () => {
    const ink = tokenHex("--ink");

    expect(contrast(ink, tokenHex("--paper"))).toBeGreaterThanOrEqual(3);
    expect(contrast(ink, tokenHex("--page"))).toBeGreaterThanOrEqual(3);
  });

  it("outlines every memory segment at 3:1 or more against paper", () => {
    const ink = tokenHex("--ink");
    const paper = tokenHex("--paper");

    expect(meterStyles).toMatch(
      /\.segment\s*\{[^}]*border:[^;]*dashed var\(--ink\)/s,
    );
    expect(meterStyles).toMatch(/\.filled\s*\{[^}]*border-style:\s*solid/s);
    for (const definition of themeColors) {
      expect(definition.tone).toBeTruthy();
      expect(contrast(ink, paper)).toBeGreaterThanOrEqual(3);
    }
  });
});
