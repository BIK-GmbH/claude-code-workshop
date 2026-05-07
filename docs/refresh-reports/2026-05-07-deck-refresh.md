# Slide Refresh Report — 2026-05-07

**Lauf:** 15:49 lokale Zeit · ~5 min · 8 parallele Worker
**Scope:** whole deck

## Executive Summary

| Status | Slides | Anteil |
|---|---|---|
| ✅ current | 29 | 54 % |
| ⚠ minor drift | 21 | 39 % |
| 🔴 outdated | 2 | 4 % |
| 💀 tote Links | 2 | — |
| ⏳ pending | 2 | 4 % |

**Total Slides geprüft:** 54

**Top-Prioritäten:**

1. 🔴 **01.04 Wie LLMs denken** — EN/DE-Inkonsistenz: DE-Block verweist auf „Modul 2.06", EN-Block auf „Module 2.04" für CLAUDE.md-Scopes
2. 🔴 **99.02 Skill-Vorlage** — `sources[]`-URL `https://github.com/BIK-GmbH/cdb-skills/tree/main/skills/youtube-knowledge-extractor` liefert HTTP 404

**Tote Links (separat von Slide-Status):**

- `https://www.anthropic.com/news/claude-code` (kanonische Modul-1-URL, **nicht** in Slide-`sources[]`) — 404. Empfehlung: kanonische Quelle in `slide-refresh-worker.md` auf `https://code.claude.com/docs/en/overview` aktualisieren.
- `https://github.com/BIK-GmbH/cdb-skills/tree/main/skills/youtube-knowledge-extractor` — 404 (Slide 99.02).

**Pending (WebFetch-Limitation):**

- 00.05 + 06.07 — beide referenzieren YouTube-Videos. WebFetch lädt nur YouTube-Footer/Nav, kein Transkript. Empfehlung: manuelle Verifikation der Zitate, oder Sekundärquelle (Blog-Post, Artikel) in `sources[]` ergänzen.

**Mustererkennung:**

Modul 02 und 05 dominieren die ⚠-Liste (12 von 21 minor drifts). Häufigste Drift-Klassen:
- **Provider-Caveats** (Bedrock/Vertex/Foundry verhalten sich anders als Anthropic-API direkt) — Module 02, 03
- **`/cost` ist heute Alias für `/usage`** — taucht in 02.04, 02.07 und 99.03 auf
- **Default-Modell-Switch ab 2026-04-23** auf Opus 4.7 für Enterprise PAYG + API — Modul 02
- **Bundled Skills** (`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`) sind seit 2026 fest gebündelt — Modul 02 und 03 erwähnen das nicht
- **EN/DE-Inkonsistenzen** in Modul-Verweisen — 01.04 (das einzige 🔴 dieser Klasse)
- **GitHub-Star-Count-Drift** auf 99.08 (5 SkillCards mit veralteten Stars)

---

## Per-Modul

### Module 00 — Intro

### Slide 00.01 — Claude Code Workshop  ✅ current
researchedOn 2026-05-06 (1 Tag alt) · keine `sources[]` (Cover-Slide) · keine Drift entdeckt.

### Slide 00.02 — Begrüßung & Tagesablauf  ✅ current
researchedOn 2026-05-06 (1 Tag alt) · keine `sources[]` (Organisations-Slide) · keine Drift entdeckt.

### Slide 00.03 — Lernziele  ✅ current
researchedOn 2026-05-04 (3 Tage alt) · keine `sources[]` (Lernziel-Slide, intern) · keine Drift entdeckt.

### Slide 00.04 — Agenda — die 6 Module  ✅ current
researchedOn 2026-05-06 (1 Tag alt) · keine `sources[]` (Agenda-Slide, intern) · keine Drift entdeckt.

### Slide 00.05 — Die größere Vision — AI als Operating System  ⏳ pending
**researchedOn:** 2026-05-06 (1 Tag alt)
**Sources:** ⚠ 1/1 erreichbar (Redirect: `youtu.be/bk46OxGjOFo` → `youtube.com/watch?v=bk46OxGjOFo`) · WebFetch konnte YouTube-Transkript nicht extrahieren (nur Footer/Nav geladen)

