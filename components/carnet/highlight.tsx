import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "@/styles/components.module.css";

type HighlightTone = "butter" | "lavender" | "sky";

export function Highlight({
  children,
  tone = "butter",
}: {
  children: ReactNode;
  tone?: HighlightTone;
}) {
  return (
    <span
      className={clsx(styles["carnet-highlight"], styles[`carnet-highlight--${tone}`])}
      data-highlight
    >
      {children}
    </span>
  );
}
