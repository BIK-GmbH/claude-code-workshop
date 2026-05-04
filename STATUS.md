# Status — Claude Code Workshop

> Lies zuerst `PLAN.md` für Architektur und Phasen-Definition. Hier steht der aktuelle Stand.

## Letzte Aktualisierung

**2026-05-04** — Alle Phasen 0–9 ✅ abgeschlossen. Deck live (privat, hinter
GitHub-Login). 29 Playwright-Tests grün, beide PDFs erzeugt, CI grün.

## Phasen-Status

| # | Phase | Status |
|---|---|---|
| 0 | Repo-Setup, Vite+React+TS+Tailwind, Tokens, Skeleton | ✅ done (`e4c39f4`) |
| 1 | Layout-Shell + Routing + Keymap | ✅ done (`9e7747e`) |
| 2 | MDX-Loader + Custom-Components | ✅ done (`98d4ae4`) |
| 3 | Theme/Lang/Presenter/⌘K | ✅ done — in Phase 1+2 mitgemacht |
| 4 | Inhalte Modul 0 + 1 (DE+EN, sources, notes) | ✅ done (`34fde3e`) |
| 5 | Inhalte Modul 2–6 + Anhang | ✅ done (`e5373b5`) |
| 6 | Print-View + PDF-Export | ✅ done (`e8a54cf`) |
| 7 | Playwright-Suite (29 Tests) | ✅ done (`e8a54cf`) |
| 8 | GitHub Actions + GH-Pages live | ✅ done (`2258334`) |
| 9 | README + Update-Doku + Changelog | ⏳ in Arbeit |

## Live-URL

- **Repo:** https://github.com/BIK-GmbH/claude-code-workshop *(privat)*
- **Pages:** https://didactic-broccoli-k5o2omq.pages.github.io/claude-code-workshop/
  *(GitHub-Login erforderlich, weil Repo privat)*
- **Deploy-Workflow:** läuft automatisch auf jedem `main`-Push

## Was als Nächstes — User-Entscheidungen

Die Infrastruktur steht. Folgende Punkte sind **User-Entscheidungen**, die ich
nicht autonom treffen wollte:

1. **Repo-Sichtbarkeit:** privat (Default) oder public?
   ```bash
   gh repo edit BIK-GmbH/claude-code-workshop --visibility public --accept-visibility-change-consequences
   ```
   Danach erreichbar unter `https://bik-gmbh.github.io/claude-code-workshop/`

2. **Custom Domain** (z. B. `workshop.bik.biz`)? Schritte in README.

3. **Inhaltliches Review** der ~50 Slides — könnt ihr im Live-View durchklicken
   und Feedback geben. Update-Workflow im README.

## Recovery — wenn Du nach Context-Switch hier landest

1. `git log --oneline` zeigt 9 Commits, alle Phasen abgehakt
2. `npm install && npm run dev` → http://localhost:5174 lokal
3. `npm run test:e2e` → 29 Tests grün als Smoke-Check
4. `npm run export:pdf -- --base=/` → PDFs werden erzeugt
5. Wenn Inhalts-Updates nötig: Slide in `src/content/<modul>-<slide>-*.mdx`
   editieren, `researchedOn` aktualisieren, Changelog-Slide ergänzen, PR
