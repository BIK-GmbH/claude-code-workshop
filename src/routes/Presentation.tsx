import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Moon, Sun, X } from "lucide-react";
import { ALL_SLIDES, findSlide, neighbours } from "@/lib/slides";
import { useLang, t, pick } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useKeymap } from "@/lib/keymap";
import { SlideRenderer } from "@/components/SlideRenderer";

const ICON = { strokeWidth: 2.25 } as const;

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

  // Touch-swipe handler for mobile slide nav
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    const t0 = e.touches[0];
    touchStart.current = { x: t0.clientX, y: t0.clientY, t: Date.now() };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    if (!start) return;
    touchStart.current = null;
    const t1 = e.changedTouches[0];
    const dx = t1.clientX - start.x;
    const dy = t1.clientY - start.y;
    const dt = Date.now() - start.t;
    // Only count fast horizontal swipes
    if (Math.abs(dx) < 60) return;
    if (Math.abs(dy) > Math.abs(dx)) return;     // vertical scroll
    if (dt > 800) return;                         // too slow
    if (dx < 0 && next) nav(`/p/${next.id}`);
    else if (dx > 0 && prev) nav(`/p/${prev.id}`);
  }

  return (
    <div
      data-presentation
      className="w-screen flex flex-col"
      style={{
        background: theme === "dark" ? "#000" : "#0b1220",
        color: "var(--fg)",
        height: "100dvh",
        minHeight: "100dvh",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top mini-header — sticky so it never scrolls away */}
      <div
        className="sticky top-0 z-20 flex items-center justify-end gap-1.5 px-2 py-2 text-xs no-print"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        <button
          onClick={() => setNotesOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 size-9 sm:w-auto sm:px-2.5 justify-center rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
          style={{ background: "rgba(255,255,255,0.15)" }}
          title="Speaker-Notizen (N)"
          aria-label="Toggle speaker notes"
        >
          {notesOpen ? <Eye size={16} {...ICON} /> : <EyeOff size={16} {...ICON} />}
          <span className="hidden sm:inline">
            {notesOpen ? "Notes" : "Notes"}
          </span>
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-9 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
          style={{ background: "rgba(255,255,255,0.15)" }}
          title="Theme (T)"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={18} {...ICON} /> : <Sun size={18} {...ICON} />}
        </button>
        <Link
          to={`/s/${current.id}`}
          className="inline-flex items-center gap-1.5 size-9 sm:w-auto sm:px-2.5 justify-center rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
          style={{ background: "rgba(255,255,255,0.15)" }}
          title="Doku-Ansicht (Esc)"
          aria-label="Exit presentation"
        >
          <X size={18} {...ICON} />
          <span className="hidden sm:inline">Esc</span>
        </Link>
      </div>

      {/* Slide area — 16:9 frame on tablet+, full-bleed on mobile */}
      <div className="flex-1 flex items-center justify-center md:p-6 overflow-hidden">
        <div
          className="relative w-full md:max-w-[1280px] md:aspect-[16/9] md:rounded-lg overflow-hidden md:shadow-2xl h-full md:h-auto"
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

      {/* Bottom bar — sticky so it never scrolls away on mobile. */}
      <div
        className="sticky bottom-0 z-20 flex items-center px-3 sm:px-6 py-2 sm:py-3 text-sm no-print gap-2 shrink-0"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="font-mono text-xs shrink-0 opacity-70">{current.id}</span>
          <span className="opacity-50 hidden sm:inline">·</span>
          <span className="hidden sm:inline shrink-0 opacity-90">
            {t("module", lang)} {current.module === 99 ? "Anhang" : current.module}
          </span>
          <span className="opacity-50 hidden md:inline">·</span>
          <span className="truncate hidden md:inline opacity-90">{pick(current.title, lang)}</span>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 font-mono text-xs">
          {prev ? (
            <Link
              to={`/p/${prev.id}`}
              className="size-9 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
              aria-label="Previous slide"
              title={`← ${prev.id}`}
            >
              <ChevronLeft size={18} {...ICON} />
            </Link>
          ) : (
            <span className="size-9 grid place-items-center opacity-30">
              <ChevronLeft size={18} {...ICON} />
            </span>
          )}
          <span className="opacity-80 px-2 tabular-nums">
            {index + 1} / {total}
          </span>
          {next ? (
            <Link
              to={`/p/${next.id}`}
              className="size-9 grid place-items-center rounded-md hover:bg-white/10 active:bg-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.15)" }}
              aria-label="Next slide"
              title={`${next.id} →`}
            >
              <ChevronRight size={18} {...ICON} />
            </Link>
          ) : (
            <span className="size-9 grid place-items-center opacity-30">
              <ChevronRight size={18} {...ICON} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
