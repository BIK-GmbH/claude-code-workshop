import { Link } from "react-router-dom";
import type { Lang, SlideMeta } from "@/types/slide";
import { neighbours } from "@/lib/manifest";
import { t } from "@/lib/i18n";

interface Props {
  lang: Lang;
  current: SlideMeta;
}

export function Footer({ lang, current }: Props) {
  const { prev, next, index, total } = neighbours(current.id);

  return (
    <footer
      data-workshop-footer
      className="border-t flex items-center px-4 text-xs shrink-0"
      style={{
        height: "var(--footer-height)",
        borderColor: "var(--border)",
        background: "var(--bg-elev)",
        color: "var(--fg-muted)",
      }}
    >
      <div className="flex items-center gap-2">
        {prev ? (
          <Link
            to={`/s/${prev.id}`}
            className="px-2 py-1 rounded hover:bg-black/5"
            title={t("prevSlide", lang)}
          >
            ‹ {prev.id}
          </Link>
        ) : (
          <span className="px-2 py-1 opacity-30">‹</span>
        )}
        {next ? (
          <Link
            to={`/s/${next.id}`}
            className="px-2 py-1 rounded hover:bg-black/5"
            title={t("nextSlide", lang)}
          >
            {next.id} ›
          </Link>
        ) : (
          <span className="px-2 py-1 opacity-30">›</span>
        )}
      </div>

      <div className="mx-auto font-mono">
        {index + 1} / {total}
        <span className="mx-3 opacity-50">·</span>
        <span>{t("module", lang)} {current.module === 99 ? "Anhang" : current.module}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {current.researchedOn && (
          <span title={t("researchedOn", lang)}>
            {t("researchedOn", lang)}: {current.researchedOn}
          </span>
        )}
        <Link to="/print" className="px-2 py-1 rounded hover:bg-black/5">
          {t("print", lang)}
        </Link>
      </div>
    </footer>
  );
}
