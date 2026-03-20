import type { ConversationAnalysis } from "@/types/conversation-analysis";

function ScoreBar({ value, label }: { value: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, (value / 10) * 100));
  return (
    <div className="space-y-1">
      {label ? (
        <div className="flex justify-between text-xs text-stone-500">
          <span>{label}</span>
          <span className="tabular-nums font-medium text-stone-200">
            {value}/10
          </span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm shadow-amber-500/30"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const actionTypeLabel: Record<string, string> = {
  commitment: "Commitment",
  follow_up: "Follow-up",
  discussion_point: "Discussion",
};

const card =
  "rounded-2xl border border-amber-500/15 bg-gradient-to-b from-neutral-900/70 to-black/50 p-6 shadow-xl shadow-black/30 ring-1 ring-amber-500/10 sm:p-8";

type Props = {
  data: ConversationAnalysis;
};

export function CallInsightsPanel({ data }: Props) {
  const cq = data.conversationQuality;
  const ap = data.agentPerformance;
  const sp = data.sentimentAndPatterns;
  const items = data.actionItems;

  return (
    <div className="space-y-6">
      {(data.extractedKeywords ?? []).length > 0 ? (
        <div className={`${card} p-5 sm:p-6`}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/80">
            Key themes (from transcript)
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(data.extractedKeywords ?? []).map((k) => (
              <span
                key={k.term}
                className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-200/90"
              >
                {k.term}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className={card}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-stone-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/20 text-sm font-bold text-amber-200 ring-1 ring-amber-500/30">
                A
              </span>
              Conversation quality
            </h3>
            <p className="mt-2 text-sm text-stone-400">{cq.summary}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-amber-500/20 bg-black/40 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber-600/80">
              Overall
            </p>
            <p className="text-3xl font-semibold tabular-nums text-amber-100">
              {cq.overallScore}
              <span className="text-lg text-stone-500">/10</span>
            </p>
          </div>
        </div>
        <ScoreBar value={cq.overallScore} />
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-500/10 bg-black/30 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Pacing
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-stone-300">
              {cq.pacing}
            </dd>
          </div>
          <div className="rounded-xl border border-amber-500/10 bg-black/30 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Structure
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-stone-300">
              {cq.structure}
            </dd>
          </div>
          <div className="rounded-xl border border-amber-500/10 bg-black/30 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Engagement
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-stone-300">
              {cq.engagement}
            </dd>
          </div>
        </dl>
      </div>

      <div className={card}>
        <h3 className="flex items-center gap-2 text-base font-semibold text-stone-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-sm font-bold text-amber-300 ring-1 ring-amber-500/25">
            B
          </span>
          Agent performance
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-400">{ap.summary}</p>
        <ul className="mt-6 space-y-5">
          {ap.dimensions.map((d) => (
            <li key={d.name}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-stone-200">{d.name}</span>
                <span className="shrink-0 text-sm tabular-nums text-stone-500">
                  {d.score}/10
                </span>
              </div>
              <ScoreBar value={d.score} />
              <p className="mt-2 text-sm text-stone-500">{d.feedback}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={card}>
        <h3 className="flex items-center gap-2 text-base font-semibold text-stone-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/15 text-sm font-bold text-yellow-200/90 ring-1 ring-yellow-500/25">
            C
          </span>
          Sentiment &amp; patterns
        </h3>
        <p className="mt-3 text-sm font-medium text-stone-200">{sp.overallTone}</p>
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          {sp.emotionalSummary}
        </p>
        {sp.behavioralSignals.length > 0 ? (
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-stone-300">
            {sp.behavioralSignals.map((s, i) => (
              <li key={`${i}-${s.slice(0, 40)}`}>{s}</li>
            ))}
          </ul>
        ) : null}
        {sp.segments.length > 0 ? (
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/80">
              Timeline
            </p>
            <ul className="space-y-3">
              {sp.segments.map((seg, i) => (
                <li
                  key={`${seg.phase}-${i}`}
                  className="rounded-xl border border-amber-500/15 bg-black/35 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-stone-200">{seg.phase}</span>
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-200/90">
                      {seg.sentiment}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500">{seg.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {sp.notableShifts.length > 0 ? (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/80">
              Notable shifts
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-stone-300">
              {sp.notableShifts.map((s, i) => (
                <li key={`${i}-${s.slice(0, 40)}`}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className={card}>
        <h3 className="flex items-center gap-2 text-base font-semibold text-stone-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600/20 text-sm font-bold text-amber-200 ring-1 ring-amber-500/30">
            D
          </span>
          Action items
        </h3>
        {items.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No explicit action items detected—review the transcript for
            follow-ups.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item, i) => (
              <li
                key={`${i}-${item.text.slice(0, 24)}`}
                className="flex flex-col gap-1 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <p className="text-sm font-medium text-stone-200">{item.text}</p>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <span className="rounded-md border border-amber-500/25 bg-black/40 px-2 py-1 text-xs font-medium text-amber-200/90">
                    {actionTypeLabel[item.type] ?? item.type}
                  </span>
                  {item.suggestedOwner ? (
                    <span className="rounded-md border border-stone-700 bg-black/40 px-2 py-1 text-xs text-stone-400">
                      {item.suggestedOwner}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
