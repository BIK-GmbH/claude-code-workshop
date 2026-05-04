import type { ReactNode } from "react";
import { useLang, t } from "@/lib/i18n";

/** Speaker notes — visible only in presenter mode (?presenter=1) or in print view. */
export function SpeakerNotes({ children }: { children: ReactNode }) {
  const [lang] = useLang();
  const isPresenter =
    typeof window !== "undefined" &&
    window.location.hash.includes("presenter=1");

  // In presenter mode show inline; in normal mode hide entirely (but keep for print).
  if (!isPresenter) {
    return (
      <aside data-speaker-notes className="hidden print:block mt-6 text-xs border-t pt-3"
        style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}>
        <strong>{t("speakerNotes", lang)}:</strong> {children}
      </aside>
    );
  }
  return (
    <aside
      data-speaker-notes
      className="mt-8 border-t pt-4 text-sm"
      style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
    >
      <strong className="block mb-1" style={{ color: "var(--fg)" }}>
        {t("speakerNotes", lang)}:
      </strong>
      <div>{children}</div>
    </aside>
  );
}
