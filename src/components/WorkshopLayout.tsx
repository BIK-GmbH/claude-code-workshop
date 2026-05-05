import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import { useLang } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useKeymap } from "@/lib/keymap";
import { ALL_SLIDES, findSlide, neighbours } from "@/lib/slides";

export function WorkshopLayout() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const nav = useNavigate();
  const params = useParams<{ slideId: string }>();
  const current = findSlide(params.slideId ?? "") ?? ALL_SLIDES[0];

  useKeymap({
    onPrev: () => {
      const { prev } = neighbours(current.id);
      if (prev) nav(`/s/${prev.id}`);
    },
    onNext: () => {
      const { next } = neighbours(current.id);
      if (next) nav(`/s/${next.id}`);
    },
    onFirst: () => nav(`/s/${ALL_SLIDES[0].id}`),
    onLast: () => nav(`/s/${ALL_SLIDES[ALL_SLIDES.length - 1].id}`),
    onTogglePalette: () => setPaletteOpen((o) => !o),
    onTogglePresenter: () => {
      const url = new URL(window.location.href);
      const isOn = url.hash.includes("presenter=1");
      const [path] = url.hash.split("?");
      url.hash = isOn ? path : `${path}?presenter=1`;
      window.location.replace(url.toString());
    },
    onToggleFullscreen: () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.();
    },
  });

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onOpenPalette={() => setPaletteOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          lang={lang}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main
          data-workshop-content
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--bg)" }}
        >
          <Outlet context={{ lang, current }} />
        </main>
      </div>

      <Footer lang={lang} current={current} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} lang={lang} />
    </div>
  );
}
