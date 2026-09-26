import type { ReactNode } from "react";
import clsx from "clsx";

type HighlightTone = "butter" | "lavender" | "sky";

export function Highlight({
  children,
  tone = "butter",
}: {
  children: ReactNode;
  tone?: HighlightTone;
}) {
  return <span className={clsx("carnet-highlight", `carnet-highlight--${tone}`)}>{children}</span>;
}
