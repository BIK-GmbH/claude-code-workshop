# Status — Claude Code Workshop

> Lies zuerst `PLAN.md` für Architektur und Phasen-Definition. Hier steht der aktuelle Stand.

## Letzte Aktualisierung

2026-05-04 — Phase 0–3 ✅ abgeschlossen. App-Skelett, Layout, MDX-Pipeline,
Lang/Theme/Presenter/⌘K alle live. 10 Playwright-Tests grün. Starte Phase 4.

## Phasen-Status

| # | Phase | Status |
|---|---|---|
| 0 | Repo-Setup, Vite+React+TS+Tailwind, Tokens, Skeleton | ✅ done (`e4c39f4`) |
| 1 | Layout-Shell + Routing + Keymap | ✅ done (`9e7747e`) |
| 2 | MDX-Loader + Custom-Components | ✅ done (`98d4ae4`) |
| 3 | Theme/Lang/Presenter/⌘K | ✅ done — in Phase 1+2 enthalten |
| 4 | Inhalte Modul 0 + 1 | ⏳ in Arbeit |
| 5 | Inhalte Modul 2–6 + Anhang | ⬜ pending |
| 6 | Print-View + PDF-Export | ⬜ pending |
| 7 | Playwright-Suite grün | ⬜ pending |
| 8 | GitHub Actions + GH-Pages live | ⬜ pending |
| 9 | README + Update-Doku + Changelog | ⬜ pending |

## Was als Nächstes

**Phase 4** — Recherche + Inhalte für Modul 0 (Cover/Intro) und Modul 1
(Grundlagen & Mindset). Siehe `PLAN.md` für DoD.

Konkrete nächste Schritte:
1. WebSearch zu aktueller Tool-Landscape 2026 (Cursor, Codex, OpenCode, Aider, Continue.dev)
2. Anthropic Claude Code Stand-Recherche (Modelle, Features per Mai 2026)
3. MDX-Files: `00-02-welcome.mdx`, `00-03-goals.mdx`, `00-04-agenda.mdx`
4. MDX-Files: `01-01-what-is.mdx` … `01-05-reflection.mdx`
5. Pro Slide: DE+EN, Speaker-Notes, `researchedOn` + `sources[]`

## Bekannte Blocker / Open Questions

(keine — Defaults aus `PLAN.md` greifen)

## Wenn Du nach einem Context-Switch hier landest

1. Lies `PLAN.md` zuerst — dort steht das gesamte Konzept
2. Lies diese Datei — dort steht der aktuelle Phasen-Stand
3. `git log --oneline -20` zeigt dir, was schon committed ist
4. `npm run dev` (falls Phase 0 fertig) zeigt den aktuellen Build
5. Spring zurück in die `⏳ in Arbeit`-Phase und arbeite weiter
