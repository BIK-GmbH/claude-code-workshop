import { ALL_SLIDES } from "@/lib/slides";
import { useLang } from "@/lib/i18n";
import { pick } from "@/lib/i18n";

/** Linear print view — all slides, no chrome. Used by browser print + Playwright PDF export. */
export function Print() {
  const [lang] = useLang();
  return (
    <div className="bg-white text-black">
      {ALL_SLIDES.map((s) => (
        <article
          key={s.id}
          className="slide-page max-w-4xl mx-auto px-10 py-12 print:py-0"
        >
          <div className="text-xs font-mono mb-1 text-gray-500">
            {s.id}
          </div>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: "var(--bik-blue)" }}>
            {pick(s.title, lang)}
          </h1>
          <p className="text-gray-600">
            {lang === "de"
              ? "(Inhalt folgt — Phase 4/5)"
              : "(Content TBD — Phase 4/5)"}
          </p>
        </article>
      ))}
    </div>
  );
}
