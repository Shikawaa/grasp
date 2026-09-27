"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  CheckMark,
  HandDrawnLoop,
  JourneyPath,
  PenCircle,
} from "@/components/carnet/drawings";
import { Highlight } from "@/components/carnet/highlight";
import { MemoryMeter } from "@/components/carnet/memory-meter";
import { Note } from "@/components/carnet/note";
import { Page } from "@/components/carnet/page";
import { Tape } from "@/components/carnet/tape";
import styles from "@/styles/components.module.css";

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
    memoryLabel: string;
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
    const numbers = Array.from(
      band.querySelectorAll<HTMLElement>(`.${styles["how-step__number"]}`),
    );
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
      className={clsx(styles["how-it-works"], isDrawn && styles["is-drawn"])}
      aria-labelledby="how-it-works-title"
      data-drawn={isDrawn}
      ref={sectionRef}
    >
      <div className={styles["section-heading"]}>
        <h2 id="how-it-works-title">{copy.title}</h2>
        <Note>{copy.note}</Note>
      </div>

      <Page className={styles["how-it-works__page"]} ref={bandRef}>
        {geometry.d ? (
          <JourneyPath
            className={clsx(
              styles["journey-path"],
              geometry.vertical && styles["journey-path--vertical"],
            )}
            clipId="journey-path-reveal"
            d={geometry.d}
            height={geometry.height}
            revealClassName={styles["journey-path__reveal"]}
            width={geometry.width}
          />
        ) : null}

        <ol className={styles["how-it-works__steps"]}>
          <li className={styles["how-step"]}>
            <div className={styles["how-step__number"]}>
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-1"
              >
                1
              </PenCircle>
            </div>
            <h3>{copy.interests.title}</h3>
            <div
              className={`${styles["how-step__object"]} ${styles["how-step__object--interests"]}`}
            >
              <div className={styles["mini-interests"]}>
                <Highlight tone="lavender">{copy.interests.history}</Highlight>
                <Highlight tone="sky">{copy.interests.psychology}</Highlight>
                <span>{copy.interests.arts}</span>
              </div>
              <Note className={styles["mini-interests-note"]} small>
                {copy.interests.examples}
              </Note>
            </div>
          </li>

          <li className={styles["how-step"]}>
            <div className={styles["how-step__number"]}>
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-2"
              >
                2
              </PenCircle>
            </div>
            <h3>{copy.choice.title}</h3>
            <div className={`${styles["how-step__object"]} ${styles["mini-proposals"]}`}>
              <span className={`${styles["mini-proposal"]} ${styles["is-muted"]}`}>
                <Tape
                  className={styles["mini-tape"]}
                  id="topic:proposal-sakoku:label"
                  tone="lavender"
                >
                  {copy.choice.alternativeOne}
                </Tape>
              </span>
              <span className={`${styles["mini-proposal"]} ${styles["is-chosen"]}`}>
                <Tape
                  className={styles["mini-tape"]}
                  id="proposal:proposal-procrastination"
                  tone="sky"
                >
                  <span>{copy.choice.chosen}</span>
                  <CheckMark
                    className={styles["mini-check"]}
                    id="dictionary:welcome:how-it-works:chosen-topic"
                    variant="long"
                  />
                </Tape>
              </span>
              <span className={`${styles["mini-proposal"]} ${styles["is-muted"]}`}>
                <Tape
                  className={styles["mini-tape"]}
                  id="tape:proposal-currents-war"
                  tone="sage"
                >
                  {copy.choice.alternativeTwo}
                </Tape>
              </span>
            </div>
          </li>

          <li className={styles["how-step"]}>
            <div className={styles["how-step__number"]}>
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-3"
              >
                3
              </PenCircle>
            </div>
            <h3>{copy.lesson.title}</h3>
            <div
              className={`${styles["how-step__object"]} ${styles["how-step__object--lesson"]}`}
            >
              <p className={styles["mini-meta"]}>{copy.lesson.meta}</p>
              <p className={styles["mini-lesson"]}>
                {copy.lesson.sentenceBefore} {" "}
                <Highlight tone="sky">{copy.lesson.sentenceHighlight}</Highlight>
              </p>
            </div>
          </li>

          <li className={styles["how-step"]}>
            <div className={styles["how-step__number"]}>
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-4"
              >
                4
              </PenCircle>
            </div>
            <h3>{copy.review.title}</h3>
            <div className={`${styles["how-step__object"]} ${styles["mini-review"]}`}>
              <div className={styles["mini-memory"]}>
                <span>{copy.review.memory}</span>
                <MemoryMeter filled={3} label={copy.review.memoryLabel} />
              </div>
              <div className={styles["mini-tomorrow"]}>
                <Note className={styles["mini-tomorrow-note"]} small>
                  {copy.review.tomorrow}
                </Note>
                <HandDrawnLoop id="dictionary:welcome:how-it-works:tomorrow-loop" />
              </div>
            </div>
          </li>
        </ol>
      </Page>
    </section>
  );
}
