import { forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "@/styles/components.module.css";

export const Page = forwardRef<HTMLElement, { children: ReactNode; className?: string }>(
  function Page({ children, className }, ref) {
    return (
      <article className={clsx(styles["carnet-page"], className)} ref={ref}>
        {children}
      </article>
    );
  },
);
