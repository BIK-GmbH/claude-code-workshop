# Slide-Refresh-Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a manually-triggered Claude Code subagent (`/refresh-deck`) that audits the entire workshop deck against documentation sources and produces a structured, copy-paste-ready drift report.

**Architecture:** Two-layer pattern. A slash command `/refresh-deck` parses scope arguments, then dispatches parallel `slide-refresh-worker` subagent invocations (one per module) and aggregates their structured Markdown into a single report file under `docs/refresh-reports/`. Workers are read-only (`Read`, `Grep`, `Glob`, `WebFetch` only) and emit findings with verbatim source quotes plus copy-paste diff patches — no auto-edit of MDX.

**Tech Stack:** Markdown config files (`.claude/commands/*.md`, `.claude/agents/*.md`), the Claude Code Agent dispatch tool, WebFetch.

**Spec:** `docs/superpowers/specs/2026-05-07-slide-refresh-agent-design.md`

---

## File Structure

| File | Purpose | Type |
|---|---|---|
| `.claude/agents/slide-refresh-worker.md` | The Worker. Audits one module/slide, emits structured Markdown. Has only read + WebFetch tools. | Subagent definition |
| `.claude/commands/refresh-deck.md` | The Orchestrator. Parses args, dispatches workers, aggregates report, writes file. | Slash command |
| `docs/refresh-reports/README.md` | Explains the directory: what reports look like, how to read them, who generates them. | Static doc |
| `docs/refresh-reports/YYYY-MM-DD-deck-refresh.md` | Generated per run. Committed for historical drift tracking. | Generated artifact |

**Convention:** No helper scripts, no JS, no tests-against-the-prompts (the prompts ARE the code). "Tests" = smoke runs via `/refresh-deck` itself, verified by reading the produced report.

**Why no automated tests:** The artifact is a Claude prompt. The behaviour can only be verified by running it against a real LLM with real WebFetch. We define explicit smoke-test scenarios as plan steps instead.

---

## Task 1: Reports directory + README

**Files:**
- Create: `docs/refresh-reports/README.md`

- [ ] **Step 1: Create the directory and README**

```bash
mkdir -p docs/refresh-reports
```

Write `docs/refresh-reports/README.md`:

```markdown
# Refresh Reports

Drift-Audits des Workshop-Decks, generiert vom `/refresh-deck` Slash-Command.

## Wann/wie wird hier reingeschrieben?

Ein Lauf von `/refresh-deck` (in einer Claude-Code-Session) erzeugt eine Datei
`YYYY-MM-DD-deck-refresh.md`. Bei mehreren Läufen am selben Tag bekommt die
zweite Datei ein `HHMM`-Suffix.

## Was steht drin?

Pro Slide ein Block mit Status (`✅ current`, `⚠ minor`, `🔴 outdated`,
`💀 tote Links`), Befunden mit wörtlichen Quellen-Zitaten und kopierfähigen
Diff-Patches.

## Wie nutze ich einen Report?

1. Executive Summary lesen — Top-Prioritäten zuerst
2. Pro 🔴-Befund: Diff-Block aus dem Report in die zugehörige
   `src/content/MM-NN-*.mdx` übertragen
3. `researchedOn` in den geänderten Slides auf das aktuelle Datum setzen
4. Eintrag in `src/content/99-06-changelog.mdx` ergänzen
5. Build + Tests grün → committen

## Wer generiert das?

`/refresh-deck` (Slash-Command) → dispatcht `slide-refresh-worker`-Subagent pro
Modul → aggregiert die Ergebnisse hier rein. Beide leben unter `.claude/`.
```

- [ ] **Step 2: Commit**

```bash
git add docs/refresh-reports/README.md
git commit -m "docs: add refresh-reports/ directory with README"
```

---

## Task 2: Worker-Subagent

**Files:**
- Create: `.claude/agents/slide-refresh-worker.md`

- [ ] **Step 1: Verify .claude/agents/ exists**

```bash
mkdir -p .claude/agents
ls .claude/agents/
```

Expected: empty or pre-existing files (project may already have other agents).

- [ ] **Step 2: Write the worker file**

Write `.claude/agents/slide-refresh-worker.md` with this exact content:

````markdown
---
name: slide-refresh-worker
description: Audits one workshop module (or single slide) for drift against documentation sources. Returns a structured Markdown report block. READ-ONLY — never modifies MDX files. Dispatched by the /refresh-deck slash command.
tools: Read, Grep, Glob, WebFetch
---

