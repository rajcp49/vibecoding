/** Short, scannable steps so first-time users know what to do. */
export function DashboardGettingStarted() {
  const steps = [
    {
      n: "1",
      title: "Upload audio",
      body: "Use Upload in the sidebar or top bar. Files save to this browser.",
      chip: "bg-amber-500/20 text-amber-200 ring-amber-400/30",
    },
    {
      n: "2",
      title: "Open a call",
      body: "Pick a clip below to open its page—transcript, insights, and playback.",
      chip: "bg-sky-500/20 text-sky-200 ring-sky-400/30",
    },
    {
      n: "3",
      title: "Transcribe & analyze",
      body: "Run Transcribe, then Analyze insights to refresh these dashboard stats.",
      chip: "bg-emerald-500/20 text-emerald-200 ring-emerald-400/30",
    },
  ] as const;

  return (
    <section
      id="getting-started"
      className="mb-10 scroll-mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.08] via-violet-500/[0.06] to-cyan-500/[0.07] p-5 shadow-lg shadow-black/40 ring-1 ring-white/5 sm:p-6"
      aria-labelledby="getting-started-heading"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="getting-started-heading"
          className="text-base font-semibold text-stone-100"
        >
          How to use this app
        </h2>
        <p className="text-xs text-stone-500">
          Everything stays in your browser until you send audio to the APIs.
        </p>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex gap-3 rounded-xl border border-white/5 bg-black/35 p-4 ring-1 ring-white/5"
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ring-1 ${s.chip}`}
              aria-hidden
            >
              {s.n}
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-200">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-stone-500">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
