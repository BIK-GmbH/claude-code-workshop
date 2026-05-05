import { Link, useParams } from "react-router-dom";
import type { Lang, Theme } from "@/types/slide";
import { t } from "@/lib/i18n";
import { ALL_SLIDES } from "@/lib/slides";

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onOpenPalette: () => void;
}

export function Header({ lang, setLang, theme, setTheme, onOpenPalette }: Props) {
  const params = useParams<{ slideId: string }>();
  const currentId = params.slideId ?? ALL_SLIDES[0].id;
  return (
    <header
      data-workshop-header
      className="flex items-center px-5 border-b shrink-0"
      style={{
        height: "var(--header-height)",
        background: "var(--workshop-accent)",
        color: "white",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="size-7 grid place-items-center rounded font-bold text-sm"
          style={{ background: "rgba(255,255,255,0.18)" }}
          aria-hidden
        >
          B
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Claude Code Workshop</div>
          <div className="text-[11px] opacity-80">BIK GmbH · Augmented Working</div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link
          to={`/p/${currentId}`}
          data-testid="enter-presentation"
          className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded text-xs"
          style={{ background: "rgba(255,255,255,0.14)" }}
          title={lang === "de" ? "Präsentations-Modus" : "Presentation mode"}
        >
          <span>▶</span>
          <span className="hidden sm:inline">{lang === "de" ? "Präsentation" : "Present"}</span>
        </Link>

        <button
          onClick={onOpenPalette}
          data-command-palette
          className="hidden sm:inline-flex items-center gap-2 px-2.5 h-8 rounded text-xs"
          style={{ background: "rgba(255,255,255,0.14)" }}
          title={t("search", lang)}
        >
          <span>{t("search", lang)}</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{ background: "rgba(255,255,255,0.18)" }}>⌘K</kbd>
        </button>

        <div className="flex rounded overflow-hidden text-xs"
          style={{ background: "rgba(255,255,255,0.14)" }}
          role="group"
          aria-label={t("toggleLang", lang)}
        >
          {(["de", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              data-testid={`lang-${l}`}
              aria-pressed={lang === l}
              className="px-2 h-8 uppercase tracking-wider"
              style={
                lang === l
                  ? { background: "rgba(255,255,255,0.28)", fontWeight: 600 }
                  : undefined
              }
            >
              {l}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="theme-toggle"
          className="size-8 grid place-items-center rounded"
          style={{ background: "rgba(255,255,255,0.14)" }}
          title={t("toggleTheme", lang)}
          aria-label={t("toggleTheme", lang)}
        >
          {theme === "dark" ? "☾" : "☀"}
        </button>
      </div>
    </header>
  );
}