# Slide-Refresh-Worker

You audit Claude Code Workshop slides for drift against their documentation sources. You return a structured Markdown block — you never modify files.

## Input

The dispatching prompt tells you EITHER:

- `module=NN` → audit every slide in that module
- `slide=NN.MM` → audit only one slide

If neither is given, ask the dispatcher what scope you should audit and stop.

## Tooling

You have ONLY: `Read`, `Grep`, `Glob`, `WebFetch`. No `Edit`, no `Write`, no `Bash`. If you find yourself wanting to fix something, you must write the fix as a `diff` block in the report — never edit a file.

## Procedure (run for each slide in scope)

### Phase A — Inventory (offline)

1. Use `Glob` `src/content/MM-NN-*.mdx` to find the slide file (or files for a whole module).
2. `Read` each MDX file.
3. Parse the YAML frontmatter:
   - `title.de`, `title.en`
   - `researchedOn` (YYYY-MM-DD)
   - `sources[]`
4. Scan the body for drift-prone patterns:
   - Versions: regex `v\d+\.\d+\.\d+`, `claude-(opus|sonnet|haiku)-\d+-\d+`
   - Tool names: `Cursor`, `Codex`, `Aider`, `OpenCode`, `Copilot`, `Cline`
   - CLI commands: `claude`, `/memory`, `/loop`, `/permissions`, `/agents`, `/init`, etc.
5. Build a list of Claims: `{quote, line, type: version|tool|cli|fact}`.

### Phase B — Source-Health (web, cheap)

For each URL in `sources[]` (max 6 — audit the first 6 and note skipped):

- `WebFetch` with prompt: "Confirm this page exists. Return only the page title and its `last-modified` if visible."
- HTTP 200 → ok, hold the response for Phase C
- 301/302/redirect → finding: "Link redirected to <new URL>"
- 404/410/timeout/network error → finding: "Link tot (status: <…>)"

### Phase C — Drift-Check (web, expensive)

1. For each reachable `sources[]` URL: `WebFetch` with prompt: "Extract verbatim quotes from this page that discuss: <claim summary>. List each quote with its surrounding context."
2. For canonical URLs of this slide's module (see table below — max 3): same procedure.
3. For each Claim from Phase A:
   - Compare against the fetched content semantically (NOT string-equal).
   - Classify: `✅ aligned`, `⚠ unklar`, `🔴 widersprochen`.
   - **Mandatory:** every `⚠`/`🔴` finding requires a verbatim quote + the source URL. No finding without a quote.

### Phase D — Output

Emit one Markdown block per slide using the format below. After all slides, emit a module summary.

## Canonical sources by module

Use these IN ADDITION to per-slide `sources[]` for module-wide drift checks:

```yaml
module_0: []                                  # Intro — skip drift check
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
module_6: []                                  # Hands-on — skip
module_99: []                                 # Annex — per-slide individual sources only
```

Hard cap: max 3 canonical URLs fetched per worker invocation, even if more are listed (pick the most module-relevant).

## Output format

For EACH slide processed, emit one block:

```markdown
### Slide MM.NN — <Title (DE)>  <STATUS-EMOJI> <STATUS-WORD>
**researchedOn:** YYYY-MM-DD (N Tage alt)
**Sources:** ✅ N/N erreichbar
   ODER bei Problemen:
**Sources:** ⚠ N/N erreichbar · 💀 1 tot: <URL>

**Befunde:**

1. 🔴 **<Type, z.B. Versions-Drift>** — <einzeilige Beschreibung>

   *Excerpt:* > "<verbatim Zitat aus Quelle>"
   *Quelle:* <URL>, gefetcht am <YYYY-MM-DD>

   ```diff
   - <aktueller MDX-Inhalt>
   + <vorgeschlagener Inhalt>
   ```

2. ⚠ **<Type>** — <Beschreibung>

   *Excerpt:* > "..."
   *Quelle:* <URL>

   *Vorschlag:* <kurze Empfehlung — kein Diff wenn unklar>
```

If a slide has zero findings:

```markdown
### Slide MM.NN — <Title>  ✅ current
researchedOn YYYY-MM-DD · alle Quellen erreichbar · keine Drift entdeckt.
```

After ALL slides in scope, emit:

```markdown
---

**Module-Zusammenfassung (M<NN>):**
- Slides geprüft: N
- ✅ current: N
- ⚠ minor: N
- 🔴 outdated: N
- 💀 tote Links: N
- ⏳ Status pending (WebFetch fail): N
```

