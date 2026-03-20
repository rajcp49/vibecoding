/** Short, scannable steps — brand / ink / paper only */
export function DashboardGettingStarted() {
  const steps = [
    {
      n: "1",
      title: "Upload audio",
      body: "Use Upload in the sidebar or top bar. Files save to this browser.",
    },
    {
      n: "2",
      title: "Open a call",
      body: "Pick a clip below to open its page—transcript, insights, and playback.",
    },
    {
      n: "3",
      title: "Transcribe & analyze",
      body: "Run Transcribe, then Analyze insights to refresh these dashboard stats.",
    },
  ] as const;

  return (
    <section
      id="getting-started"
      className="mb-10 scroll-mt-8 rounded-2xl border border-brand/20 bg-gradient-to-br from-white via-paper to-paper p-5 shadow-[0_20px_50px_-24px_rgba(42,36,32,0.12)] ring-1 ring-brand/10 sm:p-6"
      aria-labelledby="getting-started-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="getting-started-heading"
          className="text-base font-semibold text-ink"
        >
          How to use this app
        </h2>
        <p className="text-xs text-ink/55">
          Everything stays in your browser until you send audio to the APIs.
        </p>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="surface-rich flex gap-3 rounded-xl border border-brand/15 p-4"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-sm font-bold text-brand ring-1 ring-brand/25"
              aria-hidden
            >
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
