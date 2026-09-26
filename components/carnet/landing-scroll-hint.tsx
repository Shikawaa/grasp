"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { HandDrawnArrow } from "@/components/carnet/hand-drawn-arrow";
import { Note } from "@/components/carnet/note";
import styles from "@/styles/components.module.css";

export function LandingScrollHint({ children }: { children: string }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className={clsx(styles["landing-scroll-hint"], hasScrolled && styles["is-hidden"])}
    >
      <HandDrawnArrow animated direction="down" />
      <Note small>{children}</Note>
    </div>
  );
}
