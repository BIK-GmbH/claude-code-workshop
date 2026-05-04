# Claude Code Workshop — Schulungsdeck

Interaktive HTML-Schulungsunterlagen für den **Claude Code Workshop** der BIK GmbH.
Trainer: Christian Hubmann · ch@bik.biz.

> Live-URL: https://didactic-broccoli-k5o2omq.pages.github.io/claude-code-workshop/
> *(Repo aktuell privat — GitHub-Login erforderlich. Siehe „Sichtbarkeit" unten.)*

## Was ist das?

- Single-Page-App mit **Sidebar-Navigation** + Slide-Content (React + Vite + MDX)
- **Bilingual DE/EN** mit Sprach-Toggle
- **Speaker-Notes-Modus** (`?presenter=1` oder Taste `P`) für den Trainer
- **PDF-Export** über Playwright headless (`npm run export:pdf`)
- **Browser-Print-Ausgabe** als Fallback (alle Slides linear, Chrome ausgeblendet)
- **Wartbar:** pro Slide `researchedOn`-Datum + `sources[]` im Frontmatter

## Inhalt

| # | Modul | Slides |
|---|---|---|
| 0 | Cover, Begrüßung, Lernziele, Agenda | 4 |
| 1 | Grundlagen & Mindset | 5 |
| 2 | Setup & Basis-Konfiguration | 8 |
| 3 | Skills, Subagents, MCP | 6 |
| 4 | Spec-Driven Development | 6 |
| 5 | Best Practices, Anti-Patterns, Sicherheit | 6 |
| 6 | Hands-on: eigene Projekte | 5 |
| A | Anhang: Vorlagen, Cheat-Sheets, Ressourcen, Changelog | 6 |

≈ 46 Inhalts-Slides + Anhang.

## Setup

```bash
git clone git@github.com:BIK-GmbH/claude-code-workshop.git
cd claude-code-workshop
npm install
npm run dev          # → http://localhost:5174
```

## Befehle

| Command | Was es tut |
|---|---|
| `npm run dev` | Vite dev-server :5174 mit HMR |
| `npm run build` | Type-check + Production-Build → `dist/` |
| `npm run preview` | Production-Build lokal anschauen :4173 |
| `npm run typecheck` | Nur TypeScript prüfen |
| `npm run test:e2e` | Playwright-Suite (29 Tests) |
| `npm run test:e2e:ui` | Playwright im UI-Mode (Debug) |
| `npm run export:pdf` | DE+EN PDF in `exports/` (~820 KB je) |

## Tasten

| Taste | Aktion |
|---|---|
| `→` / `j` / `Space` / `PageDown` | nächste Folie |
| `←` / `k` / `PageUp` | vorherige Folie |
| `Home` / `End` | erste / letzte Folie |
| `⌘K` / `Ctrl+K` | Command Palette / Suche |
| `P` | Presenter-Mode toggle |
| `F` | Vollbild |

## Slide schreiben

Jede Folie ist eine MDX-Datei in `src/content/`, benannt `<modul>-<slide>-<slug>.mdx`.

```mdx
---
title:
  de: "Beispiel-Titel"
  en: "Example Title"
researchedOn: 2026-05-04
sources:
  - https://example.com
---

# <I18n de="DE-Heading" en="EN-Heading" />

<De>
- Stichpunkt eins
- Stichpunkt zwei
</De>

<En>
- Bullet one
- Bullet two
</En>

<NoteCard variant="tip">
  <I18n de="Hinweis-Text" en="Hint text" />
</NoteCard>

<SpeakerNotes>
  <I18n de="Trainer-Notiz" en="Trainer note" />
</SpeakerNotes>
```

Nach Speichern: Vite HMR lädt sofort neu. Sidebar-Index aktualisiert sich
automatisch über das Frontmatter.

## Verfügbare Slide-Komponenten

| Komponente | Zweck |
|---|---|
| `<I18n de="…" en="…" />` | Inline-Bilingual |
| `<De>…</De>` / `<En>…</En>` | Block-Bilingual |
| `<CommandBox lang="bash">…</CommandBox>` | Code mit Copy-Button |
| `<ExerciseCard duration="..." goal="...">` | Hands-on-Box |
| `<NoteCard variant="tip\|warning\|hint">` | Hinweis-Box |
| `<SpeakerNotes>` | nur in `?presenter=1` + Print sichtbar |

## Wartung & Aktualität

- Pro Slide steht im Footer ein **„Stand:"-Datum** (aus `researchedOn`)
- Quellen werden im Slide-Footer + im Anhang-Changelog gesammelt
- **Monatlicher CI-Check** (`research-stale.yml`) warnt bei Slides > 90 Tage alt
- Update-Workflow:
  1. Recherche pro Modul wiederholen
  2. Betroffene `*.mdx`-Files aktualisieren
  3. `researchedOn` + `sources[]` im Frontmatter aktualisieren
  4. Eintrag im Changelog (`99-06-changelog.mdx`) ergänzen
  5. PR aufmachen → Playwright-CI läuft → Merge → Auto-Deploy

## Sichtbarkeit (Repo + GitHub Pages)

Aktueller Stand: **privat**. Konsequenz: GitHub Pages erfordert GitHub-Login.

Auf öffentlich umstellen (Repo + Pages):

```bash
gh repo edit BIK-GmbH/claude-code-workshop --visibility public --accept-visibility-change-consequences
```

Danach ist das Deck unter
`https://bik-gmbh.github.io/claude-code-workshop/` öffentlich.

Wenn ihr eine **Custom-Domain** wollt (z. B. `workshop.bik.biz`):

```bash
echo "workshop.bik.biz" > public/CNAME
git add public/CNAME && git commit -m "chore: add custom domain" && git push
gh api -X PUT repos/BIK-GmbH/claude-code-workshop/pages -f cname=workshop.bik.biz
```

DNS: `CNAME workshop → bik-gmbh.github.io`.

## Architektur

```
Vite + React 19 + TypeScript + Tailwind v4 + shadcn-Patterns
├── src/
│   ├── App.tsx              ← HashRouter + Lang/Theme Provider
│   ├── components/
│   │   ├── WorkshopLayout   ← Header + Sidebar + Footer Grid
│   │   ├── Sidebar          ← Modul-Akkordeon
│   │   ├── Header           ← Lang/Theme/Palette Trigger
│   │   ├── Footer           ← prev/next, counter, researchedOn
│   │   ├── CommandPalette   ← ⌘K via cmdk
│   │   ├── SlideRenderer    ← MDXProvider + custom HTML overrides
│   │   └── slide-blocks/    ← I18n, CommandBox, ExerciseCard, …
│   ├── content/             ← die MDX-Folien
│   ├── lib/
│   │   ├── slides.ts        ← import.meta.glob loader, manifest merge
│   │   ├── i18n.tsx         ← LangProvider, useLang, t()
│   │   ├── theme.tsx        ← ThemeProvider
│   │   ├── manifest.ts      ← Slide-ID-Reihenfolge (Single Source of Truth)
│   │   └── keymap.ts        ← Keyboard-Bindings
│   ├── routes/
│   │   ├── Slide.tsx        ← /s/:slideId
│   │   └── Print.tsx        ← /print, alle Slides linear
│   └── styles/
│       ├── tokens.css       ← BIK-Blau + --workshop-accent slot
│       ├── globals.css
│       └── print.css
├── tests/e2e/               ← 29 Playwright-Tests
├── scripts/
│   ├── export-pdf.ts        ← Playwright-headless PDF-Export
│   └── verify-live.mjs      ← Smoke-Check für Live-URL
└── .github/workflows/
    ├── deploy.yml           ← Auto-Deploy auf GH-Pages
    ├── playwright.yml       ← E2E auf jedem PR
    └── research-stale.yml   ← Monats-Check researchedOn-Drift
```

## Resume-Anchor

Bei Context-Switch oder Übergabe an Kolleg:in:

1. Lies **`PLAN.md`** — gesamtes Konzept und Phasen-Definition
2. Lies **`STATUS.md`** — aktueller Stand pro Phase
3. `git log --oneline` — was schon committed ist
4. `npm run dev` — läuft die App?

## Lizenz

Interne BIK-Schulungsunterlagen. Verteilung an Workshop-Teilnehmende erlaubt.
Externe Weitergabe nur nach Absprache mit der BIK GmbH.
