# Slide-Refresh-Agent — Design

**Datum:** 2026-05-07
**Autor:** Christian Hubmann (mit Claude Code)
**Status:** Design approved, ready for implementation plan

## Ziel

Manuell aufrufbarer Agent, der das gesamte Workshop-Deck (~58 Slides) gegen seine Quellen prüft und einen strukturierten Drift-Report mit kopierfähigen Patches generiert. **Report-only** — der Agent ändert keine MDX-Dateien.

Use-Case: einmal pro Quartal vor einem Workshop ausführen, gefundene Drift cherry-picken.

## Non-Goals

- ❌ Kein Auto-Update von MDX-Dateien (Report-only)
- ❌ Keine PR-Automatisierung
- ❌ Keine GitHub-Action / Cron-Variante in v1
- ❌ Kein Cache zwischen Läufen
- ❌ Keine GitHub-API-Integration für Tool-Releases
- ❌ Keine Web-Suche (Brave o.ä.) — nur kuratierte Quellen

## Architektur

Two-Layer-Pattern: **Slash-Command-Orchestrator** + **Subagent-Worker** mit Fan-out pro Modul.

```
User in Claude-Session
       │
       ▼
/refresh-deck [scope?]
       │
       ├─ Parst src/lib/manifest.ts
       ├─ Bestimmt Scope (alle / ein Modul / eine Slide)
       │
       ▼
Parallel-Dispatch via Agent-Tool (1 Worker pro Modul)
       │
   ┌───┼───┬───┬───┬───┬───┬───┬───┐
   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼
  M00 M01 M02 M03 M04 M05 M06 M99
   │   │   │   │   │   │   │   │
   └───┴───┴───┴───┴───┴───┴───┴───┘
       │ (jeder Worker → strukturiertes Markdown)
       ▼
Aggregation in Main-Session
       │
       ▼
docs/refresh-reports/YYYY-MM-DD-deck-refresh.md
```

**Begründung Fan-out:** Bei 58 Slides würde ein einziger Worker den Kontext sprengen. Pro Modul ~6–11 Slides → ~2 KB Output pro Worker, parallelisierbar, fail-isolated.

## File-Layout

```
.claude/
├── commands/
│   └── refresh-deck.md            ← Slash-Command (Orchestrator)
└── agents/
    └── slide-refresh-worker.md    ← Subagent-Worker

docs/
└── refresh-reports/
    ├── README.md                  ← erklärt das Verzeichnis
    └── YYYY-MM-DD-deck-refresh.md ← generiert pro Lauf, committed
```

**Tool-List des Workers:** `Read`, `Grep`, `Glob`, `WebFetch`. Bewusst **kein** `Edit/Write/Bash` — garantiert read-only.

## Invocation

```
/refresh-deck                  # ganzes Deck, 8 Worker parallel
/refresh-deck 02               # nur Modul 02
/refresh-deck 02.05            # nur Slide 02.05
```

Slash-Command parst das Argument:
- leer → fan-out alle Module
- regex `^\d{2}$` → ein Worker für ein Modul
- regex `^\d{2}\.\d{2}$` → ein Worker für eine Slide

## Worker-Procedure (pro Slide)

Vier Phasen, scharf getrennt — verhindert Halluzinationen.

### Phase A — Bestandsaufnahme (offline, billig)

1. Read `src/content/MM-NN-*.mdx`
2. Frontmatter parsen: `{researchedOn, sources[]}`
3. Body scannen nach Drift-Pattern:
   - Versions-Patterns regex: `v\d+\.\d+\.\d+`, `claude-(opus|sonnet|haiku)-\d+-\d+`
   - Tool-Namen: `Cursor`, `Codex`, `Aider`, `OpenCode`, `Copilot`
   - CLI-Befehle: `claude`, `/memory`, `/loop`, `/permissions`, …
4. Sammle Claims als strukturierte Liste

### Phase B — Source-Health (Web, billig)

5. Für jede URL in `sources[]`: `WebFetch`
   - 200 → ok, Content für Phase C cachen
   - 301/302 → Befund: „Link redirected to X"
   - 404/410/Timeout → Befund: „Link tot"

