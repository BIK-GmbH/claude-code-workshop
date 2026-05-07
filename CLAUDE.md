# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Worum es geht

Interaktives HTML-Schulungsdeck für den **Claude Code Workshop** der BIK GmbH (Trainer: Christian Hubmann, ch@bik.biz). Generisches, kundenneutrales Material — kein kundenspezifisches Branding im Content.

- **Live:** https://bik-gmbh.github.io/claude-code-workshop/
- **Format:** 1 Tag (8 Std), Standard; 2 Tage Intensiv auf Anfrage
- **Module:** 0 Intro · 1 Mindset · 2 Setup · 3 Skills+MCP · 4 Spec-Driven · 5 Best-Practices · 6 Hands-on · 99 Anhang
- **Resume-Anchor:** vor der Arbeit `PLAN.md` (Was/Wie) und `STATUS.md` (Wo wir sind) lesen.

## Befehle

| Command | Zweck |
|---|---|
| `npm run dev` | Vite Dev-Server auf :5174 (HMR). `BASE_PATH=/` bei lokaler Entwicklung ohne `/claude-code-workshop/`-Prefix. |
| `npm run build` | `tsc -b --noEmit` + `vite build` → `dist/`. Pflicht vor jeder „fertig"-Meldung. |
| `npm run typecheck` | Nur TypeScript prüfen. |
| `npm run test:e2e` | Playwright-Suite (smoke + content + mobile + presentation + print-pdf). |
| `npm run test:e2e:ui` | Playwright im UI-Mode (Debug). |
| `npx playwright test tests/e2e/smoke.spec.ts` | Einzelne Spec. |
| `npx playwright test -g "scroll memory"` | Einzelner Test per Titel-Match. |
| `npm run export:pdf` | DE+EN PDF nach `exports/` (~820 KB je). Verwendet headless Playwright. |
| `npm run preview` | Production-Build lokal auf :4173. |

Playwright startet den Dev-Server selbst (`webServer` in `playwright.config.ts`, mit `BASE_PATH=/`). Wenn lokal `npm run dev` schon läuft, wird er wiederverwendet.

## Architektur — das Big Picture

### Slide-Pipeline (Single Source of Truth: `src/lib/manifest.ts`)

1. **`src/lib/manifest.ts`** definiert die *Reihenfolge* und IDs der Module/Slides als statisches Array. Hier liegt die alleinige Quelle der Wahrheit für Navigation, Sidebar und Druckreihenfolge.
2. **`src/content/<modul>-<slide>-<slug>.mdx`** liefert den Slide-Inhalt + Frontmatter (`title`, `researchedOn`, `sources[]`).
3. **`src/lib/slides.ts`** lädt alle MDX-Dateien per `import.meta.glob(..., { eager: true })`, mappt Filename `01-02-foo.mdx` → ID `01.02`, und merged Frontmatter über das Manifest. Resultat: `MANIFEST` + `ALL_SLIDES` + `getSlideComponent(id)` + `neighbours(id)`.
4. **`src/routes/Slide.tsx`** rendert eine Slide unter `/s/:slideId`, **`Print.tsx`** rendert alle Slides linear unter `/print` (für PDF + Browser-Print).
5. Routing ist **HashRouter** (GH-Pages-tauglich).

→ Neue Slide hinzufügen heißt: Eintrag im Manifest **und** MDX-Datei mit passendem Filename. Frontmatter-`title` überschreibt das Manifest.

### MDX-Komponenten (`src/components/slide-blocks/`)

In MDX verfügbar via `MDXProvider` in `SlideRenderer`:

- `<I18n de="…" en="…" />`, `<De>…</De>`, `<En>…</En>` — bilinguale Inhalte (Toggle in der Top-Bar)
- `<CommandBox lang="bash">…</CommandBox>` — Shiki-highlighted Code mit Copy-Button
- `<ExerciseCard duration="…" goal="…">` — Hands-on-Box
- `<NoteCard variant="tip|warning|hint">` — Hinweis-Box
- `<SpeakerNotes>` — nur in `?presenter=1` und Print sichtbar
- `<DemoBox>`, `<SkillCard>`, `<YouTubeEmbed>` — weitere Slide-Blöcke

