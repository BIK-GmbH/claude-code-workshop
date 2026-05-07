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
