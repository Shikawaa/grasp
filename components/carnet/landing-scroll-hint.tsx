"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { HandDrawnArrow } from "@/components/carnet/hand-drawn-arrow";
import { Note } from "@/components/carnet/note";

export function LandingScrollHint({ children }: { children: string }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolled(window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className={clsx("landing-scroll-hint", hasScrolled && "is-hidden")}>
      <HandDrawnArrow animated direction="down" />
      <Note small>{children}</Note>
    </div>
  );
}
