# Status — Claude Code Workshop

> Lies zuerst `PLAN.md` für Architektur und Phasen-Definition. Hier steht der aktuelle Stand.

## Letzte Aktualisierung

2026-05-04 — Plan committed, starte Phase 0.

## Phasen-Status

| # | Phase | Status |
|---|---|---|
| 0 | Repo-Setup, Vite+React+TS+Tailwind, Tokens, Skeleton | ⏳ in Arbeit |
| 1 | Layout-Shell + Routing + Keymap | ⬜ pending |
| 2 | MDX-Loader + Custom-Components | ⬜ pending |
| 3 | Theme/Lang/Presenter/⌘K | ⬜ pending |
| 4 | Inhalte Modul 0 + 1 | ⬜ pending |
| 5 | Inhalte Modul 2–6 + Anhang | ⬜ pending |
| 6 | Print-View + PDF-Export | ⬜ pending |
| 7 | Playwright-Suite grün | ⬜ pending |
| 8 | GitHub Actions + GH-Pages live | ⬜ pending |
| 9 | README + Update-Doku + Changelog | ⬜ pending |

## Was als Nächstes

**Phase 0** — siehe `PLAN.md` für DoD.

Konkrete nächste Schritte:
1. `npm create vite@latest . -- --template react-ts` (im Workshop-Dir)
2. Tailwind v4 + Tokens-CSS + BIK-Blau einrichten
3. shadcn-Init + minimale Komponenten (Button, Card, Sheet)
4. Skeleton-App rendert mit BIK-Blau Header

## Bekannte Blocker / Open Questions

(keine — Defaults aus `PLAN.md` greifen)

## Wenn Du nach einem Context-Switch hier landest

1. Lies `PLAN.md` zuerst — dort steht das gesamte Konzept
2. Lies diese Datei — dort steht der aktuelle Phasen-Stand
3. `git log --oneline -20` zeigt dir, was schon committed ist
4. `npm run dev` (falls Phase 0 fertig) zeigt den aktuellen Build
5. Spring zurück in die `⏳ in Arbeit`-Phase und arbeite weiter
