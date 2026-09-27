"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "@/components/carnet/drawings.module.css";

const drawnIds = new Set<string>();

export function DrawOnce({ children, id }: { children: ReactNode; id: string }) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reveal = () => {
      container.dataset.drawn = "true";
      drawnIds.add(id);
    };

    if (drawnIds.has(id) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [id]);

  return (
    <span className={styles["draw-once"]} ref={containerRef}>
      {children}
    </span>
  );
}