### Phase C — Drift-Check (Web, teuer)

6. WebFetch jeder erreichbaren `sources[]`-URL → frischer Content
7. WebFetch hardcodierter kanonischer Docs für das Modul (siehe unten)
8. Pro Claim aus Phase A:
   - Vergleiche gegen frisch gefetchten Content
   - Klassifiziere: ✅ aligned · ⚠ unklar · 🔴 widersprochen
   - **Pflicht:** jeder 🔴/⚠ Befund braucht ein wörtliches Excerpt + URL

### Phase D — Output-Generierung

9. Pro Slide: Markdown-Block in Worker-Output-Format
10. Modul-Zusammenfassung am Ende

## Kanonische Quellen pro Modul

Hardcodiert im Worker-File. `sources[]` aus Frontmatter haben Vorrang; kanonische URLs sind Ergänzung für Versions- und Feature-Drift.

```yaml
canonical_sources:
  module_0: []  # Cover/Intro — keine Drift-Check nötig
  module_1:
    - https://www.anthropic.com/news/claude-code
    - https://docs.claude.com/en/docs/claude-code/overview
  module_2:
    - https://docs.claude.com/en/docs/claude-code/cli-reference
    - https://docs.claude.com/en/docs/claude-code/memory
    - https://docs.claude.com/en/docs/claude-code/settings
    - https://docs.claude.com/en/docs/claude-code/slash-commands
  module_3:
    - https://docs.claude.com/en/docs/claude-code/skills
    - https://docs.claude.com/en/docs/claude-code/sub-agents
    - https://modelcontextprotocol.io/specification
  module_4:
    - https://docs.claude.com/en/docs/claude-code/best-practices
  module_5:
    - https://docs.claude.com/en/docs/claude-code/security
  module_6: []  # Hands-on — keine Drift-Check nötig
  module_99: []  # Anhang — pro Slide individuell
```

## Worker-Output-Format

```markdown
## Module 02 — Setup & Konfiguration

### Slide 02.05 — Modellauswahl  🔴 outdated
**researchedOn:** 2026-05-04 (3 Tage alt)
**Sources:** ✅ alle 3 Links erreichbar

**Befunde:**

1. 🔴 **Versions-Drift** — Slide nennt `claude-sonnet-4-6`.
   Quelle https://docs.claude.com/...models am 2026-05-07: `claude-sonnet-4-7`
   ist GA seit 2026-04-29.

   *Excerpt:* > „The latest Sonnet model is claude-sonnet-4-7, released 2026-04-29."

   ```diff
   - Default: claude-sonnet-4-6 (Sonnet 4.6, beste Balance Preis/Qualität)
   + Default: claude-sonnet-4-7 (Sonnet 4.7, beste Balance Preis/Qualität)
   ```

2. ⚠ **Unklar** — Slide behauptet `/memory` ist „v2.1.59+".
   Konnte in offiziellen Docs keinen Versions-Hinweis finden.
   *Vorschlag:* Versions-Floor entfernen.

### Slide 02.06 — CLAUDE.md  ✅ current
researchedOn 2026-05-04 · alle Quellen ok · keine Drift entdeckt.

[…]

---

**Modul-Zusammenfassung:**
- Slides geprüft: 11
- ✅ current: 7
- ⚠ minor: 3
- 🔴 outdated: 1
- 💀 tote Links: 0
```

## Finaler Report (vom Orchestrator)

```markdown
# Slide Refresh Report — 2026-05-07

**Lauf:** 14:42 lokale Zeit · ~6 min · 8 parallele Worker

## Executive Summary

| | Slides | Anteil |
|---|---|---|
| ✅ current | 41 | 71 % |
| ⚠ minor drift | 12 | 21 % |
| 🔴 outdated | 5 | 8 % |
| 💀 tote Links | 3 | — |

**Top-Prioritäten:**
1. 🔴 02.05 Modellauswahl — Sonnet 4.6 → 4.7
2. 🔴 03.05 MCP — neue Spec-Version
3. 🔴 01.03 Tool-Landschaft — Aider archived
…

## Per-Modul

[8 Worker-Outputs nahtlos verkettet]

---

**Legende:** ✅ aligned · ⚠ unklar/leichte Drift · 🔴 widersprochen · 💀 tote Quelle
```

