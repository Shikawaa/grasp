import Link from "next/link";
import { CardTrueFalse } from "@/components/carnet/card-true-false";
import { HandDrawnArrow } from "@/components/carnet/hand-drawn-arrow";
import { Highlight } from "@/components/carnet/highlight";
import { HowItWorks } from "@/components/carnet/how-it-works";
import { LandingScrollHint } from "@/components/carnet/landing-scroll-hint";
import { LessonPreviewCard } from "@/components/carnet/lesson-preview-card";
import { Logo } from "@/components/carnet/logo";
import { Note } from "@/components/carnet/note";
import { Tape } from "@/components/carnet/tape";
import { ThemeWall } from "@/components/carnet/theme-wall";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSwitch } from "@/components/carnet/language-switch";
import styles from "@/styles/components.module.css";

export function ProvisionalHome({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <main className={styles["welcome-shell"]}>
      <section className={styles["welcome-hero"]} data-testid="welcome-hero">
        <article className={`${styles["welcome-page"]} ${styles["welcome-page--hero"]}`}>
          <header className={styles["welcome-header"]}>
            <Logo label={dictionary.brand} />
            <nav className={styles["welcome-header__actions"]}>
              <LanguageSwitch dictionary={dictionary} locale={locale} />
              <Link className={styles["quiet-link"]} href="/sign-in">
                {dictionary.navigation.signIn}
              </Link>
            </nav>
          </header>

          <div className={styles["welcome-layout"]}>
            <div className={styles["welcome-copy"]}>
              <Tape>{dictionary.welcome.eyebrow}</Tape>
              <h1 className={styles["welcome-title"]}>
                {dictionary.welcome.lead}{" "}
                <Highlight>{dictionary.welcome.highlight}</Highlight>
              </h1>
              <p className={styles["welcome-description"]} data-testid="welcome-description">
                {dictionary.welcome.description}
              </p>
              <Note>{dictionary.welcome.accountNote}</Note>
            </div>

            <div className={styles["hero-visual"]}>
              <div className={styles["hero-card-stack"]}>
                <div
                  className={`${styles["hero-card"]} ${styles["hero-card--back"]}`}
                  data-testid="hero-card-back"
                >
                  <LessonPreviewCard copy={dictionary.welcome.lessonPreview} />
                </div>
                <div className={styles["hero-front-group"]}>
                  <div
                    className={`${styles["hero-card"]} ${styles["hero-card--front"]}`}
                    data-testid="hero-card-front"
                  >
                    <CardTrueFalse copy={dictionary.welcome.preview} />
                  </div>
                  <div className={styles["welcome-callout"]} data-testid="welcome-callout">
                    <Note small>{dictionary.welcome.arrowNote}</Note>
                    <HandDrawnArrow direction="up" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles["welcome-hero__foot"]}>
            <LandingScrollHint>{dictionary.welcome.scrollNote}</LandingScrollHint>
          </div>
        </article>
      </section>

      <article className={`${styles["welcome-page"]} ${styles["welcome-page--content"]}`}>
        <ThemeWall copy={dictionary.welcome.themeWall} />
        <HowItWorks copy={dictionary.welcome.howItWorks} />
        <footer className={styles["welcome-footer"]}>
          <Logo label={dictionary.brand} />
          <span>{dictionary.welcome.footer.copyright}</span>
        </footer>
      </article>
    </main>
  );
}
