import clsx from "clsx";
import styles from "@/styles/components.module.css";

type ArrowDirection = "down" | "right" | "up";

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

export function HandDrawnArrow({
  animated = false,
  direction = "right",
}: {
  animated?: boolean;
  direction?: ArrowDirection;
}) {
  const arrow = arrows[direction];

  return (
    <span
      className={clsx(
        styles["hand-arrow"],
        styles[`hand-arrow--${direction}`],
        animated && styles["hand-arrow--animated"],
      )}
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
