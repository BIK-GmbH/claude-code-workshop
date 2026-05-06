# Claude Code Workshop — Implementation Plan

> **Resume-Anchor.** Wenn ein Context-Switch passiert: lies dieses File **zuerst**, dann `STATUS.md` für den aktuellen Phasen-Stand. Hier steht das **Was** und **Wie**, in `STATUS.md` das **Wo wir gerade sind**.

## Zweck

Interaktive HTML-Schulungsunterlagen für den **Claude Code Workshop** der BIK
GmbH (Trainer: Christian Hubmann). Generisches Deck — wird für alle Kunden
genutzt, kein kundenspezifisches Branding im Content. Quelldokument
(historische Vorlage): `assets/` (kundenspezifisches Original-Angebot, dient
nur als Strukturvorlage).

Standard-Format: **1 Tag (8 Std), online oder inhouse**. Optional auf Anfrage
2-Tage-Intensiv (16 Std) für tiefere Vertiefung.

Output:
- Single-Page-App mit Sidebar-Navigation + Slide-Content
- Bilingual DE/EN (Toggle)
- Speaker-Notes (Presenter-Mode)
- PDF-Export (browser-print-fähig + headless-Playwright-Skript)
- GitHub-Pages-Deploy
- Vollautonome E2E-Tests via Playwright

## Tech-Stack (final)

- **Vite 6 + React 19 + TypeScript**
- **Tailwind v4** + **shadcn/ui** (selektiv, keine Vollinstallation)
- **MDX** (`@mdx-js/rollup`) als Slide-Quellformat
- **Shiki** für Code-Highlighting
- **Mermaid** für Diagramme
- **react-router-dom** mit HashRouter (GH-Pages-tauglich)
- **Playwright** für E2E-Tests + PDF-Export
- **GitHub Actions** für Deploy + Tests + Stale-Check

> **Bewusst nicht:** Slidev (Vue-basiert, passt nicht zum React-Wunsch). Wir nehmen die Slidev-DX als Vorbild und bauen sie React-nativ nach.

## Branding

- Primärfarbe: BIK-Blau `#1F4E79` (aus PDF abgeleitet)
- CSS-Variable `--workshop-accent` als per-Workshop-Slot — austauschbar via `data-workshop="…"`-Attribut auf `<html>`
- Light/Dark-Mode mit `prefers-color-scheme`-Default
- Logo: `public/bik-logo.svg` (muss noch erstellt/eingefügt werden)

## Inhalts-Aufteilung (gemappt aufs Angebot)

| # | Modul | Slides ca. | Hands-on |
|---|---|---|---|
| 0 | Cover, Intro, Lernziele | 4 | – |
| 1 | Grundlagen & Mindset | 8 | Reflexion |
| 2 | Setup & Basis-Konfig | 10 | erste CLAUDE.md |
| 3 | Skills, Subagents, MCP | 10 | eigener Skill |
| 4 | Spec-Driven Development | 10 | Spec → Code |
| 5 | Best Practices, Anti-Patterns, Security | 8 | Anti-Pattern-Audit |
| 6 | Hands-on eigene Projekte | 5 | echtes Ticket |
| A | Anhang: CLAUDE.md-Vorlagen, Cheat-Sheets, Ressourcen | 6 | – |

Gesamt: ≈61 Slides.

## Slide-Format (MDX)

Jede Slide ist durch `---` getrennt, Frontmatter pro Slide:

```mdx
---
title:
  de: "Augmented Working — was es ist"
  en: "Augmented Working — what it is"
module: 1
slide: 2
researchedOn: 2026-05-04
sources:
  - https://www.anthropic.com/news/claude-code
  - https://docs.claude.com/en/docs/claude-code
---

# <I18n de="Augmented Working" en="Augmented Working" />

<I18n de="…DE-Text…" en="…EN-Text…" />

<ExerciseCard duration="10min" goal="…">…</ExerciseCard>

<SpeakerNotes>Hinweise für Christian.</SpeakerNotes>
```

## Aktualitäts-Layer

- `researchedOn` + `sources[]` pro Slide-Frontmatter
- Footer zeigt **Stand-Datum** der aktuellen Slide
- Anhang-Modul: automatisch generierter **Changelog** aus allen `researchedOn`
- GitHub Action `research-stale.yml` warnt bei Slides > 90 Tage alt

## Repo-Struktur

