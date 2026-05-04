export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header
        data-workshop-header
        className="flex items-center px-6"
        style={{
          height: "var(--header-height)",
          background: "var(--workshop-accent)",
          color: "white",
        }}
      >
        <strong className="mr-3">BIK</strong>
        <span className="opacity-90">Claude Code Workshop</span>
        <span className="ml-auto text-sm opacity-75">
          Phase 0 · Skeleton
        </span>
      </header>

      <main className="flex-1 grid place-items-center p-12">
        <div className="text-center max-w-xl">
          <h1
            className="text-3xl font-semibold mb-3"
            style={{ color: "var(--workshop-accent)" }}
          >
            Augmented Working für professionelle Softwareentwicklung
          </h1>
          <p style={{ color: "var(--fg-muted)" }}>
            Schulungsdeck im Aufbau — siehe <code>PLAN.md</code> +{" "}
            <code>STATUS.md</code> im Repo-Root.
          </p>
        </div>
      </main>
    </div>
  );
}
