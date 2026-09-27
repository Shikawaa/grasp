import type { ReactNode } from "react";
import clsx from "clsx";
import {
  getArrowGeometry,
  getCheckGeometry,
  getCircleGeometry,
  getLoadingStrokeGeometry,
  getLoopGeometry,
  getStrikeGeometry,
  getUnderlineGeometry,
  type ArrowDirection,
  type CheckVariant,
  type CircleVariant,
  type LoopDirection,
  type StrikeVariant,
} from "@/lib/design/drawing-geometry";
import styles from "@/components/carnet/drawings.module.css";

type UnderlineTone = "butter" | "lavender" | "sky";

export function HandDrawnArrow({
  className,
  direction = "right",
  id,
}: {
  className?: string;
  direction?: ArrowDirection;
  id: string;
}) {
  const arrow = getArrowGeometry(id, direction);

  return (
    <span
      className={clsx(styles.arrow, styles[`arrow--${direction}`], className)}
      aria-hidden="true"
      data-hand-arrow
    >
      <svg
        viewBox={`0 0 ${arrow.viewBox.width} ${arrow.viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {arrow.paths.map((path) => (
          <path key={path} pathLength="1" d={path} />
        ))}
      </svg>
    </span>
  );
}

export function PenCircle({
  children,
  className,
  id,
  variant = "loose",
}: {
  children: ReactNode;
  className?: string;
  id: string;
  variant?: CircleVariant;
}) {
  const circle = getCircleGeometry(id, variant);

  return (
    <span
      className={clsx(styles.gesture, styles.circle, className)}
      data-pen-circle
    >
      <span>{children}</span>
      <svg
        viewBox={`0 0 ${circle.viewBox.width} ${circle.viewBox.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path pathLength="1" d={circle.path} />
      </svg>
    </span>
  );
}

export function PenStrike({
  children,
  className,
  id,
  variant = "single",
}: {
  children: ReactNode;
  className?: string;
  id: string;
  variant?: StrikeVariant;
}) {
  const strike = getStrikeGeometry(id, variant);

  return (
    <span className={clsx(styles.gesture, styles.strike, className)}>
      <span>{children}</span>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        {strike.paths.map((path) => (
          <path key={path} pathLength="1" d={path} />
        ))}
      </svg>
    </span>
  );
}

export function CheckMark({
  className,
  id,
  variant = "compact",
}: {
  className?: string;
  id: string;
  variant?: CheckVariant;
}) {
  const check = getCheckGeometry(id, variant);

  return (
    <svg
      className={clsx(styles.check, className)}
      viewBox={`0 0 ${check.viewBox.width} ${check.viewBox.height}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path pathLength="1" d={check.path} />
    </svg>
  );
}

export function HandDrawnLoop({
  className,
  direction = "left",
  id,
}: {
  className?: string;
  direction?: LoopDirection;
  id: string;
}) {
  const loop = getLoopGeometry(id, direction);

  return (
    <svg
      className={clsx(styles.loop, direction === "right" && styles["loop--right"], className)}
      viewBox="0 0 48 32"
      aria-hidden="true"
    >
      {loop.paths.map((path) => (
        <path d={path} key={path} pathLength="1" />
      ))}
    </svg>
  );
}

export function MarkerUnderline({
  className,
  id,
  tone = "butter",
}: {
  className?: string;
  id: string;
  tone?: UnderlineTone;
}) {
  const underline = getUnderlineGeometry(id);

  return (
    <svg
      className={clsx(styles.underline, styles[`underline--${tone}`], className)}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path pathLength="1" d={underline.path} />
    </svg>
  );
}

export function LoadingStroke({
  id,
  label,
  tone = "ink",
}: {
  id: string;
  label: string;
  tone?: "ink" | "on-ink";
}) {
  const loading = getLoadingStrokeGeometry(id);

  return (
    <span
      className={clsx(styles.loading, styles[`loading--${tone}`])}
      role="status"
    >
      <span className={styles["visually-hidden"]}>{label}</span>
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d={loading.path} />
      </svg>
    </span>
  );
}

export function JourneyPath({
  className,
  clipId,
  d,
  height,
  revealClassName,
  width,
}: {
  className?: string;
  clipId: string;
  d: string;
  height: number;
  revealClassName?: string;
  width: number;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect className={revealClassName} width={width} height={height} />
        </clipPath>
      </defs>
      <path clipPath={`url(#${clipId})`} d={d} />
    </svg>
  );
}
