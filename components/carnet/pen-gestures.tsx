import type { ReactNode } from "react";

export function PenStrike({ children }: { children: ReactNode }) {
  return (
    <span className="pen-strike">
      <span>{children}</span>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 14 C 30 10, 68 17, 96 11" />
      </svg>
    </span>
  );
}

export function PenCircle({ children }: { children: ReactNode }) {
  return (
    <span className="pen-circle">
      <span>{children}</span>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M10 24 C 6 8, 90 2, 95 18 C 99 34, 20 40, 6 22" />
      </svg>
    </span>
  );
}