```
claude_code_workshop/
├── PLAN.md                    ← dieses File (was/wie)
├── STATUS.md                  ← aktueller Stand pro Phase (wo wir sind)
├── README.md                  ← Setup, Update-Workflow, Deploy
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── playwright.config.ts
├── index.html
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       ├── playwright.yml
│       └── research-stale.yml
├── public/
│   ├── bik-logo.svg
│   └── favicon.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── Slide.tsx
│   │   └── Print.tsx
│   ├── components/
│   │   ├── WorkshopLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SlideRenderer.tsx
│   │   ├── SlideNav.tsx
│   │   ├── LangToggle.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── CommandBox.tsx
│   │   ├── ExerciseCard.tsx
│   │   ├── NoteCard.tsx
│   │   ├── SpeakerNotes.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── I18n.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── slides.ts           # MDX-Loader + Manifest
│   │   ├── i18n.ts
│   │   ├── theme.ts
│   │   └── keymap.ts
│   ├── content/
│   │   ├── 00-cover.mdx
│   │   ├── 01-grundlagen.mdx
│   │   ├── 02-setup.mdx
│   │   ├── 03-skills-mcp.mdx
│   │   ├── 04-spec-driven.mdx
│   │   ├── 05-best-practices.mdx
│   │   ├── 06-hands-on.mdx
│   │   └── 99-anhang.mdx
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── globals.css
│   │   └── print.css
│   └── types/
│       └── slide.ts
├── tests/
│   └── e2e/
│       ├── nav.spec.ts
│       ├── i18n.spec.ts
│       ├── theme.spec.ts
│       ├── presenter.spec.ts
│       ├── palette.spec.ts
│       ├── print.spec.ts
│       └── pdf.spec.ts
├── scripts/
│   └── export-pdf.ts
└── assets/
    └── (historische Angebots-Vorlage, intern, nicht im Repo verlinkt)
```

## Phasen-Plan (Resume-fähig)

Der genaue Stand pro Phase steht in `STATUS.md`. Reihenfolge ist verbindlich.

| # | Phase | Definition of Done |
|---|---|---|
| 0 | Repo-Setup, Vite+React+TS+Tailwind, Tokens, Skeleton | `npm run dev` läuft, leere App rendert mit BIK-Blau |
| 1 | Layout-Shell: Header, Sidebar (Akkordeon), Footer, Routing, Hash-Sync, Keymap | Klick + ←/→/J/K wechseln Slide, URL ändert sich |
| 2 | MDX-Loader, Manifest-Builder, `<I18n>`, Custom-Components (`CommandBox`, `ExerciseCard`, `NoteCard`, `SpeakerNotes`) | 1 Demo-Slide rendert mit allen Komponenten |
| 3 | Theme-Toggle, Lang-Toggle (persistiert), Presenter-Mode (`?presenter=1`), ⌘K-Palette | manuell prüfbar |
| 4 | **Recherche** + Inhalte Modul 0 + Modul 1 (DE/EN, sources, notes) | Slides lesbar, Sources im Frontmatter |
| 5 | **Recherche** + Inhalte Modul 2–6 + Anhang | komplettes Deck (≈61 Slides) |
| 6 | Print-View (`/print`), `@media print`-CSS, Export-Skript `npm run export` | PDF wird erzeugt, alle Slides drin |
| 7 | Playwright-Suite (nav, i18n, theme, presenter, palette, print, pdf, accessibility) — alle grün | `npx playwright test` grün |
| 8 | GitHub Actions: deploy.yml + playwright.yml + research-stale.yml + GH-Pages aktiv | Live-URL erreichbar, CI grün |
| 9 | README + Update-Workflow-Doku + Changelog-Anhang | Dokumentation komplett |

## Verifikations-Pflicht

Vor jeder „fertig"-Meldung:
- `npm run build` grün
- `npx tsc -b --noEmit` grün
- `npx playwright test` grün
- Bei Phase 8: Live-URL via Playwright im Browser-Modus aufgerufen + Screenshot

## Defaults für offene Punkte

Da der User „leg los" sagte, ohne die offenen Fragen zu beantworten:

1. **Repo-Anlage:** lokal initialisieren + commits aufbauen, `gh repo create BIK-GmbH/claude-code-workshop --private --source=.` als finaler Schritt — falls GitHub-Org-Permission fehlt, Fallback: `shortcutchris/claude-code-workshop` mit Hinweis an User
2. **Sichtbarkeit:** privat starten
3. **Domain:** `bik-gmbh.github.io/claude-code-workshop/` (Custom-Domain später)
4. **Inhaltliche Tiefe:** Stichpunkte auf Slides + ausformulierte Speaker-Notes

## Quellen-Material

- `assets/` — historisches Angebots-PDF als Strukturvorlage (kundenspezifisch, nicht öffentlich)
- Externe Recherche pro Modul: Anthropic Docs, Claude Code Docs, MCP-Spec, aktuelle Tool-Landscape (Cursor, Codex, OpenCode, Aider) — Stand-Datum jeweils im Slide-Frontmatter

## Kontakt im PDF

- Trainer: Christian Hubmann
- Email: ch@bik.biz
- Tel: +49 15122681129
