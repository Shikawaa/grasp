import type { ReactNode } from "react";
import clsx from "clsx";
import { getImperfection } from "@/lib/design/imperfections";
import styles from "@/components/carnet/tape.module.css";

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

const tapeTones: readonly TapeTone[] = [
  "apricot",
  "brick",
  "butter",
  "glacier",
  "honey",
  "lagoon",
  "lavender",
  "lavender-gray",
  "lemon",
  "mauve",
  "mint",
  "periwinkle",
  "rose",
  "sage",
  "sand",
  "sky",
];

export function isTapeTone(value: string): value is TapeTone {
  return tapeTones.some((tone) => tone === value);
}

export function Tape({
  children,
  className,
  id,
  tone = "butter",
}: {
  children: ReactNode;
  className?: string;
  id: string;
  tone?: TapeTone;
}) {
  const imperfection = getImperfection(id);

  return (
    <span
      className={clsx(
        styles.tape,
        styles[`tape--${tone}`],
        styles[`angle--${imperfection.angle}`],
        styles[`cut--${imperfection.cut}`],
        styles[`length--${imperfection.length}`],
        className,
      )}
      data-cut={imperfection.cut}
      data-length={imperfection.length}
    >
      {children}
    </span>
  );
}