**Befunde:**

1. ⚠ **Source-Redirect (strukturell)** — Die Kurz-URL `youtu.be/bk46OxGjOFo` wird per HTTP 303 auf die kanonische YouTube-URL umgeleitet.

   *Excerpt:* > "REDIRECT DETECTED: ... Status: 303 See Other ... Redirect URL: https://www.youtube.com/watch?v=bk46OxGjOFo"
   *Quelle:* WebFetch-Response, gefetcht am 2026-05-07

   ```diff
   - - https://youtu.be/bk46OxGjOFo
   + - https://www.youtube.com/watch?v=bk46OxGjOFo
   ```

2. ⚠ **Inhalts-Verifikation nicht möglich** — Drei zentrale Slide-Aussagen (Y-Combinator-Framework, Autor „Bo Sar", Zitate) konnten gegen die YouTube-Quelle nicht verifiziert werden.

   *Vorschlag:* Manuell prüfen ODER alternative Sekundärquelle ergänzen.

---

**Module-Zusammenfassung (M00):**
- Slides geprüft: 5
- ✅ current: 4
- ⚠ minor: 0
- 🔴 outdated: 0
- 💀 tote Links: 0
- ⏳ Status pending (WebFetch fail): 1

---

### Module 01 — Grundlagen & Mindset

### Slide 01.01 — Was Claude Code ist (und was nicht)  ⚠ minor drift
**researchedOn:** 2026-05-04 (3 Tage alt)
**Sources:** ⚠ 2/3 erreichbar · 💀 1 tot: https://www.anthropic.com/news/claude-code (kanonische Modul-1-URL aus Worker-Tabelle, nicht aus Slide-`sources[]`)

**Befunde:**

1. ⚠ **Tote kanonische Quelle** — `https://www.anthropic.com/news/claude-code` liefert HTTP 404.

   *Excerpt:* > "The server returned HTTP 404 Not Found."
   *Quelle:* https://www.anthropic.com/news/claude-code, gefetcht am 2026-05-07

   *Vorschlag:* Canonical-Sources-Table im Worker (Modul 1) auf `https://code.claude.com/docs/en/overview` aktualisieren.

2. ⚠ **Framing „lebt direkt im Terminal"** — Strukturelle Drift gegenüber Multi-Surface-Positioning (Terminal, VS Code, JetBrains, Desktop, Web).

   *Excerpt:* > "Available in your terminal, IDE, desktop app, and browser."
   *Quelle:* https://code.claude.com/docs/en/overview, gefetcht am 2026-05-07

   ```diff
   - Claude Code ist ein **agentischer Coding-Assistent**, der direkt im Terminal lebt und mit eurer Codebasis arbeitet
   + Claude Code ist ein **agentischer Coding-Assistent** (Terminal-CLI, VS-Code-/JetBrains-Plugin, Desktop-App, Web), der direkt mit eurer Codebasis arbeitet
   ```

### Slide 01.02 — Vibe vs. Frust vs. Augmented  ✅ current
researchedOn 2026-05-04 · alle Quellen erreichbar · keine Drift entdeckt.

### Slide 01.03 — Tool-Landschaft 2026  ⚠ minor drift
**researchedOn:** 2026-05-06 (1 Tag alt)
**Sources:** ✅ 4/4

**Befunde:**

1. ⚠ **Snapshot-Disclaimer korrekt, aber Detail-Pricing/Defaults driften monatlich.**

   *Vorschlag:* Bei nächstem Audit die Claude-Code-Zelle um „+ IDE-Plugins + Desktop + Web" erweitern (konsistent zu 01.01-Fix).

### Slide 01.04 — Wie LLMs denken  🔴 outdated
**researchedOn:** 2026-05-06 (1 Tag alt)
**Sources:** ✅ 2/2 erreichbar

**Befunde:**

1. 🔴 **EN/DE-Inkonsistenz: Modul-Verweis** — DE-Block: „Modul 2.06"; EN-Block: „Module 2.04" für CLAUDE.md-Scopes.

   *Excerpt:* > "→ CLAUDE.md gibt es selbst in **vier Scopes** (Managed / Project / User / Local) — Details in **Modul 2.06**." (DE) vs. „... details in **Module 2.04**." (EN)
   *Quelle:* `src/content/01-04-how-llms-think.mdx`

   ```diff
   - → CLAUDE.md itself comes in **four scopes** (Managed / Project / User / Local) — details in **Module 2.04**.
   + → CLAUDE.md itself comes in **four scopes** (Managed / Project / User / Local) — details in **Module 2.06**.
   ```
   (CLAUDE.md-Scopes-Slide ist 02.06 — die DE-Version stimmt, EN ist falsch)

2. ⚠ **„abhängig von Plan und Provider"** unscharf. Doku ist präziser: Bedrock/Vertex/Foundry haben keinen automatischen 1M-Upgrade.

   *Excerpt:* > "On Max, Team, and Enterprise plans, Opus is automatically upgraded to 1M context with no additional configuration."
   *Quelle:* https://code.claude.com/docs/en/model-config

   *Vorschlag:* Halbsatz ergänzen.

3. ⚠ **MEMORY.md vs. Topic-Files Loading-Verhalten** — Topic-Files werden on-demand geladen, nicht automatisch.

   *Excerpt:* > "Topic files like `debugging.md` or `patterns.md` are not loaded at startup. Claude reads them on demand"
   *Quelle:* https://code.claude.com/docs/en/memory

### Slide 01.05 — Übung: Eigene Position formulieren  ✅ kein Quellen-Check (Hands-on-Slide)

---

**Module-Zusammenfassung (M01):**
- Slides geprüft: 5
- ✅ current: 2
- ⚠ minor: 2
- 🔴 outdated: 1
- 💀 tote Links: 1 (kanonische Worker-URL)
- ⏳ Status pending: 0

---

### Module 02 — Setup & Konfiguration

### Slide 02.01 — Hardware-Setup  ✅ current

### Slide 02.02 — Software-Stack  ✅ current

### Slide 02.03 — Installation  ⚠ minor drift

1. ⚠ **Hardware-Anforderung fehlt:** Doku nennt „4 GB+ RAM, x64 oder ARM64". Vertretbar, da auf 02.01 erwähnt.
2. ⚠ **`/doctor` vs. `claude doctor`:** Slide ist korrekt für Session-Variante.

### Slide 02.04 — Authentifizierung & Provider  ⚠ minor drift

1. ⚠ **`/cost` ist heute Alias für `/usage`** — beide öffnen denselben Screen.

   *Excerpt:* > "`/cost` | Alias for `/usage`"
   *Quelle:* https://code.claude.com/docs/en/commands

   ```diff
   - /cost                      # in laufender Session: was hat dieser Run gekostet?
   - /usage                     # Übersicht über Session-Verbräuche
   - /status                    # aktiver Account, Modell, Provider
   + /usage                     # Session-Kosten + Plan-Limits + Stats (`/cost` und `/stats` sind Aliase)
   + /status                    # aktiver Account, Modell, Provider
   ```

2. ⚠ **Auth-Precedence ungenau:** `ANTHROPIC_AUTH_TOKEN` (Bearer) hat höhere Priorität als `ANTHROPIC_API_KEY`.

### Slide 02.05 — Modellauswahl  ⚠ minor drift

1. ⚠ **Provider-Resolution fehlt:** Anthropic-API: Opus 4.7 / Sonnet 4.6 · Bedrock/Vertex/Foundry: Opus 4.6 / Sonnet 4.5.

2. ⚠ **Default-Modell-Aussage präzisieren** (ab 2026-04-23 Enterprise PAYG + API auf Opus 4.7).

   *Excerpt:* > "On April 23, 2026, the default model for Enterprise pay-as-you-go and Anthropic API users will change to Opus 4.7."
   *Quelle:* https://code.claude.com/docs/en/model-config

   ```diff
   - **Default für viele Teams/API-Setups:** Sonnet 4.6 — starkes Preis-Leistungs-Verhältnis
   + **Default je Plan:** Max/Team-Premium → Opus 4.7 · Pro/Team-Standard/Enterprise → Sonnet 4.6 · Bedrock/Vertex/Foundry → Sonnet 4.5 (ab 2026-04-23 Enterprise-PAYG + API auf Opus 4.7 umgestellt)
   ```

3. ⚠ **`opus[1m]`-Verfügbarkeit detailieren:** Max/Team/Enterprise-Plans haben Opus mit 1M automatisch.

### Slide 02.06 — CLAUDE.md — das Projektgedächtnis  ⚠ minor drift

1. ⚠ **Auto-Memory + `.claude/rules/` fehlen:** Doku unterscheidet seit 2026 explizit zwischen CLAUDE.md (User schreibt) und Auto-Memory (Claude schreibt selbst).

2. ⚠ **Windows-Managed-Path fehlt:** `C:\Program Files\ClaudeCode\CLAUDE.md`.

   ```diff
   - | **Managed** *(IT)* | `/Library/Application Support/ClaudeCode/CLAUDE.md` (mac) · `/etc/claude-code/CLAUDE.md` (linux) | …
   + | **Managed** *(IT)* | `/Library/Application Support/ClaudeCode/CLAUDE.md` (mac) · `/etc/claude-code/CLAUDE.md` (linux/WSL) · `C:\Program Files\ClaudeCode\CLAUDE.md` (windows) | …
   ```

3. ⚠ **„Spezifischere Scopes überschreiben generelle nicht":** Doku sagt teils das Gegenteil. Empfehlung: „werden konkateniert; bei Widerspruch gewinnt der spezifischere Scope".

### Slide 02.07 — Slash Commands  ⚠ minor drift

1. ⚠ **`/cost` Alias-Hinweis**, wie 02.04.
2. ⚠ **Bundled-Skill-Markierung fehlt:** `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api` sind bundled skills.
3. ⚠ **`CLAUDE_CODE_NEW_INIT=1`** für Interactive-Multi-Phase-Flow nicht erwähnt.

### Slide 02.08 — Scheduled Tasks: /loop  ⚠ minor drift

1. ⚠ **Bedrock/Vertex/Foundry-Caveats fehlen:** Dort läuft `/loop <prompt>` ohne Intervall fix alle 10 Minuten statt dynamisch.
2. ⚠ **`loop.md` 25 KB Truncation-Cap** nicht erwähnt.
3. ⚠ **`Esc` betrifft nur `/loop`-Tasks**, nicht ad-hoc Reminders.

### Slide 02.09 — Plan Mode  ✅ current

### Slide 02.10 — Permissions & sichere Defaults  ⚠ minor drift

1. ⚠ **`acceptEdits` umfasst** konkret `mkdir`, `touch`, `rm`, `rmdir`, `mv`, `cp`, `sed`. Workshop-TN sollten wissen, dass `git commit` NICHT darunter fällt.
2. ⚠ **`bypassPermissions` v2.1.126+ neue Semantik:** schließt Writes auf Protected Paths ein.
3. ⚠ **`Bash(rm -rf *)` Wildcard-Beispiel** gibt falsche Sicherheit. NoteCard mit „Wildcards sind kein vollständiger Schutz".

### Slide 02.11 — Hands-on: erste CLAUDE.md  ✅ kein Quellen-Check (Hands-on-Slide)

---

**Module-Zusammenfassung (M02):**
- Slides geprüft: 11
- ✅ current: 4
- ⚠ minor: 7
- 🔴 outdated: 0
- 💀 tote Links: 0
- ⏳ Status pending: 0

Hauptmuster: didaktisch korrekt, aber zunehmend lückig — überall kleine Provider-Caveats und Versions-Updates seit 2026-04. Empfehlung: gezielter Refresh-Pass statt Komplettüberarbeitung.

---

### Module 03 — Skills, Subagents & MCP

### Slide 03.01 — Was sind Skills?  ⚠ minor drift

1. ⚠ **`when_to_use`-Frontmatter-Feld** als optionalen Trigger-Hinweis ergänzen.
2. ⚠ **Bundled Skills** (`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`) erwähnen.

   ```diff
   + **Bundled:** Ab Werk verfügbar (`/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`) — siehe `/help`
   ```

### Slide 03.02 — SKILL.md & Trigger  ⚠ minor drift

1. ⚠ **Source-Mismatch:** `agent-sdk/skills` beschreibt SDK, nicht CLI-Authoring. `https://code.claude.com/docs/en/skills` ist die richtige Source.

   ```diff
   sources:
   -  - https://code.claude.com/docs/en/slash-commands
   -  - https://code.claude.com/docs/en/agent-sdk/skills
   +  - https://code.claude.com/docs/en/skills
   +  - https://code.claude.com/docs/en/slash-commands
   ```

2. ⚠ **`model`-Beschreibung präziser:** Override gilt nur für aktuellen Turn.

### Slide 03.03 — Eigene Skills schreiben  ✅ current

### Slide 03.04 — Subagents  ⚠ minor drift

1. ⚠ **`tools`-YAML-Syntax:** Doku-Beispiele nutzen komma-separierten String, nicht Liste.
2. ⚠ **Modell-Aliasse vs. Full-IDs** (`opus` vs. `claude-opus-4-7`) für reproduzierbare Builds erwähnen.
3. ⚠ **`@agent-code-reviewer`-Pattern:**

   ```diff
   - Mit `@agent-code-reviewer` erzwingt ihr den konkreten Agent
   + Mit `@agent-code-reviewer` wählt ihr den konkreten Agent für die Delegation aus (Claude formuliert weiterhin den Prompt)
   ```

### Slide 03.05 — MCP-Server  ✅ current

### Slide 03.06 — Hands-on: Skill bauen  ✅ kein Quellen-Check (Hands-on-Slide)

---

**Module-Zusammenfassung (M03):**
- Slides geprüft: 6
- ✅ current: 3
- ⚠ minor: 3
- 🔴 outdated: 0

---

### Module 04 — Spec-Driven Development

### Slide 04.01 — Vom Prompt zur Spec  ⚠ minor drift

1. ⚠ **Quellen-Mismatch (Anti-Goals):** Addy-Osmani-Artikel verwendet den Begriff nicht.
   *Vorschlag:* „Anti-Goals" als BIK-Erweiterung kennzeichnen oder spezifische Quelle ergänzen (Shape-Up).

### Slide 04.02 — Plan-First-Ansatz  ✅ current

### Slide 04.03 — Kontext-Management  ✅ current
Auto-Memory v2.1.59+, 200 Zeilen / 25 KB, Pfad und „Bei zwei Korrekturen → /clear" alle verbatim bestätigt.

### Slide 04.04 — Review-Loops  ✅ current
`code-reviewer` und `security-reviewer` als kanonische Beispiele in der Doku.

### Slide 04.05 — Test-First mit Claude Code  ✅ current

### Slide 04.06 — Hands-on: Spec → Code  ✅ kein Quellen-Check (Hands-on-Slide)

---

**Module-Zusammenfassung (M04):**
- Slides geprüft: 6
- ✅ current: 5
- ⚠ minor: 1
- 🔴 outdated: 0

Modul 4 ist insgesamt sehr quellen-treu. Einziger Schwachpunkt: Anti-Goals-Quelle.

---

### Module 05 — Best Practices, Anti-Patterns & Sicherheit

### Slide 05.01 — Wann delegieren  ✅ current

### Slide 05.02 — Typische Anti-Patterns  ⚠ minor drift

1. ⚠ **Source-Coverage-Drift:** Addy-Osmani-Artikel deckt nur 3 der 8 Anti-Patterns ab.

   ```diff
   sources:
     - https://addyosmani.com/blog/good-spec/
   + - https://code.claude.com/docs/en/best-practices
   ```

   Best-Practices-Doku deckt „trust-then-verify gap", „kitchen sink session", „correcting over and over", „over-specified CLAUDE.md", „infinite exploration" verbatim ab.

2. ⚠ **800 Zeilen vs. 200 Zeilen:** Slide nennt „800 Zeilen" als Anti-Pattern-Schwelle. Doku-Schwelle ist 200 Zeilen — bereits korrekt im Fix-Hinweis.

### Slide 05.03 — Halluzinationen erkennen  ⚠ minor drift

1. ⚠ **Frontmatter strukturell:** Slide hat **kein** `sources[]`. Mindestens kanonische Best-Practices-Seite ergänzen.

   ```diff
   ---
   title:
     de: "Halluzinationen erkennen"
     en: "Detecting Hallucinations"
   researchedOn: 2026-05-04
   + sources:
   +   - https://code.claude.com/docs/en/best-practices
   ---
   ```

### Slide 05.04 — Sicherheit & Secrets  ⚠ minor drift

1. ⚠ **Numerierungs-Inkonsistenz:** Header sagt „fünf wichtigsten Regeln", Body hat **sieben** Sektionen.

   ```diff
   - ## Die fünf wichtigsten Regeln
   + ## Die sieben wichtigsten Regeln
   ```
   ```diff
   - ## The five most important rules
   + ## The seven most important rules
   ```

### Slide 05.05 — Compliance & IP  ⚠ minor drift

1. ⚠ **Schwache EU-AI-Act-Quelle:** `artificialintelligenceact.eu/the-act/` ist Index-Seite ohne Substanz.

   ```diff
   - - https://artificialintelligenceact.eu/the-act/
   + - https://artificialintelligenceact.eu/high-level-summary/
   ```

### Slide 05.06 — Team-Konventionen  ⚠ minor drift

1. ⚠ **`/doctor` vs. `claude doctor`:** Setup-Doku nutzt `claude doctor` (Bash), nicht Slash-Command.

   ```diff
   - 1. **Tag 1:** Claude Code installieren, `claude --version`, `/doctor`, eigene `~/.claude/CLAUDE.md`
   + 1. **Tag 1:** Claude Code installieren, `claude --version`, `claude doctor`, eigene `~/.claude/CLAUDE.md`
   ```
   (analog im EN-Block)

---

**Module-Zusammenfassung (M05):**
- Slides geprüft: 6
- ✅ current: 1
- ⚠ minor: 5
- 🔴 outdated: 0

---

### Module 06 — Hands-on

### Slide 06.01 — Vorgehen + Pfad-Wahl  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 06.02 — Pfad B: Mindshift-Starter  ✅ current
Tech-Stack, PRD-Filenamen, 15-Schritte-Plan, Recall-Inspiration alle verbatim bestätigt.

### Slide 06.03 — Live-Coding mit Trainer-Begleitung  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 06.04 — Q&A — eure Fragen  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 06.05 — Retrospektive  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 06.06 — Plan für die nächsten 2 Wochen  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 06.07 — Ausblick: Vom individuellen Skill zum Business Brain  ⏳ Status pending

YouTube-Inhalt nicht via WebFetch extrahierbar. Quote „A queryable company..." manuell verifizieren oder Sekundärquelle ergänzen.

---

**Module-Zusammenfassung (M06):**
- Slides geprüft: 7
- ✅ current: 6 (1 mit Quellen-Check, 5 Hands-on)
- ⚠ minor: 0
- 🔴 outdated: 0
- ⏳ Status pending: 1

---

### Module 99 — Anhang

### Slide 99.01 — CLAUDE.md-Vorlage  ✅ current

### Slide 99.02 — Skill-Vorlage  🔴 outdated

1. 🔴 **Tote Quelle:** `https://github.com/BIK-GmbH/cdb-skills/tree/main/skills/youtube-knowledge-extractor` → HTTP 404.

   *Excerpt:* > "The server returned HTTP 404 Not Found."
   *Quelle:* https://github.com/BIK-GmbH/cdb-skills/tree/main/skills/youtube-knowledge-extractor, gefetcht am 2026-05-07

   ```diff
   - sources:
   -   - https://github.com/BIK-GmbH/cdb-skills/tree/main/skills/youtube-knowledge-extractor
   + sources:
   +   - <neue / aktuelle URL des cdb-skills-Repos einsetzen, oder Eintrag entfernen falls Repo privat>
   ```

   Note: Repo ist privat (siehe frühere `gh`-Abfrage in dieser Session) — die URL ist korrekt, aber für unauthentifizierte WebFetch-Calls 404. **Nicht** löschen, ggf. Footer-Note ergänzen.

2. ⚠ **Modell-Pin im Skeleton:** `claude-sonnet-4-6` als Beispiel. Optional Kommentar: `# oder claude-opus-4-7 für Top-Effort`.

### Slide 99.03 — Cheat-Sheet: CLI  ⚠ minor drift

1. ⚠ **Lang- vs. Kurzform:** Doku bewirbt `claude -c` und `claude -r`. Beide Formen zeigen.

   ```diff
   - claude --continue            # vorherige Session fortsetzen (-c)
   - claude --resume <session-id> # spezifische Session laden
   + claude -c                    # vorherige Session fortsetzen (--continue)
   + claude -r "<id-oder-name>"   # spezifische Session laden (--resume)
   ```

2. ⚠ **`/cost` ist Alias:**

   ```diff
   - /cost                        # Kosten dieser Session
   - /usage                       # Detail-Verbrauch
   + /usage                       # Kosten + Plan-Limits + Stats (Alias: /cost, /stats)
   ```

### Slide 99.04 — Cheat-Sheet: Tasten in diesem Deck  ✅ current

### Slide 99.05 — Ressourcen & Links  ⚠ minor drift

1. ⚠ **Repo umbenannt:** `anthropics/anthropic-cookbook` → `anthropics/claude-cookbooks`.

   ```diff
   - **Anthropic Cookbook** → https://github.com/anthropics/anthropic-cookbook
   + **Claude Cookbooks** → https://github.com/anthropics/claude-cookbooks
   ```

### Slide 99.06 — Changelog  ✅ current

### Slide 99.07 — Trainer-Demos  ✅ kein Quellen-Check (Hands-on-Slide)

### Slide 99.08 — Top Skills — Living Catalog  ⚠ minor drift

1. ⚠ **Star-Count-Drift (5 SkillCards):**
   - `anthropics/skills`: 127k → 130k
   - `thedotmack/claude-mem`: 72k → 73k
   - `JuliusBrussee/caveman`: 53k → 56k (zusätzlich: „65 % Token-Reduktion" → „~75 % weniger Output-Tokens" laut Repo)
   - `jarrodwatts/claude-hud`: 21k → 22k

2. ⚠ **`/ultrareview` Free-Trial-Frist abgelaufen** (war bis 2026-05-05). Aktuelle Aussage „kostenpflichtig pro Run" stimmt jetzt — kein Diff nötig, aber Übergangs-Hinweis fehlte.

3. ⚠ **`code-reviewer`-Subagent-Modell-Pin:** `model: claude-opus-4-7` ist nur auf Max-Plan verfügbar. Kommentar ergänzen.

   *Hinweis:* In dieser Audit-Session wurden nur 6 von ~14 SkillCards einzeln verifiziert (Zeit-/Fetch-Budget). Empfehlung: dedizierte 99.08-Star-Refresh-Runde via GitHub-API.

---

**Module-Zusammenfassung (M99):**
- Slides geprüft: 8
- ✅ current: 4
- ⚠ minor: 3
- 🔴 outdated: 1
- 💀 tote Links: 1

---

**Legende:** ✅ aligned · ⚠ unklar/leichte Drift · 🔴 widersprochen · 💀 tote Quelle · ⏳ check pending
