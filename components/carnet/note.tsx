import type { ReactNode } from "react";
import clsx from "clsx";

export function Note({ children, small = false }: { children: ReactNode; small?: boolean }) {
  return <p className={clsx("carnet-note", small && "carnet-note--small")}>{children}</p>;
}
