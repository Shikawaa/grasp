import type { ReactNode } from "react";
import clsx from "clsx";
import type { TapeTone } from "@/components/carnet/tape";
import styles from "@/components/carnet/highlight.module.css";

export function Highlight({
  animated = false,
  children,
  className,
  tone = "butter",
}: {
  animated?: boolean;
  children: ReactNode;
  className?: string;
  tone?: TapeTone;
}) {
  return (
    <span
      className={clsx(
        styles.highlight,
        styles[`highlight--${tone}`],
        animated && styles.animated,
        className,
      )}
      data-highlight
    >
      {children}
    </span>
  );
}
