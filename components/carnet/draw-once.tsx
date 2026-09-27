"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "@/components/carnet/drawings.module.css";

const drawnIds = new Set<string>();

export function DrawOnce({
  children,
  id,
  immediate = false,
}: {
  children: ReactNode;
  id: string;
  immediate?: boolean;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reveal = () => {
      container.dataset.drawn = "true";
      drawnIds.add(id);
    };

    if (immediate) {
      reveal();
      return;
    }

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
  }, [id, immediate]);

  return (
    <span
      className={styles["draw-once"]}
      data-drawn={immediate ? "true" : undefined}
      ref={containerRef}
    >
      {children}
    </span>
  );
}
