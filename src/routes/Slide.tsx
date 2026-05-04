import { useOutletContext } from "react-router-dom";
import type { Lang, SlideMeta } from "@/types/slide";
import { pick, t } from "@/lib/i18n";

interface Ctx {
  lang: Lang;
  current: SlideMeta;
}

/** Phase-1 stub. Phase 2 swaps this for an MDX-driven SlideRenderer. */
export function Slide() {
  const { lang, current } = useOutletContext<Ctx>();
  const isPresenter = window.location.hash.includes("presenter=1");

  return (
    <article className="slide-page max-w-4xl mx-auto px-12 py-16">
      <header className="mb-8">
        <div
          className="text-xs font-mono mb-2"
          style={{ color: "var(--fg-muted)" }}
        >
          {current.id} · {t("module", lang)} {current.module === 99 ? "Anhang" : current.module}
        </div>
        <h1
          className="text-4xl font-semibold leading-tight"
          style={{ color: "var(--workshop-accent)" }}
        >
          {pick(current.title, lang)}
        </h1>
      </header>

      <div
        className="prose prose-slate max-w-none"
        style={{ color: "var(--fg)" }}
      >
        <p style={{ color: "var(--fg-muted)" }}>
          {lang === "de"
            ? "Inhalte folgen in Phase 4/5. Diese Seite dient aktuell nur als Layout-Stub für Navigation, Theme und Print."
            : "Content lands in Phase 4/5. This page is currently a stub for navigation, theme and print testing."}
        </p>
      </div>

      {isPresenter && (
        <aside
          className="mt-10 border-t pt-4 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
        >
          <strong>{t("speakerNotes", lang)}:</strong>{" "}
          {lang === "de"
            ? "(Hier erscheinen die Redner-Notizen aus dem MDX-Frontmatter.)"
            : "(Speaker notes from MDX frontmatter will appear here.)"}
        </aside>
      )}
    </article>
  );
}
