import { useState } from "react";
import clsx from "clsx";

interface Props {
  /** Shell command or code snippet */
  children: string;
  /** Visual hint, e.g. "bash", "json" */
  lang?: string;
  /** Optional caption above the box */
  caption?: string;
}

export function CommandBox({ children, lang = "bash", caption }: Props) {
  const [copied, setCopied] = useState(false);
  const code = typeof children === "string" ? children.trim() : String(children);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore — clipboard may be denied */
    }
  }

  return (
    <figure className="my-4">
      {caption && (
        <figcaption
          className="text-xs uppercase tracking-wider mb-1.5"
          style={{ color: "var(--fg-muted)" }}
        >
          {caption}
        </figcaption>
      )}
      <div
        className="relative rounded-md border overflow-hidden"
        style={{ borderColor: "var(--border)", background: "#0b1220" }}
      >
        <div className="flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)" }}>
          <span>{lang}</span>
          <button
            onClick={copy}
            className={clsx(
              "px-2 py-0.5 rounded text-[10px] transition-colors no-print",
              copied ? "bg-emerald-500/20 text-emerald-300" : "hover:bg-white/10",
            )}
            style={{ color: copied ? undefined : "rgba(255,255,255,0.7)" }}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        </div>
        <pre className="p-4 m-0 text-sm overflow-x-auto" style={{ color: "#e2e8f0" }}>
          <code>{code}</code>
        </pre>
      </div>
    </figure>
  );
}
