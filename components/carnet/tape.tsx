import type { ReactNode } from "react";
import clsx from "clsx";
import { getImperfection } from "@/lib/design/imperfections";
import { themeColors, type ThemeTone } from "@/lib/design/theme-colors";
import styles from "@/components/carnet/tape.module.css";

export type TapeTone = ThemeTone;

export function isTapeTone(value: string): value is TapeTone {
  return themeColors.some(({ tone }) => tone === value);
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
