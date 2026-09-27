import { describe, expect, it } from "vitest";
import {
  getArrowGeometry,
  getCheckGeometry,
  getCircleGeometry,
  getLoadingStrokeGeometry,
  getLoopGeometry,
  getStrikeGeometry,
  getTallyGeometry,
  getUnderlineGeometry,
  type DrawingPoint,
  type LineSegment,
} from "@/lib/design/drawing-geometry";

const identifiers = Array.from({ length: 500 }, (_, index) => `lesson:geometry-${index}`);

const distance = (first: DrawingPoint, second: DrawingPoint) =>
  Math.hypot(second.x - first.x, second.y - first.y);

function intersection(first: LineSegment, second: LineSegment): DrawingPoint | null {
  const denominator =
    (first.start.x - first.end.x) * (second.start.y - second.end.y) -
    (first.start.y - first.end.y) * (second.start.x - second.end.x);
  if (Math.abs(denominator) < Number.EPSILON) return null;

  const firstDeterminant = first.start.x * first.end.y - first.start.y * first.end.x;
  const secondDeterminant = second.start.x * second.end.y - second.start.y * second.end.x;
  const x =
    (firstDeterminant * (second.start.x - second.end.x) -
      (first.start.x - first.end.x) * secondDeterminant) /
    denominator;
  const y =
    (firstDeterminant * (second.start.y - second.end.y) -
      (first.start.y - first.end.y) * secondDeterminant) /
    denominator;
  const within = (value: number, start: number, end: number) =>
    value >= Math.min(start, end) - 0.001 && value <= Math.max(start, end) + 0.001;

  return within(x, first.start.x, first.end.x) &&
    within(y, first.start.y, first.end.y) &&
    within(x, second.start.x, second.end.x) &&
    within(y, second.start.y, second.end.y)
    ? { x, y }
    : null;
}

