import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "@/components/carnet/drawings.module.css";

type ArrowDirection = "down" | "right" | "up";
type CircleVariant = "loose" | "round";
type StrikeVariant = "double" | "single";
type CheckVariant = "compact" | "long";
type LoopDirection = "left" | "right";
type UnderlineTone = "butter" | "lavender" | "sky";

const arrows: Record<ArrowDirection, { paths: readonly string[]; viewBox: string }> = {
  down: {
    paths: [
      "M30 4 C10 8, 6 26, 14 38 C20 48, 18 58, 12 64",
      "M6 56 L12 65 L20 58",
    ],
    viewBox: "0 0 44 70",
  },
  right: {
    paths: ["M4 25 C34 8, 72 30, 108 15", "M96 10 L110 15 L102 27"],
    viewBox: "0 0 120 40",
  },
  up: {
    paths: ["M3 46 C22 48, 40 36, 48 10", "M40 14 L49 7 L53 18"],
    viewBox: "0 0 56 52",
  },
};

const circles: Record<CircleVariant, string> = {
  loose: "M10 24 C6 8, 90 2, 95 18 C99 34, 20 40, 6 22",
  round: "M8 21 C8 5, 88 3, 94 18 C99 34, 18 38, 7 22",
};

const checks: Record<CheckVariant, string> = {
  compact: "M4 12 C8 15, 9 18, 11 19 C14 12, 17 7, 21 4",
  long: "M2 10 C5 12, 7 15, 9 17 C13 11, 17 6, 22 2",
};

export function HandDrawnArrow({
  className,
  direction = "right",
}: {
  className?: string;
  direction?: ArrowDirection;
}) {
  const arrow = arrows[direction];

  return (
    <span
      className={clsx(styles.arrow, styles[`arrow--${direction}`], className)}
      aria-hidden="true"
      data-hand-arrow
    >
      <svg viewBox={arrow.viewBox} preserveAspectRatio="xMidYMid meet">
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
  variant = "loose",
}: {
  children: ReactNode;
  className?: string;
  variant?: CircleVariant;
}) {
  return (
    <span className={clsx(styles.gesture, styles.circle, className)}>
      <span>{children}</span>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d={circles[variant]} />
      </svg>
    </span>
  );
}

export function PenStrike({
  children,
  className,
  variant = "single",
}: {
  children: ReactNode;
  className?: string;
  variant?: StrikeVariant;
}) {
  const paths =
    variant === "double"
      ? ["M4 11 C30 8, 68 14, 96 9", "M5 16 C34 12, 70 19, 95 14"]
      : ["M4 14 C30 10, 68 17, 96 11"];

  return (
    <span className={clsx(styles.gesture, styles.strike, className)}>
      <span>{children}</span>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path) => (
          <path key={path} pathLength="1" d={path} />
        ))}
      </svg>
    </span>
  );
}

export function CheckMark({
  className,
  variant = "compact",
}: {
  className?: string;
  variant?: CheckVariant;
}) {
  return (
    <svg
      className={clsx(styles.check, className)}
      viewBox={variant === "long" ? "0 0 24 20" : "0 0 24 24"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path pathLength="1" d={checks[variant]} />
    </svg>
  );
}

export function HandDrawnLoop({
  className,
  direction = "left",
}: {
  className?: string;
  direction?: LoopDirection;
}) {
  return (
    <svg
      className={clsx(styles.loop, direction === "right" && styles["loop--right"], className)}
      viewBox="0 0 48 32"
      aria-hidden="true"
    >
      <path pathLength="1" d="M6 19 C9 5, 35 4, 40 16 C43 25, 31 29, 22 25" />
      <path pathLength="1" d="M27 21 L21 25 L27 29" />
    </svg>
  );
}

export function MarkerUnderline({
  className,
  tone = "butter",
}: {
  className?: string;
  tone?: UnderlineTone;
}) {
  return (
    <svg
      className={clsx(styles.underline, styles[`underline--${tone}`], className)}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path pathLength="1" d="M3 5 C27 2, 67 7, 97 3" />
    </svg>
  );
}

export function LoadingStroke({ label }: { label: string }) {
  return (
    <span className={styles.loading} role="status">
      <span className={styles["visually-hidden"]}>{label}</span>
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength="1" d="M3 9 C25 4, 68 13, 97 6" />
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
