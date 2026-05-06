import type { ModuleMeta } from "@/types/slide";

/** Stub manifest used until Phase 2 wires up the MDX-driven build. */
export const MANIFEST: ModuleMeta[] = [
  {
    index: 0,
    title: { de: "Intro", en: "Intro" },
    description: { de: "Cover, Trainer, Lernziele", en: "Cover, trainer, goals" },
    slides: [
      { id: "00.01", module: 0, slide: 1, title: { de: "Cover", en: "Cover" } },
      { id: "00.02", module: 0, slide: 2, title: { de: "Begrüßung", en: "Welcome" } },
      { id: "00.03", module: 0, slide: 3, title: { de: "Lernziele", en: "Learning goals" } },
      { id: "00.04", module: 0, slide: 4, title: { de: "Agenda", en: "Agenda" } },
      { id: "00.05", module: 0, slide: 5, title: { de: "Die größere Vision: AI als Operating System", en: "The Bigger Vision: AI as Operating System" } },
    ],
  },
  {
    index: 1,
    title: { de: "Grundlagen & Mindset", en: "Foundations & Mindset" },
    description: { de: "Was ist Augmented Working?", en: "What is augmented working?" },
    slides: [
      { id: "01.01", module: 1, slide: 1, title: { de: "Was Claude Code ist", en: "What Claude Code is" } },
      { id: "01.02", module: 1, slide: 2, title: { de: "Vibe vs. Frust vs. Augmented", en: "Vibe vs. Frustration vs. Augmented" } },
      { id: "01.03", module: 1, slide: 3, title: { de: "Tool-Landschaft 2026", en: "Tool landscape 2026" } },
      { id: "01.04", module: 1, slide: 4, title: { de: "Wie LLMs denken", en: "How LLMs think" } },
      { id: "01.05", module: 1, slide: 5, title: { de: "Reflexions-Übung", en: "Reflection exercise" } },
    ],
  },
  {
    index: 2,
    title: { de: "Setup & Basis-Konfiguration", en: "Setup & Configuration" },
    slides: [
      { id: "02.01", module: 2, slide: 1, title: { de: "Hardware-Setup", en: "Hardware setup" } },
      { id: "02.02", module: 2, slide: 2, title: { de: "Software-Stack", en: "Software stack" } },
      { id: "02.03", module: 2, slide: 3, title: { de: "Installation", en: "Installation" } },
      { id: "02.04", module: 2, slide: 4, title: { de: "Authentifizierung", en: "Authentication" } },
      { id: "02.05", module: 2, slide: 5, title: { de: "Modellauswahl", en: "Model selection" } },
      { id: "02.06", module: 2, slide: 6, title: { de: "CLAUDE.md", en: "CLAUDE.md" } },
      { id: "02.07", module: 2, slide: 7, title: { de: "Slash Commands", en: "Slash commands" } },
      { id: "02.08", module: 2, slide: 8, title: { de: "Plan Mode", en: "Plan Mode" } },
      { id: "02.09", module: 2, slide: 9, title: { de: "Permissions", en: "Permissions" } },
      { id: "02.10", module: 2, slide: 10, title: { de: "Hands-on: erste CLAUDE.md", en: "Hands-on: first CLAUDE.md" } },
    ],
  },
  {
    index: 3,
    title: { de: "Skills, Subagents & MCP", en: "Skills, Subagents & MCP" },
    slides: [
      { id: "03.01", module: 3, slide: 1, title: { de: "Was Skills sind", en: "What skills are" } },
      { id: "03.02", module: 3, slide: 2, title: { de: "SKILL.md & Trigger", en: "SKILL.md & triggers" } },
      { id: "03.03", module: 3, slide: 3, title: { de: "Eigene Skills schreiben", en: "Writing your own skill" } },
      { id: "03.04", module: 3, slide: 4, title: { de: "Subagents", en: "Subagents" } },
      { id: "03.05", module: 3, slide: 5, title: { de: "MCP-Server", en: "MCP servers" } },
      { id: "03.06", module: 3, slide: 6, title: { de: "Hands-on: Skill bauen", en: "Hands-on: build a skill" } },
    ],
  },
  {
    index: 4,
    title: { de: "Spec-Driven Development", en: "Spec-Driven Development" },
    slides: [
      { id: "04.01", module: 4, slide: 1, title: { de: "Vom Prompt zur Spec", en: "From prompt to spec" } },
      { id: "04.02", module: 4, slide: 2, title: { de: "Plan-First", en: "Plan-first" } },
      { id: "04.03", module: 4, slide: 3, title: { de: "Kontext-Management", en: "Context management" } },
      { id: "04.04", module: 4, slide: 4, title: { de: "Review-Loops", en: "Review loops" } },
      { id: "04.05", module: 4, slide: 5, title: { de: "Test-First", en: "Test-first" } },
      { id: "04.06", module: 4, slide: 6, title: { de: "Hands-on: Spec → Code", en: "Hands-on: spec → code" } },
    ],
  },
  {
    index: 5,
    title: { de: "Best Practices & Sicherheit", en: "Best Practices & Security" },
    slides: [
      { id: "05.01", module: 5, slide: 1, title: { de: "Wann delegieren", en: "When to delegate" } },
      { id: "05.02", module: 5, slide: 2, title: { de: "Anti-Patterns", en: "Anti-patterns" } },
      { id: "05.03", module: 5, slide: 3, title: { de: "Halluzinationen erkennen", en: "Detecting hallucinations" } },
      { id: "05.04", module: 5, slide: 4, title: { de: "Sicherheit & Secrets", en: "Security & secrets" } },
      { id: "05.05", module: 5, slide: 5, title: { de: "Compliance & IP", en: "Compliance & IP" } },
      { id: "05.06", module: 5, slide: 6, title: { de: "Team-Konventionen", en: "Team conventions" } },
    ],
  },
  {
    index: 6,
    title: { de: "Hands-on: Eigene Projekte", en: "Hands-on: Your Projects" },
    slides: [
      { id: "06.01", module: 6, slide: 1, title: { de: "Vorgehen + Pfad-Wahl", en: "Approach + path choice" } },
      { id: "06.02", module: 6, slide: 2, title: { de: "Pfad B: Mindshift-Starter", en: "Path B: Mindshift Starter" } },
      { id: "06.03", module: 6, slide: 3, title: { de: "Live-Coding", en: "Live coding" } },
      { id: "06.04", module: 6, slide: 4, title: { de: "Q&A", en: "Q&A" } },
      { id: "06.05", module: 6, slide: 5, title: { de: "Retrospektive", en: "Retrospective" } },
      { id: "06.06", module: 6, slide: 6, title: { de: "Plan für 2 Wochen danach", en: "Plan for the next 2 weeks" } },
      { id: "06.07", module: 6, slide: 7, title: { de: "Ausblick: Vom Skill zum Business Brain", en: "Outlook: From Skill to Business Brain" } },
    ],
  },
  {
    index: 99,
    title: { de: "Anhang", en: "Appendix" },
    slides: [
      { id: "99.01", module: 99, slide: 1, title: { de: "CLAUDE.md-Vorlage", en: "CLAUDE.md template" } },
      { id: "99.02", module: 99, slide: 2, title: { de: "Skill-Vorlage", en: "Skill template" } },
      { id: "99.03", module: 99, slide: 3, title: { de: "Cheat-Sheet: CLI", en: "Cheat sheet: CLI" } },
      { id: "99.04", module: 99, slide: 4, title: { de: "Cheat-Sheet: Tasten", en: "Cheat sheet: keyboard" } },
      { id: "99.05", module: 99, slide: 5, title: { de: "Ressourcen", en: "Resources" } },
      { id: "99.06", module: 99, slide: 6, title: { de: "Changelog", en: "Changelog" } },
      { id: "99.07", module: 99, slide: 7, title: { de: "Trainer-Demos (Copy & Paste)", en: "Trainer Demos (Copy & Paste)" } },
      { id: "99.08", module: 99, slide: 8, title: { de: "Top Skills (Living Catalog)", en: "Top Skills (Living Catalog)" } },
    ],
  },
];

/** Flat list of all slides in canonical order. */
export const ALL_SLIDES = MANIFEST.flatMap((m) => m.slides);

export function findSlide(id: string) {
  return ALL_SLIDES.find((s) => s.id === id);
}

export function findModule(index: number) {
  return MANIFEST.find((m) => m.index === index);
}

export function neighbours(id: string) {
  const i = ALL_SLIDES.findIndex((s) => s.id === id);
  return {
    prev: i > 0 ? ALL_SLIDES[i - 1] : null,
    next: i >= 0 && i < ALL_SLIDES.length - 1 ? ALL_SLIDES[i + 1] : null,
    index: i,
    total: ALL_SLIDES.length,
  };
}