describe("drawing geometry invariants", () => {
  it("keeps arrows attached, bounded, and readable across 500 identifiers", () => {
    for (const identifier of identifiers) {
      for (const direction of ["up", "right", "down"] as const) {
        const geometry = getArrowGeometry(identifier, direction);
        expect(geometry.head[1]).toEqual(geometry.shaft.end);
        expect(distance(geometry.head[0], geometry.head[1])).toBeGreaterThanOrEqual(8);
        expect(distance(geometry.head[0], geometry.head[1])).toBeLessThanOrEqual(18);
        expect(distance(geometry.head[1], geometry.head[2])).toBeGreaterThanOrEqual(8);
        expect(distance(geometry.head[1], geometry.head[2])).toBeLessThanOrEqual(18);
        for (const point of [
          geometry.shaft.start,
          geometry.shaft.controlOne,
          geometry.shaft.controlTwo,
          geometry.shaft.end,
          ...geometry.head,
        ]) {
          expect(point.x).toBeGreaterThanOrEqual(0);
          expect(point.x).toBeLessThanOrEqual(geometry.viewBox.width);
          expect(point.y).toBeGreaterThanOrEqual(0);
          expect(point.y).toBeLessThanOrEqual(geometry.viewBox.height);
        }
      }
    }
  });

  it("keeps pen circles outside accented and descending text boxes with a smooth overlap", () => {
    for (const identifier of identifiers) {
      for (const variant of ["loose", "round"] as const) {
        const { bounds, curves, end, safeTextBounds, start } = getCircleGeometry(
          identifier,
          variant,
        );
        expect(safeTextBounds.left - bounds.left).toBeGreaterThanOrEqual(6);
        expect(bounds.right - safeTextBounds.right).toBeGreaterThanOrEqual(6);
        expect(safeTextBounds.top - bounds.top).toBeGreaterThanOrEqual(7);
        expect(bounds.bottom - safeTextBounds.bottom).toBeGreaterThanOrEqual(7);
        expect(curves.lowerRight.start).toEqual(curves.upper.end);
        expect(curves.lowerLeft.start).toEqual(curves.lowerRight.end);
        expect(curves.overlap.start).toEqual(curves.lowerLeft.end);
        expect(curves.lowerLeft.end).toEqual(curves.upper.start);
        expect(distance(curves.overlap.start, curves.overlap.end)).toBeGreaterThanOrEqual(6);
        expect(distance(start, end)).toBeGreaterThanOrEqual(6);
        expect(distance(start, end)).toBeLessThanOrEqual(10);
      }
    }
  });

  it("keeps check marks unambiguous across 500 identifiers", () => {
    for (const identifier of identifiers) {
      for (const variant of ["compact", "long"] as const) {
        const { points, viewBox } = getCheckGeometry(identifier, variant);
        expect(points[0].x).toBeLessThan(points[1].x);
        expect(points[1].x).toBeLessThan(points[2].x);
        expect(points[1].y).toBeGreaterThan(points[0].y);
        expect(points[1].y).toBeGreaterThan(points[2].y);
        expect(distance(points[0], points[1])).toBeGreaterThanOrEqual(7);
        expect(distance(points[1], points[2])).toBeGreaterThanOrEqual(12);
        expect(points.every(({ x, y }) => x >= 0 && x <= viewBox.width && y >= 0 && y <= viewBox.height)).toBe(true);
      }
    }
  });

  it("keeps strikes centered, spanning the word, and separated", () => {
    for (const identifier of identifiers) {
      for (const variant of ["single", "double"] as const) {
        const { curves } = getStrikeGeometry(identifier, variant);
        expect(curves).toHaveLength(variant === "double" ? 2 : 1);
        for (const curve of curves) {
          expect(curve.start.x).toBeLessThanOrEqual(5);
          expect(curve.end.x).toBeGreaterThanOrEqual(95);
          for (const point of [curve.start, curve.controlOne, curve.controlTwo, curve.end]) {
            expect(point.y).toBeGreaterThanOrEqual(7);
            expect(point.y).toBeLessThanOrEqual(20);
          }
        }
        if (curves[1]) {
          expect(curves[1].start.y - curves[0].start.y).toBeGreaterThanOrEqual(3);
          expect(curves[1].end.y - curves[0].end.y).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });

  it("keeps loops attached and inside their view box", () => {
    for (const identifier of identifiers) {
      for (const direction of ["left", "right"] as const) {
        const geometry = getLoopGeometry(identifier, direction);
        expect(geometry.returnCurve.start).toEqual(geometry.body.end);
        expect(geometry.head[1]).toEqual(geometry.returnCurve.end);
        expect(geometry.body.end.x - geometry.body.start.x).toBeGreaterThanOrEqual(33);
        for (const point of [
          geometry.body.start,
          geometry.body.controlOne,
          geometry.body.controlTwo,
          geometry.body.end,
          geometry.returnCurve.controlOne,
          geometry.returnCurve.controlTwo,
          geometry.returnCurve.end,
          ...geometry.head,
        ]) {
          expect(point.x).toBeGreaterThanOrEqual(0);
          expect(point.x).toBeLessThanOrEqual(geometry.viewBox.width);
          expect(point.y).toBeGreaterThanOrEqual(0);
          expect(point.y).toBeLessThanOrEqual(geometry.viewBox.height);
        }
      }
    }
  });

  it("keeps underlines below a title and across most of its width", () => {
    for (const identifier of identifiers) {
      const { curve } = getUnderlineGeometry(identifier);
      expect(curve.start.x).toBeLessThanOrEqual(4);
      expect(curve.end.x).toBeGreaterThanOrEqual(96);
      for (const point of [curve.start, curve.controlOne, curve.controlTwo, curve.end]) {
        expect(point.y).toBeGreaterThanOrEqual(1);
        expect(point.y).toBeLessThanOrEqual(8);
      }
    }
  });

  it("keeps loading strokes long, centered, and bounded", () => {
    for (const identifier of identifiers) {
      const { curve } = getLoadingStrokeGeometry(identifier);
      expect(curve.start.x).toBeLessThanOrEqual(4);
      expect(curve.end.x).toBeGreaterThanOrEqual(96);
      for (const point of [curve.start, curve.controlOne, curve.controlTwo, curve.end]) {
        expect(point.y).toBeGreaterThanOrEqual(3);
        expect(point.y).toBeLessThanOrEqual(14);
      }
    }
  });

  it("crosses all four stems with the fifth tally mark across 500 identifiers", () => {
    for (const identifier of identifiers) {
      const geometry = getTallyGeometry(identifier, 8);
      const complete = geometry.groups[0];
      const incomplete = geometry.groups[1];
      expect(complete?.verticals).toHaveLength(4);
      expect(complete?.diagonal).toBeDefined();
      expect(incomplete?.verticals).toHaveLength(3);
      expect(incomplete?.diagonal).toBeUndefined();
      if (!complete?.diagonal) throw new Error("Missing complete tally group.");

      const first = complete.verticals[0];
      const fourth = complete.verticals[3];
      if (!first || !fourth || !incomplete?.verticals[0]) throw new Error("Missing tally stems.");
      expect(first.start.x - complete.diagonal.start.x).toBeGreaterThanOrEqual(geometry.spacing / 2);
      expect(complete.diagonal.end.x - fourth.start.x).toBeGreaterThanOrEqual(geometry.spacing / 2);
      expect(complete.diagonal.start.y).toBeGreaterThan(complete.diagonal.end.y);

      for (const [index, stem] of complete.verticals.entries()) {
        expect(distance(stem.start, stem.end)).toBeGreaterThanOrEqual(22.5);
        expect(distance(stem.start, stem.end)).toBeLessThanOrEqual(26);
        expect(Math.abs(stem.end.x - stem.start.x)).toBeLessThanOrEqual(0.25);
        const nextStem = complete.verticals[index + 1];
        if (nextStem) {
          const spacing = nextStem.start.x - stem.start.x;
          expect(spacing).toBeGreaterThanOrEqual(7.3);
          expect(spacing).toBeLessThanOrEqual(8.7);
        }
      }

      for (const stem of complete.verticals) {
        const crossing = intersection(stem, complete.diagonal);
        expect(crossing).not.toBeNull();
        if (!crossing) continue;
        const position = (crossing.y - stem.start.y) / (stem.end.y - stem.start.y);
        expect(position).toBeGreaterThanOrEqual(0.2);
        expect(position).toBeLessThanOrEqual(0.8);
      }

      expect(incomplete.verticals[0].start.x - complete.diagonal.end.x).toBeGreaterThanOrEqual(geometry.spacing);
    }
  });
});