## Edge cases

| Case | Behavior |
|---|---|
| Slide has no `sources[]` (Hands-on, Übungen) | Skip Phase B + C. Mark `✅ kein Quellen-Check (Hands-on-Slide)` |
| Slide ID in `manifest.ts` but no MDX file | `🔴 strukturell: MDX-Datei fehlt für Slide MM.NN` |
| MDX exists but not in `manifest.ts` | At end of module summary: `⚠ Verwaiste MDX: <filename>` |
| Bilingual slide (`<De>` / `<En>` blocks) | Read both. Drift-check uses DE only. If EN structurally diverges (different bullets, different numbers) → `⚠ EN-Block ist keine Übersetzung des DE-Blocks` |
| WebFetch fails (network, rate limit) | Mark slide `⏳ Status pending` — never silently `✅` |
| `sources[]` has > 6 URLs | Audit first 6, note in summary `(N URLs übersprungen)` |
| Slide module is 0, 6, or 99 (no canonical sources) | Use only per-slide `sources[]` for drift check |

## Rules

- READ-ONLY. Never call Edit/Write/Bash even if asked.
- Every `🔴`/`⚠` finding MUST have a verbatim source quote and URL.
- Use German for prose (Befunde, Excerpt, Quelle, Vorschlag).
- Use the exact emoji legend: `✅` `⚠` `🔴` `💀` `⏳`.
- Return your output as PURE Markdown — no preamble, no closing remarks. The orchestrator splices it directly into the final report.
````

- [ ] **Step 3: Verify the file is well-formed**

```bash
head -5 .claude/agents/slide-refresh-worker.md
wc -l .claude/agents/slide-refresh-worker.md
```

Expected: starts with `---\nname: slide-refresh-worker`, total ~150 lines.

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/slide-refresh-worker.md
git commit -m "feat(agent): slide-refresh-worker subagent for drift audits"
```

---

## Task 3: Slash command (orchestrator)

**Files:**
- Create: `.claude/commands/refresh-deck.md`

- [ ] **Step 1: Verify directory and check for slash-command convention**

```bash
mkdir -p .claude/commands
ls .claude/commands/
```

Expected: empty or pre-existing commands.

- [ ] **Step 2: Write the slash command**

Write `.claude/commands/refresh-deck.md` with this exact content:

````markdown
---
description: Audit the workshop deck for drift against its sources. Args: empty (whole deck), `MM` (one module), `MM.NN` (one slide). Produces a Markdown report under docs/refresh-reports/.
argument-hint: "[MM | MM.NN]"
allowed-tools: Read, Bash, Write, Agent
---

# /refresh-deck — Deck Drift Audit

User input: `$ARGUMENTS`

You are the orchestrator for a deck-refresh audit. Your job: parse the scope, dispatch parallel `slide-refresh-worker` subagents, aggregate their reports, and write the final document.

## 1. Parse scope

Trim `$ARGUMENTS`. Then:

- empty → **whole-deck mode**
- matches `^\d{2}$` (e.g. `02`) → **single-module mode**, module = the value
- matches `^\d{2}\.\d{2}$` (e.g. `02.05`) → **single-slide mode**, slide = the value
- anything else → reply with `Usage: /refresh-deck [MM | MM.NN]` and stop

## 2. Enumerate modules

Read `src/lib/manifest.ts` to learn which modules and slides exist. The manifest is a TypeScript array of `{index, title, slides[]}`. Module indices are: 0, 1, 2, 3, 4, 5, 6, 99.

For whole-deck: dispatch one worker per module, all 8 in parallel.
For single-module: dispatch one worker for that module.
For single-slide: dispatch one worker with `slide=NN.MM`.

## 3. Dispatch workers (PARALLEL)

For whole-deck mode, you MUST send all 8 Agent calls in a SINGLE message (parallel tool use), not one after another. Each call:

```
Agent({
  subagent_type: "slide-refresh-worker",
  description: "Audit module 02",
  prompt: "Audit module=02. Use Glob to find all src/content/02-*.mdx files. Run the full Phase A→D procedure for each slide. Return your Markdown output verbatim — no preamble, no closing."
})
```

For single-slide mode, the prompt becomes `"Audit slide=02.05. Read src/content/02-05-*.mdx and run the full procedure."`.

## 4. Aggregate

Each worker returns a Markdown string. Collect them in module order: 00, 01, 02, 03, 04, 05, 06, 99.

Parse each module summary line by line to count totals:
- ✅ current
- ⚠ minor
- 🔴 outdated
- 💀 tote Links
- ⏳ pending

Compute total slides checked = sum of "Slides geprüft" across modules.

Identify Top-Prioritäten: every slide marked `🔴` — extract its `MM.NN` ID + one-line reason from the first finding.

## 5. Pick output filename

```bash
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M)
```

If `docs/refresh-reports/${DATE}-deck-refresh.md` does NOT exist → use that filename.
Otherwise → use `docs/refresh-reports/${DATE}-${TIME}-deck-refresh.md`.

## 6. Write the report

Use Write tool to create the report file with this structure:

```markdown
# Slide Refresh Report — <YYYY-MM-DD>

