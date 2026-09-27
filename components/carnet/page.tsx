import { forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import type { TapeTone } from "@/components/carnet/tape";
import { getImperfection } from "@/lib/design/imperfections";
import styles from "@/components/carnet/page.module.css";

type PageProps = {
  children: ReactNode;
  className?: string;
  color?: TapeTone;
  grid?: "desktop" | "mobile" | "responsive";
  id?: string;
};

export const Page = forwardRef<HTMLElement, PageProps>(
  function Page(
    { children, className, color = "butter", grid = "responsive", id },
    ref,
  ) {
    const imperfection = id ? getImperfection(id) : null;

    return (
      <article
        className={clsx(
          styles.page,
          styles[`page--${color}`],
          styles[`grid--${grid}`],
          imperfection && styles[`tilt--${imperfection.angle}`],
          className,
        )}
        ref={ref}
      >
        {children}
      </article>
    );
  },
);
