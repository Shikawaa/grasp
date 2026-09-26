import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "@/styles/components.module.css";

export function Note({ children, small = false }: { children: ReactNode; small?: boolean }) {
  return (
    <p className={clsx(styles["carnet-note"], small && styles["carnet-note--small"])}>
      {children}
    </p>
  );
}
