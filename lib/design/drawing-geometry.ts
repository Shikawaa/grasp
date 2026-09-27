import { getImperfection } from "@/lib/design/imperfections";

export type DrawingPoint = Readonly<{ x: number; y: number }>;

type CubicCurve = Readonly<{
  controlOne: DrawingPoint;
  controlTwo: DrawingPoint;
  end: DrawingPoint;
  start: DrawingPoint;
}>;

type DrawingBounds = Readonly<{
  bottom: number;
  left: number;
  right: number;
  top: number;
}>;

export type LineSegment = Readonly<{
  end: DrawingPoint;
  start: DrawingPoint;
}>;

const point = (x: number, y: number): DrawingPoint => ({ x, y });
const printable = (value: number) => Number(value.toFixed(2));

function sampler(identifier: string) {
  const samples = getImperfection(identifier).samples;
  return (index: number, amplitude: number): number => {
    const value = samples[index % 16] ?? 0;
    return printable(value * amplitude);
  };
}

function cubicPath(curve: CubicCurve): string {
  const { start, controlOne, controlTwo, end } = curve;
  return `M${start.x} ${start.y} C${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${end.x} ${end.y}`;
}

function cubicSegment(curve: CubicCurve): string {
  const { controlOne, controlTwo, end } = curve;
  return `C${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${end.x} ${end.y}`;
}

function polylinePath(points: readonly DrawingPoint[]): string {
  return points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
    .join(" ");
}

export type ArrowDirection = "down" | "right" | "up";

export function getArrowGeometry(identifier: string, direction: ArrowDirection) {
  const sample = sampler(identifier);
  if (direction === "right") {
    const tip = point(110, 16 + sample(0, 0.8));
    const shaft: CubicCurve = {
      start: point(4, 24 + sample(1, 1)),
      controlOne: point(34, 9 + sample(2, 1)),
      controlTwo: point(74, 29 + sample(3, 1)),
      end: tip,
    };
    const head = [
      point(97, 10 + sample(4, 0.8)),
      tip,
      point(102, 27 + sample(5, 0.8)),
    ] as const;
    return {
      direction,
      head,
      paths: [cubicPath(shaft), polylinePath(head)] as const,
      shaft,
      viewBox: { height: 40, width: 120 },
    };
  }

  if (direction === "up") {
    const tip = point(49 + sample(0, 0.5), 7);
    const shaft: CubicCurve = {
      start: point(3, 46 + sample(1, 0.8)),
      controlOne: point(22 + sample(2, 0.8), 48),
      controlTwo: point(40 + sample(3, 0.8), 34),
      end: tip,
    };
    const head = [
      point(40 + sample(4, 0.5), 14),
      tip,
      point(53 + sample(5, 0.5), 18),
    ] as const;
    return {
      direction,
      head,
      paths: [cubicPath(shaft), polylinePath(head)] as const,
      shaft,
      viewBox: { height: 52, width: 56 },
    };
  }

  const tip = point(12 + sample(0, 0.5), 65);
  const shaft: CubicCurve = {
    start: point(30, 4),
    controlOne: point(10 + sample(1, 0.8), 8),
    controlTwo: point(6 + sample(2, 0.8), 27),
    end: tip,
  };
  const head = [
    point(6 + sample(3, 0.5), 56),
    tip,
    point(20 + sample(4, 0.5), 58),
  ] as const;
  return {
    direction,
    head,
    paths: [cubicPath(shaft), polylinePath(head)] as const,
    shaft,
    viewBox: { height: 70, width: 44 },
  };
}

export type CircleVariant = "loose" | "round";

export function getCircleGeometry(identifier: string, variant: CircleVariant) {
  const sample = sampler(identifier);
  const roundInset = variant === "round" ? 1 : 0;
  const bounds: DrawingBounds = {
    bottom: 47.7 + sample(0, 0.2),
    left: 2 + roundInset + sample(1, 0.4),
    right: 98 - roundInset + sample(2, 0.4),
    top: 0.3 + sample(3, 0.2),
  };
  const middle = 24 + sample(4, 0.6);
  const upper: CubicCurve = {
    start: point(bounds.left, middle + 3),
    controlOne: point(bounds.left, bounds.top + 7),
    controlTwo: point(bounds.right - 8, bounds.top - 1),
    end: point(bounds.right, middle - 2),
  };
  const lowerRight: CubicCurve = {
    start: upper.end,
    controlOne: point(bounds.right + 1, bounds.bottom - 8),
    controlTwo: point(bounds.right - 15, bounds.bottom),
    end: point(50, bounds.bottom),
  };
  const lowerLeft: CubicCurve = {
    start: lowerRight.end,
    controlOne: point(bounds.left + 15, bounds.bottom),
    controlTwo: point(bounds.left, bounds.bottom - 7),
    end: upper.start,
  };
  const overlap: CubicCurve = {
    start: lowerLeft.end,
    controlOne: point(bounds.left, middle - 2),
    controlTwo: point(bounds.left + 1, middle - 5),
    end: point(bounds.left + 3, middle - 6),
  };
  const path = [
    cubicPath(upper),
    cubicSegment(lowerRight),
    cubicSegment(lowerLeft),
    cubicSegment(overlap),
  ].join(" ");

  return {
    bounds,
    curves: { lowerLeft, lowerRight, overlap, upper },
    end: overlap.end,
    path,
    safeTextBounds: { bottom: 37, left: 10, right: 90, top: 11 } satisfies DrawingBounds,
    start: upper.start,
    viewBox: { height: 48, width: 100 },
  };
}

export type CheckVariant = "compact" | "long";

