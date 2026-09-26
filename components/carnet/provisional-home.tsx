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

export function ProvisionalHome({
  dictionary,
  locale,
}: {
  dictionary: Dictionary;
  locale: Locale;
}) {
  return (
    <main className="welcome-shell">
      <section className="welcome-hero">
        <article className="welcome-page welcome-page--hero">
          <header className="welcome-header">
            <Logo label={dictionary.brand} />
            <nav className="welcome-header__actions">
              <LanguageSwitch dictionary={dictionary} locale={locale} />
              <Link className="quiet-link" href="/sign-in">
                {dictionary.navigation.signIn}
              </Link>
            </nav>
          </header>

          <div className="welcome-layout">
            <div className="welcome-copy">
              <Tape>{dictionary.welcome.eyebrow}</Tape>
              <h1 className="welcome-title">
                {dictionary.welcome.lead}{" "}
                <Highlight>{dictionary.welcome.highlight}</Highlight>
              </h1>
              <p className="welcome-description">{dictionary.welcome.description}</p>
              <Note>{dictionary.welcome.accountNote}</Note>
            </div>

            <div className="hero-visual">
              <div className="hero-card-stack">
                <div className="hero-card hero-card--back">
                  <LessonPreviewCard copy={dictionary.welcome.lessonPreview} />
                </div>
                <div className="hero-front-group">
                  <div className="hero-card hero-card--front">
                    <CardTrueFalse copy={dictionary.welcome.preview} />
                  </div>
                  <div className="welcome-callout">
                    <Note small>{dictionary.welcome.arrowNote}</Note>
                    <HandDrawnArrow direction="up" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-hero__foot">
            <LandingScrollHint>{dictionary.welcome.scrollNote}</LandingScrollHint>
          </div>
        </article>
      </section>

      <article className="welcome-page welcome-page--content">
        <ThemeWall copy={dictionary.welcome.themeWall} />
        <HowItWorks copy={dictionary.welcome.howItWorks} />
        <footer className="welcome-footer">
          <Logo label={dictionary.brand} />
          <span>{dictionary.welcome.footer.copyright}</span>
        </footer>
      </article>
    </main>
  );
}
