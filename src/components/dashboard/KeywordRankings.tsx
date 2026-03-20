import type { KeywordStat } from "@/types/call-analytics";

type Props = {
  keywords: KeywordStat[];
};

export function KeywordRankings({ keywords }: Props) {
  if (keywords.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Top discussed keywords
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Most frequent themes across analyzed calls
        </p>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          No keywords yet. Run{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Analyze insights
          </span>{" "}
          on calls to extract themes here.
        </p>
      </div>
    );
  }

  const max = Math.max(...keywords.map((k) => k.mentions), 1);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        Top discussed keywords
      </h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Most frequent themes across transcripts
      </p>
      <ul className="mt-6 space-y-4">
        {keywords.map((k, i) => {
          const width = (k.mentions / max) * 100;
          return (
            <li key={k.term}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="w-5 shrink-0 tabular-nums text-xs text-zinc-400 dark:text-zinc-500">
                    {i + 1}
                  </span>
                  <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {k.term}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-zinc-500 dark:text-zinc-400">
                  {k.mentions.toLocaleString()}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"
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
