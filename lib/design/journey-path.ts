export type JourneyAnchor = Readonly<{
  bottom: number;
  left: number;
  right: number;
  top: number;
  x: number;
  y: number;
}>;

type JourneyPoint = Readonly<{ x: number; y: number }>;

export type JourneySegment = Readonly<{
  controlOne: JourneyPoint;
  controlTwo: JourneyPoint;
  end: JourneyPoint;
  start: JourneyPoint;
}>;

export function getJourneyPath(
  points: readonly JourneyAnchor[],
  vertical: boolean,
  bandHeight: number,
) {
  const segments = points.slice(0, -1).flatMap<JourneySegment>((point, index) => {
    const next = points[index + 1];
    if (!next) return [];

    if (vertical) {
      const distance = next.top - point.bottom;
      return [{
        controlOne: { x: point.x - distance * 0.18, y: point.bottom + distance * 0.35 },
        controlTwo: { x: next.x + distance * 0.18, y: next.top - distance * 0.35 },
        end: { x: next.x, y: next.top },
        start: { x: point.x, y: point.bottom },
      }];
    }

    const distance = next.left - point.right;
    const bend = Math.min(Math.abs(distance) * 0.18, bandHeight * 0.08);
    const direction = index % 2 === 0 ? -1 : 1;
    return [{
      controlOne: { x: point.right + distance * 0.35, y: point.y + bend * direction },
      controlTwo: { x: next.left - distance * 0.35, y: next.y - bend * direction },
      end: { x: next.left, y: next.y },
      start: { x: point.right, y: point.y },
    }];
  });

  return {
    d: segments
      .map(({ controlOne, controlTwo, end, start }) =>
        `M ${start.x} ${start.y} C ${controlOne.x} ${controlOne.y}, ${controlTwo.x} ${controlTwo.y}, ${end.x} ${end.y}`,
      )
      .join(" "),
    segments,
  };
}
