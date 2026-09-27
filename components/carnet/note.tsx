import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "@/components/carnet/note.module.css";

export function Note({
  children,
  className,
  small = false,
}: {
  children: ReactNode;
  className?: string;
  small?: boolean;
}) {
  return (
    <p className={clsx(styles.note, small && styles["note--small"], className)}>
      {children}
    </p>
  );
}
