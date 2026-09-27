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
import { getJourneyPath } from "@/lib/design/journey-path";
import layoutStyles from "./how-it-works.module.css";
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
      const box =
        number.querySelector<SVGGraphicsElement>("path")?.getBoundingClientRect() ??
        number.getBoundingClientRect();
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
    const { d } = getJourneyPath(points, vertical, bandBox.height);

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

        <ol className={clsx(styles["how-it-works__steps"], layoutStyles.steps)}>
          <li className={styles["how-step"]} data-testid="how-step">
            <div className={styles["how-step__number"]} data-testid="how-step-circle">
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-1"
                variant="round"
              >
                1
              </PenCircle>
            </div>
            <h3 data-testid="how-step-title">{copy.interests.title}</h3>
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

          <li className={styles["how-step"]} data-testid="how-step">
            <div className={styles["how-step__number"]} data-testid="how-step-circle">
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-2"
                variant="round"
              >
                2
              </PenCircle>
            </div>
            <h3 data-testid="how-step-title">{copy.choice.title}</h3>
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

          <li className={styles["how-step"]} data-testid="how-step">
            <div className={styles["how-step__number"]} data-testid="how-step-circle">
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-3"
                variant="round"
              >
                3
              </PenCircle>
            </div>
            <h3 data-testid="how-step-title">{copy.lesson.title}</h3>
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

          <li className={styles["how-step"]} data-testid="how-step">
            <div className={styles["how-step__number"]} data-testid="how-step-circle">
              <PenCircle
                className={styles["step-number-circle"]}
                id="dictionary:welcome:how-it-works:step-4"
                variant="round"
              >
                4
              </PenCircle>
            </div>
            <h3 data-testid="how-step-title">{copy.review.title}</h3>
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