## Edge-Cases

| Fall | Verhalten |
|---|---|
| Slide ohne `sources[]` (Hands-on, Übungen) | Phase B/C überspringen, ✅ „kein Quellen-Check (Hands-on)" |
| Bilinguale Block-Slides (`<De>` / `<En>`) | Worker liest beide Blöcke. Drift-Check gegen Quellen läuft nur über DE-Text. Falls EN-Block strukturell vom DE abweicht (zusätzliche/fehlende Bullets, andere Zahlen) → separater ⚠-Befund „EN-Block ist keine Übersetzung des DE-Blocks" |
| Manifest-Inkonsistenz (Slide im Manifest, MDX fehlt — oder umgekehrt) | 🔴 strukturell, getrennte Report-Sektion am Ende |
| Zwei Läufe am selben Tag | Filename ab Lauf 2: `YYYY-MM-DD-HHMM-deck-refresh.md` |
| WebFetch fail (rate limit, network) | Slide bleibt ⚠ „check pending" — niemals stillschweigend ✅ |

## Risks + Mitigations

| Risiko | Mitigation |
|---|---|
| Halluzinierte Drift-Befunde | Worker-Prompt fordert wörtliches Excerpt + URL pro Befund. Kein Befund ohne Zitat. |
| WebFetch-Fehler maskiert als „kein Drift" | ⚠ „check pending" statt ✅ bei Fetch-Fehler |
| Token-Explosion bei großen Pages | Soft-Budget pro Worker: max. 6 `sources[]` + max. 3 kanonische URLs |
| Bilingual-Falschpositive | Vergleich nur DE-Text; semantischer Vergleich, nicht string-equal |
| Worker greift Edit/Write an | Tool-List im Subagent-File auf `Read, Grep, Glob, WebFetch` beschränkt |

## Open Decisions (vom User bestätigt)

1. **Wann läuft der Agent?** → Nur manuell in Claude-Session
2. **Scope pro Lauf?** → Ganzes Deck (mit Fan-out-Architektur)
3. **Aktion bei Drift?** → Patches im Report vorschlagen, nicht anwenden
4. **Drift-Signale?** → Inhalt + Source-Links + Versionen + Tool-Landschaft
5. **Recherche-Tools?** → `sources[]` + `WebFetch` für offizielle Docs (kein Web-Search, kein GitHub-API)
6. **Report committen?** → Ja, in `docs/refresh-reports/`

## Erfolgs-Kriterien

Der Agent gilt als erfolgreich gebaut, wenn:

1. `/refresh-deck 02.05` läuft in einer Claude-Session und produziert einen lesbaren Report-Block für eine Slide in unter 60 s
2. `/refresh-deck 02` produziert einen Modul-Report mit allen 11 Slides
3. `/refresh-deck` (ohne Args) startet 8 parallele Worker und schreibt einen finalen Report nach `docs/refresh-reports/`
4. Alle Drift-Befunde im Report enthalten wörtliches Excerpt + Source-URL
5. Der Worker schlägt nie Auto-Edits vor und hat keinen `Edit/Write`-Tool-Zugriff
6. Bei einem WebFetch-Fehler bleibt die Slide ⚠ statt ✅ — verifizierbar durch absichtlich ungültige `sources[]`-URL

## Implementation outline (für writing-plans)

1. Slash-Command `.claude/commands/refresh-deck.md` schreiben
2. Subagent `.claude/agents/slide-refresh-worker.md` schreiben (mit kanonischen Quellen, Phasen-Anweisungen, Output-Format)
3. `docs/refresh-reports/README.md` mit Erklärung anlegen
4. End-to-End-Test mit `/refresh-deck 02.05` (eine Slide)
5. Skalierungs-Test mit `/refresh-deck 02` (ein Modul)
6. Vollständiger Lauf `/refresh-deck` und Review des Reports
7. Iteration basierend auf erstem Report-Output

---

**Status:** Design approved. Bereit für Implementations-Plan via `writing-plans`-Skill.
