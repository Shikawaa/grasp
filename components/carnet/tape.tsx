import type { ReactNode } from "react";
import clsx from "clsx";

export type TapeTone =
  | "apricot"
  | "brick"
  | "butter"
  | "glacier"
  | "honey"
  | "lagoon"
  | "lavender"
  | "lavender-gray"
  | "lemon"
  | "mauve"
  | "mint"
  | "periwinkle"
  | "rose"
  | "sage"
  | "sand"
  | "sky";

type TapeSeed = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export function Tape({
  children,
  seed,
  tone = "butter",
}: {
  children: ReactNode;
  seed?: TapeSeed;
  tone?: TapeTone;
}) {
  return (
    <span
      className={clsx(
        "carnet-tape",
        `carnet-tape--${tone}`,
        seed && `carnet-tape--seed-${seed}`,
      )}
    >
      {children}
    </span>
  );
}