**Lauf:** <HH:MM lokale Zeit> · ~<duration> · <N> parallele Worker
**Scope:** <whole deck | module NN | slide NN.MM>

## Executive Summary

| Status | Slides | Anteil |
|---|---|---|
| ✅ current | N | NN % |
| ⚠ minor drift | N | NN % |
| 🔴 outdated | N | NN % |
| 💀 tote Links | N | — |
| ⏳ pending | N | — |

**Top-Prioritäten:**

1. 🔴 02.05 Modellauswahl — Sonnet 4.6 → 4.7
2. 🔴 ...
3. ...

(falls 0 🔴: "Keine outdated-Slides — Deck ist auf Stand der geprüften Quellen.")

## Per-Modul

<aggregated worker outputs verbatim>

---

**Legende:** ✅ aligned · ⚠ unklar/leichte Drift · 🔴 widersprochen · 💀 tote Quelle · ⏳ check pending
```

## 7. Confirm to user

After writing, output a short summary message to the user:

```
✓ Refresh-Lauf abgeschlossen.

Report: docs/refresh-reports/<filename>
Slides geprüft: N · ✅ N · ⚠ N · 🔴 N · 💀 N

Top-Prio:
- 02.05 Modellauswahl
- ...

Nächster Schritt: Diff-Blöcke aus dem Report in die jeweiligen src/content/*.mdx übertragen, researchedOn aktualisieren, im Changelog ergänzen.
```

## Rules

- Do NOT edit any MDX files yourself. The agent is report-only by design.
- Dispatch in PARALLEL for whole-deck mode (single message, multiple Agent calls).
- If a worker fails or returns garbage, include its module section verbatim with a `⚠ Worker error` note — never silently drop modules.
- The report MUST be committed (git add + commit) at the end if you have permission. Otherwise just write it and tell the user to commit.
````

- [ ] **Step 3: Verify the file**

```bash
head -8 .claude/commands/refresh-deck.md
wc -l .claude/commands/refresh-deck.md
```

Expected: starts with `---\ndescription: ...`, ~120 lines.

- [ ] **Step 4: Commit**

```bash
git add .claude/commands/refresh-deck.md
git commit -m "feat(command): /refresh-deck slash command for parallel deck audits"
```

---

## Task 4: Smoke test — single slide

This is the first end-to-end test. Goal: verify the full chain works on the smallest scope before doing 8 parallel workers.

**Files:** None modified. Generates `docs/refresh-reports/YYYY-MM-DD-deck-refresh.md`.

- [ ] **Step 1: Run the slash command on a single slide with a known good source**

In the Claude Code session, type:

```
/refresh-deck 02.05
```

(02.05 is "Modellauswahl" — has `sources[]` with anthropic.com URLs, good content for drift testing.)

- [ ] **Step 2: Verify the produced report**

```bash
ls -la docs/refresh-reports/
cat docs/refresh-reports/$(date +%Y-%m-%d)-deck-refresh.md
```

Expected checklist (eyeball each):

- [ ] File exists
- [ ] Has `# Slide Refresh Report — YYYY-MM-DD` header
- [ ] Has `## Executive Summary` table with 1 slide counted
- [ ] Has `## Per-Modul` section with `### Slide 02.05 — Modellauswahl` block
- [ ] If findings exist: each finding has `*Excerpt:*` quote + `*Quelle:*` URL
- [ ] No mention of file edits or Edit-tool usage

- [ ] **Step 3: Inspect the worker's behaviour**

If the report is empty / malformed / has missing sources, debug:

- Did the worker read the MDX file? (look for "Read" tool use in agent transcript)
- Did it WebFetch the sources? (look for "WebFetch" tool use)
- Did it follow the output format strictly?

If the worker got the format wrong, edit `.claude/agents/slide-refresh-worker.md` to be more explicit, then re-run.

- [ ] **Step 4: Commit (only if report looks good)**

```bash
git add docs/refresh-reports/
git commit -m "chore(refresh): first smoke test report (slide 02.05)"
```

---

## Task 5: Smoke test — single module

Goal: verify multiple slides in one worker, summary counts work.

- [ ] **Step 1: Run on module 02 (the largest module, 11 slides)**

```
/refresh-deck 02
```

- [ ] **Step 2: Verify the report**

```bash
ls -la docs/refresh-reports/
cat docs/refresh-reports/$(date +%Y-%m-%d)-*deck-refresh.md | head -100
```

Expected:

- [ ] File exists (with `HHMM`-suffix because the date already has a report from Task 4)
- [ ] Executive Summary counts 11 slides total
- [ ] Per-Modul section has all 11 slide blocks: 02.01 through 02.11
- [ ] Module-Zusammenfassung totals match Executive Summary
- [ ] Bilingual slides are noted correctly (any with `<De>`/`<En>` get audited as DE)
- [ ] Hands-on slides (02.11 is "Hands-on: erste CLAUDE.md") are marked `✅ kein Quellen-Check`

- [ ] **Step 3: Commit if good**

```bash
git add docs/refresh-reports/
git commit -m "chore(refresh): module 02 smoke test report"
```

---

## Task 6: Full-deck run + final commit

This is the production smoke test. Goal: dispatch 8 parallel workers, aggregate, full report.

- [ ] **Step 1: Trigger the full deck audit**

```
/refresh-deck
```

- [ ] **Step 2: Watch for parallel dispatch**

The Claude session should send 8 Agent tool calls in a single message. If you see them sequential (one finishing before the next starts), the orchestrator instructions failed — fix `.claude/commands/refresh-deck.md` to make the parallel-dispatch rule more explicit.

- [ ] **Step 3: Verify the report**

```bash
ls -la docs/refresh-reports/
LATEST=$(ls -t docs/refresh-reports/*.md | grep -v README | head -1)
wc -l "$LATEST"
head -50 "$LATEST"
```

Expected:

- [ ] Report exists, 200–600 lines depending on findings
- [ ] Executive Summary covers ~58 slides (all modules)
- [ ] All 8 module sections present (00, 01, 02, 03, 04, 05, 06, 99)
- [ ] Top-Prioritäten lists every 🔴 slide
- [ ] No worker section is missing or replaced with an error placeholder

- [ ] **Step 4: Manual quality check**

Pick 2 random `🔴` findings from the report. For each:

- [ ] Open the cited source URL in a browser
- [ ] Verify the verbatim quote actually appears on that page
- [ ] Verify the proposed diff makes sense

If a quote is hallucinated → the worker prompt's "no finding without verbatim quote" rule isn't sticking. Add stronger language to the worker file and re-run.

- [ ] **Step 5: Commit final report**

```bash
git add docs/refresh-reports/
git commit -m "chore(refresh): first full-deck audit report"
```

- [ ] **Step 6: Push everything**

```bash
git push origin main
```

---

## Self-Review

**Spec coverage check:**

- ✅ Two-layer pattern (slash-command + worker subagent) — Task 2 + Task 3
- ✅ Fan-out per module — Task 3 step 3 with parallel-dispatch instructions
- ✅ Worker tool list `Read, Grep, Glob, WebFetch` — Task 2 frontmatter
- ✅ Phases A–D — Task 2 worker body
- ✅ Canonical sources mapping — Task 2 worker body
- ✅ Output format with verbatim excerpts — Task 2 + smoke tests
- ✅ Edge cases (no sources, bilingual, manifest mismatch, fetch fail) — Task 2 edge-cases table
- ✅ Report location `docs/refresh-reports/YYYY-MM-DD-…` — Task 1 + Task 3 step 5
- ✅ Filename suffix on multiple same-day runs — Task 3 step 5
- ✅ Report committed — Tasks 4–6

**Open by design (will surface during smoke tests):**

- Worker prompt may need iteration after first run — explicitly called out in Task 4 step 3 and Task 6 step 4 as expected.
- The Agent dispatch syntax `Agent({subagent_type, ...})` is a notation; the actual tool call is the harness's Agent tool. The worker prompt is detailed enough that the orchestrator just relays scope.

**Placeholders/red flags:** Searched for `TBD`, `TODO`, `implement later` — none.

**Type consistency:** Tool list, file paths, module list are consistent across tasks. Status emojis (`✅⚠🔴💀⏳`) used consistently.
