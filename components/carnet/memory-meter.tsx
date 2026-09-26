import clsx from "clsx";
import styles from "@/styles/components.module.css";

export function MemoryMeter({ filled }: { filled: 0 | 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className={styles["memory-meter"]} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          className={clsx(
            styles["memory-meter__segment"],
            index < filled && styles["is-filled"],
          )}
          key={index}
        />
      ))}
    </span>
  );
}
