"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Highlight } from "@/components/carnet/highlight";
import { MemoryMeter } from "@/components/carnet/memory-meter";
import { Note } from "@/components/carnet/note";
import { Page } from "@/components/carnet/page";
import { PenCircle } from "@/components/carnet/pen-gestures";
import { Tape } from "@/components/carnet/tape";

export type HowItWorksCopy = {
  title: string;
  note: string;
  interests: {
    title: string;
    history: string;
    psychology: string;
    arts: string;
    examples: string;
  };
  choice: {
    title: string;
    chosen: string;
    alternativeOne: string;
    alternativeTwo: string;
  };
  lesson: {
    title: string;
    meta: string;
    sentenceBefore: string;
    sentenceHighlight: string;
  };
  review: {
    title: string;
    memory: string;
    tomorrow: string;
  };
};

type PathGeometry = {
  d: string;
  height: number;
  vertical: boolean;
  width: number;
};

const emptyGeometry: PathGeometry = {
  d: "",
  height: 1,
  vertical: false,
  width: 1,
};

export function HowItWorks({ copy }: { copy: HowItWorksCopy }) {
  const bandRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [geometry, setGeometry] = useState<PathGeometry>(emptyGeometry);
  const [isDrawn, setIsDrawn] = useState(false);

  const buildPath = useCallback(() => {
    const band = bandRef.current;
    if (!band) return;

    const bandBox = band.getBoundingClientRect();
    const numbers = Array.from(band.querySelectorAll<HTMLElement>(".how-step__number"));
    if (numbers.length < 2) return;

    const points = numbers.map((number) => {
      const box = number.getBoundingClientRect();
      return {
        bottom: box.bottom - bandBox.top,
        left: box.left - bandBox.left,
        right: box.right - bandBox.left,
        top: box.top - bandBox.top,
        x: box.left - bandBox.left + box.width / 2,
        y: box.top - bandBox.top + box.height / 2,
      };
    });
    const vertical = window.matchMedia("(max-width: 63.999rem)").matches;
    const d = points.slice(0, -1).reduce((path, point, index) => {
      const next = points[index + 1];
      if (!next) return path;

      if (vertical) {
        const startY = point.bottom;
        const endY = next.top;
        const distance = endY - startY;
        return `${path} M ${point.x} ${startY} C ${point.x - distance * 0.18} ${
          startY + distance * 0.35
        }, ${next.x + distance * 0.18} ${endY - distance * 0.35}, ${next.x} ${endY}`;
      }

      const startX = point.right;
      const endX = next.left;
      const distance = endX - startX;
      const bend = Math.min(Math.abs(distance) * 0.18, bandBox.height * 0.08);
      const direction = index % 2 === 0 ? -1 : 1;
      return `${path} M ${startX} ${point.y} C ${startX + distance * 0.35} ${
        point.y + bend * direction
      }, ${endX - distance * 0.35} ${next.y - bend * direction}, ${endX} ${next.y}`;
    }, "");

    setGeometry({
      d,
      height: Math.max(bandBox.height, 1),
      vertical,
      width: Math.max(bandBox.width, 1),
    });
  }, []);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    buildPath();
    const observer = new ResizeObserver(buildPath);
    observer.observe(band);
    window.addEventListener("resize", buildPath);
    void document.fonts.ready.then(buildPath);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", buildPath);
    };
  }, [buildPath]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={clsx("how-it-works", isDrawn && "is-drawn")}
      aria-labelledby="how-it-works-title"
      ref={sectionRef}
    >
      <div className="section-heading">
        <h2 id="how-it-works-title">{copy.title}</h2>
        <Note>{copy.note}</Note>
      </div>

      <Page className="how-it-works__page" ref={bandRef}>
        {geometry.d ? (
          <svg
            className={clsx("journey-path", geometry.vertical && "journey-path--vertical")}
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="journey-path-reveal">
                <rect
                  className="journey-path__reveal"
                  width={geometry.width}
                  height={geometry.height}
                />
              </clipPath>
            </defs>
            <path clipPath="url(#journey-path-reveal)" d={geometry.d} />
          </svg>
        ) : null}

        <ol className="how-it-works__steps">
          <li className="how-step">
            <div className="how-step__number">
              <PenCircle>1</PenCircle>
            </div>
            <h3>{copy.interests.title}</h3>
            <div className="how-step__object how-step__object--interests">
              <div className="mini-interests">
                <Highlight tone="lavender">{copy.interests.history}</Highlight>
                <Highlight tone="sky">{copy.interests.psychology}</Highlight>
                <span>{copy.interests.arts}</span>
              </div>
              <Note small>{copy.interests.examples}</Note>
            </div>
          </li>

          <li className="how-step">
            <div className="how-step__number">
              <PenCircle>2</PenCircle>
            </div>
            <h3>{copy.choice.title}</h3>
            <div className="how-step__object mini-proposals">
              <span className="mini-proposal is-muted">
                <Tape seed={1} tone="lavender">
                  {copy.choice.alternativeOne}
                </Tape>
              </span>
              <span className="mini-proposal is-chosen">
                <Tape seed={2} tone="sky">
                  <span>{copy.choice.chosen}</span>
                  <svg className="mini-check" viewBox="0 0 24 20" aria-hidden="true">
                    <path d="M2 10 C 5 12, 7 15, 9 17 C 13 11, 17 6, 22 2" />
                  </svg>
                </Tape>
              </span>
              <span className="mini-proposal is-muted">
                <Tape seed={3} tone="sage">
                  {copy.choice.alternativeTwo}
                </Tape>
              </span>
            </div>
          </li>

          <li className="how-step">
            <div className="how-step__number">
              <PenCircle>3</PenCircle>
            </div>
            <h3>{copy.lesson.title}</h3>
            <div className="how-step__object how-step__object--lesson">
              <p className="mini-meta">{copy.lesson.meta}</p>
              <p className="mini-lesson">
                {copy.lesson.sentenceBefore} {" "}
                <Highlight tone="sky">{copy.lesson.sentenceHighlight}</Highlight>
              </p>
            </div>
          </li>

          <li className="how-step">
            <div className="how-step__number">
              <PenCircle>4</PenCircle>
            </div>
            <h3>{copy.review.title}</h3>
            <div className="how-step__object mini-review">
              <div className="mini-memory">
                <span>{copy.review.memory}</span>
                <MemoryMeter filled={3} />
              </div>
              <div className="mini-tomorrow">
                <Note small>{copy.review.tomorrow}</Note>
                <svg viewBox="0 0 48 32" aria-hidden="true">
                  <path d="M6 19 C 9 5, 35 4, 40 16 C 43 25, 31 29, 22 25" />
                  <path d="M27 21 L 21 25 L 27 29" />
                </svg>
              </div>
            </div>
          </li>
        </ol>
      </Page>
    </section>
  );
}
