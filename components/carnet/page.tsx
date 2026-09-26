import { forwardRef, type ReactNode } from "react";
import clsx from "clsx";

export const Page = forwardRef<HTMLElement, { children: ReactNode; className?: string }>(
  function Page({ children, className }, ref) {
    return (
      <article className={clsx("carnet-page", className)} ref={ref}>
        {children}
      </article>
    );
  },
);
