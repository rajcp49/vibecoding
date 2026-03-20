import type { KeywordStat } from "@/types/call-analytics";

type Props = {
  keywords: KeywordStat[];
};

export function KeywordRankings({ keywords }: Props) {
  if (keywords.length === 0) {
    return (
      <div className="surface-rich rounded-2xl p-6">
        <h2 className="text-base font-semibold text-ink">
          Top discussed keywords
        </h2>
        <p className="mt-1 text-sm text-ink/55">
          Most frequent themes across analyzed calls
        </p>
        <p className="mt-6 text-sm text-ink/50">
          No keywords yet. Run{" "}
          <span className="font-medium text-ink/80">
            Analyze insights
          </span>{" "}
          on calls to extract themes here.
        </p>
      </div>
    );
  }

  const max = Math.max(...keywords.map((k) => k.mentions), 1);

  return (
    <div className="surface-rich rounded-2xl p-6">
      <h2 className="text-base font-semibold text-ink">
        Top discussed keywords
      </h2>
      <p className="mt-1 text-sm text-ink/55">
        Most frequent themes across transcripts
      </p>
      <ul className="mt-6 space-y-4">
        {keywords.map((k, i) => {
          const width = (k.mentions / max) * 100;
          return (
            <li key={k.term}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="w-5 shrink-0 tabular-nums text-xs text-ink/40">
                    {i + 1}
                  </span>
                  <span className="truncate font-medium text-ink">
                    {k.term}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-ink/55">
                  {k.mentions.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand via-brand/90 to-brand/75"
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