### Provider-Stack (`src/App.tsx`)

`LangProvider` (DE/EN, persistiert in localStorage) → `ThemeProvider` (light/dark, `prefers-color-scheme`-Default) → `HashRouter` → `WorkshopLayout` (Header + Sidebar + Footer Grid) → Route. Keymap-Hook (`src/lib/keymap.ts`) bindet `←/→/j/k/Space/Home/End/P/F/⌘K` global.

### Branding-Tokens (`src/styles/tokens.css`)

BIK-Echt-Farben aus bik.biz:

- `#38B6AB` Türkis → `--workshop-accent` (Header-BG, Primary)
- `#13357A` Tiefblau → `--workshop-accent-deep`
- `#181A27` Anthrazit → Splash-BG + Dark-Mode `--bg-elev`
- `#A0D4CD` helles Türkis → Hover-Tints

Logos in `public/brand/` (`bik-logo-white.svg`, `bik-logo-dark.svg`). Theme-Color der PWA-Manifest ist Anthrazit.

## Konventionen — wirklich wichtig

- **Kein Kundenname im Content** (z. B. nicht „mind2move"). Das Deck ist generalisiert für alle Kunden.
- **Deutsche Anführungszeichen in JSX-Attributen vermeiden** — brechen den MDX-Parser. Im Fließtext OK, in `prop="…"` nicht.
- **`<` in Code-Beispielen** ohne Escape vermeiden — wird sonst als JSX geparst. In `<CommandBox>` ist Inhalt geschützt; in losem MDX nicht.
- **Frontmatter-Datum aktualisieren:** beim Slide-Update `researchedOn` setzen und ggf. `sources[]` ergänzen. Footer zeigt das Datum an, `99-06-changelog.mdx` listet Änderungen.
- **Splash-Screen** ist zweigeteilt: `Min-Visible 1500ms` in `src/main.tsx`, `Fade 420ms` als CSS-Transition auf `#splash` in `index.html`. Beides bewusst — nicht kürzen.
- **`/memory`** ist v2.1.59+ und wird in 01.04, 02.05, 04.03, 05.04 erklärt — bei Aktualisierungen konsistent halten.
- **Pro reicht für Claude Code** — die April-2026-Verwirrung um Plan-Tiers war eine Episode, nicht die aktuelle Realität.

## CI / Deploy (`.github/workflows/`)

- `deploy.yml` — Auto-Deploy auf GH-Pages bei `push` auf `main`
- `playwright.yml` — E2E auf jedem PR
- `research-stale.yml` — monatlicher Check auf Slides mit `researchedOn` > 90 Tage alt

Vor `npm run build` läuft immer `tsc -b --noEmit`. Build muss grün sein.

## PWA

`vite-plugin-pwa` ist im Build aktiv (`registerType: "prompt"`, Manifest in `vite.config.ts`). `src/components/PWAUpdatePrompt.tsx` rendert den Update-Hinweis. Icons (192/512 + maskable) werden via `node scripts/generate-pwa-icons.mjs` aus `public/brand/` regeneriert — bei Branding-Änderungen Pflicht.

`devOptions.enabled: false` heißt: PWA-Verhalten lokal **nur** im `npm run preview`-Build testbar, nicht im Dev-Server.

## Manuelle Smoke-Skripte

`scripts/verify-{desktop,mobile,splash,drawer-anim,live}.mjs` laden die App headless via Playwright und screenshoten — schneller als die volle E2E-Suite, brauchen aber laufenden `npm run dev` (außer `verify-live.mjs`).

## Bekannt flaky

- Playwright-Test „Scroll memory restores position" bei hohem Parallelism (RAF + Worker contention). Solo grün; im CI mit niedrigem Parallelism konsistent grün. Kein Bug-Fix-Anlass.
