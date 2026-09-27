import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "@/components/carnet/highlight.module.css";

type HighlightTone = "butter" | "lavender" | "sky";

export function Highlight({
  animated = false,
  children,
  className,
  tone = "butter",
}: {
  animated?: boolean;
  children: ReactNode;
  className?: string;
  tone?: HighlightTone;
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
