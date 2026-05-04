import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import { MANIFEST } from "@/lib/manifest";
import { pick, t } from "@/lib/i18n";
import type { Lang } from "@/types/slide";

interface Props {
  lang: Lang;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ lang, collapsed, onToggleCollapse }: Props) {
  const params = useParams<{ slideId: string }>();
  const activeId = params.slideId;
  const activeModule = activeId ? Number(activeId.split(".")[0]) : 0;

  const [openModules, setOpenModules] = useState<Set<number>>(
    () => new Set([activeModule]),
  );

  function toggleModule(idx: number) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  if (collapsed) {
    return (
      <aside
        data-workshop-sidebar
        className="border-r flex flex-col items-center py-3"
        style={{ borderColor: "var(--border)", background: "var(--bg-elev)", width: 48 }}
      >
        <button
          onClick={onToggleCollapse}
          className="size-8 grid place-items-center rounded hover:bg-black/5"
          aria-label={t("toggleLang", lang) /* generic label */}
          title="Expand sidebar"
        >
          ☰
        </button>
      </aside>
    );
  }

  return (
    <aside
      data-workshop-sidebar
      className="border-r overflow-y-auto"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-elev)",
        width: "var(--sidebar-width)",
      }}
    >
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>
          {t("module", lang)}e
        </span>
        <button
          onClick={onToggleCollapse}
          className="size-6 grid place-items-center rounded text-sm hover:bg-black/5"
          title="Collapse sidebar"
        >
          ‹
        </button>
      </div>

      <nav className="py-2">
        {MANIFEST.map((m) => {
          const isActive = m.index === activeModule;
          const isOpen = openModules.has(m.index);
          return (
            <div key={m.index} className="mb-1">
              <button
                onClick={() => toggleModule(m.index)}
                data-testid={`module-toggle-${m.index}`}
                className={clsx(
                  "w-full text-left px-4 py-2 flex items-center gap-2 text-sm font-medium",
                  "hover:bg-black/5",
                  isActive && "border-l-2",
                )}
                style={isActive ? { borderColor: "var(--workshop-accent)" } : undefined}
                aria-expanded={isOpen}
              >
                <span
                  className="text-xs font-mono w-7 shrink-0"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {m.index === 99 ? "Anh" : String(m.index).padStart(2, "0")}
                </span>
                <span className="flex-1 truncate">{pick(m.title, lang)}</span>
                <span className="opacity-50 text-xs">{isOpen ? "▾" : "▸"}</span>
              </button>

              {isOpen && (
                <ul className="pl-11 pr-3 pb-1">
                  {m.slides.map((s) => {
                    const slideActive = s.id === activeId;
                    return (
                      <li key={s.id}>
                        <Link
                          to={`/s/${s.id}`}
                          data-testid={`slide-link-${s.id}`}
                          className={clsx(
                            "block py-1.5 text-sm rounded px-2 -mx-2",
                            slideActive
                              ? "font-semibold"
                              : "hover:bg-black/5",
                          )}
                          style={
                            slideActive
                              ? { color: "var(--workshop-accent)" }
                              : undefined
                          }
                          aria-current={slideActive ? "page" : undefined}
                        >
                          {pick(s.title, lang)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
