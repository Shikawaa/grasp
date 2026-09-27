import { describe, expect, it } from "vitest";
import { getJourneyPath, type JourneyAnchor } from "@/lib/design/journey-path";

const anchors: readonly JourneyAnchor[] = [
  { bottom: 40, left: 10, right: 42, top: 8, x: 26, y: 24 },
  { bottom: 120, left: 110, right: 142, top: 88, x: 126, y: 104 },
];

describe("journey path", () => {
  it("stops horizontal paths at the circle edges", () => {
    const [segment] = getJourneyPath(anchors, false, 160).segments;
    expect(segment?.start).toEqual({ x: anchors[0]?.right, y: anchors[0]?.y });
    expect(segment?.end).toEqual({ x: anchors[1]?.left, y: anchors[1]?.y });
  });

  it("stops vertical paths at the circle edges", () => {
    const [segment] = getJourneyPath(anchors, true, 160).segments;
    expect(segment?.start).toEqual({ x: anchors[0]?.x, y: anchors[0]?.bottom });
    expect(segment?.end).toEqual({ x: anchors[1]?.x, y: anchors[1]?.top });
  });
});