export function getCheckGeometry(identifier: string, variant: CheckVariant) {
  const sample = sampler(identifier);
  const long = variant === "long";
  const points = [
    point(long ? 2 : 4, (long ? 10 : 12) + sample(0, 0.7)),
    point(long ? 9 : 11, (long ? 17 : 19) + sample(1, 0.7)),
    point(long ? 22 : 21, (long ? 2 : 4) + sample(2, 0.7)),
  ] as const;
  return {
    path: `M${points[0].x} ${points[0].y} C${points[0].x + 3} ${points[0].y + 2}, ${points[1].x - 2} ${points[1].y - 1}, ${points[1].x} ${points[1].y} C${points[1].x + 4} ${points[1].y - 7}, ${points[2].x - 4} ${points[2].y + 4}, ${points[2].x} ${points[2].y}`,
    points,
    viewBox: { height: long ? 20 : 24, width: 24 },
  };
}

export type StrikeVariant = "double" | "single";

export function getStrikeGeometry(identifier: string, variant: StrikeVariant) {
  const sample = sampler(identifier);
  const upper: CubicCurve = {
    start: point(4, 11 + sample(0, 0.7)),
    controlOne: point(30, 8 + sample(1, 0.7)),
    controlTwo: point(68, 14 + sample(2, 0.7)),
    end: point(96, 10 + sample(3, 0.7)),
  };
  const curves = variant === "double"
    ? [
        upper,
        {
          start: point(5, 16 + sample(4, 0.5)),
          controlOne: point(34, 13 + sample(5, 0.5)),
          controlTwo: point(70, 19 + sample(6, 0.5)),
          end: point(95, 15 + sample(7, 0.5)),
        },
      ]
    : [upper];
  return { curves, paths: curves.map(cubicPath), viewBox: { height: 24, width: 100 } };
}

export type LoopDirection = "left" | "right";

export function getLoopGeometry(identifier: string, direction: LoopDirection) {
  const sample = sampler(identifier);
  const body: CubicCurve = {
    start: point(6, 19 + sample(0, 0.8)),
    controlOne: point(9 + sample(1, 0.8), 5),
    controlTwo: point(35 + sample(2, 0.8), 4),
    end: point(40, 16 + sample(3, 0.8)),
  };
  const returnCurve: CubicCurve = {
    start: body.end,
    controlOne: point(43, 25 + sample(4, 0.5)),
    controlTwo: point(31, 29 + sample(5, 0.5)),
    end: point(22, 25 + sample(6, 0.5)),
  };
  const head = [
    point(27, 21 + sample(7, 0.4)),
    returnCurve.end,
    point(27, 29 + sample(8, 0.4)),
  ] as const;
  return {
    body,
    direction,
    head,
    paths: [`${cubicPath(body)} ${cubicSegment(returnCurve)}`, polylinePath(head)] as const,
    returnCurve,
    viewBox: { height: 32, width: 48 },
  };
}

export function getUnderlineGeometry(identifier: string) {
  const sample = sampler(identifier);
  const curve: CubicCurve = {
    start: point(3, 5 + sample(0, 0.5)),
    controlOne: point(27, 2 + sample(1, 0.5)),
    controlTwo: point(67, 7 + sample(2, 0.5)),
    end: point(97, 3 + sample(3, 0.5)),
  };
  return { curve, path: cubicPath(curve), viewBox: { height: 8, width: 100 } };
}

export function getLoadingStrokeGeometry(identifier: string) {
  const sample = sampler(identifier);
  const curve: CubicCurve = {
    start: point(3, 9 + sample(0, 0.7)),
    controlOne: point(25, 4 + sample(1, 0.7)),
    controlTwo: point(68, 13 + sample(2, 0.7)),
    end: point(97, 6 + sample(3, 0.7)),
  };
  return { curve, path: cubicPath(curve), viewBox: { height: 16, width: 100 } };
}

export type TallyGroup = Readonly<{
  diagonal?: LineSegment;
  verticals: readonly LineSegment[];
}>;

export function getTallyGeometry(identifier: string, count: number) {
  const sample = sampler(identifier);
  const safeCount = Math.max(0, Math.floor(count));
  const spacing = 8;
  const groupStep = 44;
  const height = 32;
  const groupCount = Math.ceil(safeCount / 5);
  const groups = Array.from({ length: groupCount }, (_, groupIndex): TallyGroup => {
    const countInGroup = Math.min(5, safeCount - groupIndex * 5);
    const verticalCount = countInGroup === 5 ? 4 : countInGroup;
    const groupStart = 7 + groupIndex * groupStep;
    const verticals = Array.from({ length: verticalCount }, (_, markIndex): LineSegment => {
      const sampleIndex = (groupIndex * 5 + markIndex) % 16;
      const x = groupStart + markIndex * spacing + sample(sampleIndex, 0.35);
      return {
        start: point(x, 4 + sample(sampleIndex + 5, 0.6)),
        end: point(x + sample(sampleIndex + 9, 0.25), 28 + sample(sampleIndex + 12, 0.6)),
      };
    });
    if (countInGroup !== 5) return { verticals };

    const first = verticals[0];
    const fourth = verticals[3];
    if (!first || !fourth) throw new Error("A complete tally group requires four stems.");
    return {
      verticals,
      diagonal: {
        start: point(first.start.x - spacing * 0.6, 24 + sample(groupIndex + 2, 0.4)),
        end: point(fourth.start.x + spacing * 0.6, 8 + sample(groupIndex + 7, 0.4)),
      },
    };
  });
  const width = groupCount === 0 ? 1 : 38 + (groupCount - 1) * groupStep;

  return { groups, height, spacing, width };
}
