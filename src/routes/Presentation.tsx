import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ALL_SLIDES, findSlide, neighbours } from "@/lib/slides";
import { useLang, t, pick } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useKeymap } from "@/lib/keymap";
import { SlideRenderer } from "@/components/SlideRenderer";

/**
 * Fullscreen presentation mode — one slide at a time, no sidebar/header chrome.
 *
 * Routes:
 *   /p/:slideId            — present this slide
 *   /p/:slideId?notes=1    — show speaker notes overlay
 *
 * Keyboard:
 *   ←/→/J/K/Space/PageUp/PageDown — navigate
 *   Home/End                       — first/last
 *   N                              — toggle speaker notes
 *   F                              — toggle browser fullscreen
 *   Esc                            — exit to sidebar view
 */
export function Presentation() {
  const params = useParams<{ slideId: string }>();
  const nav = useNavigate();
  const [lang] = useLang();
  const [theme, setTheme] = useTheme();
  const current = findSlide(params.slideId ?? "") ?? ALL_SLIDES[0];
  const { prev, next, index, total } = neighbours(current.id);

  // Initialise from URL or from the data-attribute (in case parent set it)
  const [notesOpen, _setNotesOpen] = useState(() => {
    const sp = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    return sp.has("notes") || sp.has("presenter");
  });

  // Wrapper that updates state AND DOM attribute synchronously, so child components
  // (SpeakerNotes via MutationObserver) get a consistent signal on the same tick.
  function setNotesOpen(next: boolean | ((prev: boolean) => boolean)) {
    _setNotesOpen((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      document.documentElement.dataset.presenter = value ? "1" : "0";
      // Mirror to URL hash so deep-link works
      const h = new URL(window.location.href);
      const [path, search = ""] = h.hash.slice(1).split("?");
      const sp = new URLSearchParams(search);
      if (value) {
        sp.set("notes", "1");
        sp.set("presenter", "1");
      } else {
        sp.delete("notes");
        sp.delete("presenter");
      }
      const qs = sp.toString();
      const newHash = `#${path}${qs ? `?${qs}` : ""}`;
      if (newHash !== h.hash) history.replaceState(null, "", newHash);
      return value;
    });
  }

  // On mount + when slide changes, ensure DOM attribute matches state
  useEffect(() => {
    document.documentElement.dataset.presenter = notesOpen ? "1" : "0";
    return () => {
      // when leaving presentation route entirely, reset
      document.documentElement.dataset.presenter = "0";
    };
  }, [notesOpen, current.id]);

  // Esc → back to docs view of same slide.
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        nav(`/s/${current.id}`);
      }
      if (e.key === "n" || e.key === "N") {
        setNotesOpen((o) => !o);
      }
      if (e.key === "t" || e.key === "T") {
        setTheme(theme === "dark" ? "light" : "dark");
      }
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [nav, current.id, theme, setTheme]);

  useKeymap({
    onPrev: () => prev && nav(`/p/${prev.id}`),
    onNext: () => next && nav(`/p/${next.id}`),
    onFirst: () => nav(`/p/${ALL_SLIDES[0].id}`),
    onLast: () => nav(`/p/${ALL_SLIDES[ALL_SLIDES.length - 1].id}`),
    onToggleFullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    },
    onTogglePresenter: () => setNotesOpen((o) => !o),
  });

  return (
    <div
      data-presentation
      className="h-screen w-screen flex flex-col"
      style={{
        background: theme === "dark" ? "#000" : "#0b1220",
        color: "var(--fg)",
      }}
    >
      {/* Top mini-header — minimal chrome, fades on hover-out */}
      <div
        className="absolute top-0 right-0 z-10 flex items-center gap-2 px-3 py-2 text-xs no-print"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <button
          onClick={() => setNotesOpen((o) => !o)}
          className="px-2 py-1 rounded hover:bg-white/10"
          title="Speaker-Notizen (N)"
        >
          {notesOpen ? "👁 Notes ON" : "👁 Notes OFF"}
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-2 py-1 rounded hover:bg-white/10"
          title="Theme (T)"
        >
          {theme === "dark" ? "☾" : "☀"}
        </button>
        <Link
          to={`/s/${current.id}`}
          className="px-2 py-1 rounded hover:bg-white/10"
          title="Doku-Ansicht (Esc)"
        >
          ✕ Esc
        </Link>
      </div>

      {/* Slide area — centered 16:9-ish container */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div
          className="relative w-full max-w-[1280px] aspect-[16/9] rounded-lg overflow-hidden shadow-2xl"
          style={{
            background: "var(--bg)",
            color: "var(--fg)",
          }}
        >
          <div
            className="absolute inset-0 overflow-y-auto presentation-slide"
            data-slide-id={current.id}
            data-notes-open={notesOpen ? "1" : "0"}
          >
            <SlideRenderer slideId={current.id} lang={lang} />
          </div>
        </div>
      </div>

      {/* Bottom bar — module + counter + nav */}
      <div
        className="flex items-center px-6 py-3 text-sm no-print"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs">{current.id}</span>
          <span>·</span>
          <span>
            {t("module", lang)} {current.module === 99 ? "Anhang" : current.module}
          </span>
          <span>·</span>
          <span className="truncate max-w-md">{pick(current.title, lang)}</span>
        </div>

        <div className="ml-auto flex items-center gap-3 font-mono text-xs">
          {prev && (
            <Link to={`/p/${prev.id}`} className="px-2 py-1 rounded hover:bg-white/10">
              ← {prev.id}
            </Link>
          )}
          <span className="opacity-60">
            {index + 1} / {total}
          </span>
          {next && (
            <Link to={`/p/${next.id}`} className="px-2 py-1 rounded hover:bg-white/10">
              {next.id} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
