import type { SentimentBreakdown as SentimentBreakdownType } from "@/types/call-analytics";

type Props = {
  sentiment: SentimentBreakdownType;
};

const styles = {
  positive: {
    bar: "bg-emerald-500 dark:bg-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  negative: {
    bar: "bg-rose-500 dark:bg-rose-400",
    dot: "bg-rose-500 dark:bg-rose-400",
    label: "text-rose-700 dark:text-rose-300",
  },
  neutral: {
    bar: "bg-zinc-400 dark:bg-zinc-500",
    dot: "bg-zinc-400 dark:bg-zinc-500",
    label: "text-zinc-600 dark:text-zinc-400",
  },
} as const;

export function SentimentBreakdown({ sentiment }: Props) {
  const total =
    sentiment.positive + sentiment.negative + sentiment.neutral;

  if (total === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Sentiment breakdown
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Share of calls by primary tone (from AI analysis)
        </p>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          No sentiment data yet. Transcribe a call and run{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Analyze insights
          </span>{" "}
          to build this chart.
        </p>
      </div>
    );
  }

  const pct = (n: number) => Math.round((n / total) * 1000) / 10;

  const rows: { key: keyof typeof styles; count: number; label: string }[] = [
    { key: "positive", count: sentiment.positive, label: "Positive" },
    { key: "negative", count: sentiment.negative, label: "Negative" },
    { key: "neutral", count: sentiment.neutral, label: "Neutral" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Sentiment breakdown
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Share of calls by detected tone
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {total.toLocaleString()} calls
        </span>
      </div>

      <div
        className="mt-6 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
        role="img"
        aria-label={`Sentiment: ${pct(sentiment.positive)}% positive, ${pct(sentiment.negative)}% negative, ${pct(sentiment.neutral)}% neutral`}
      >
        <div
          className={`${styles.positive.bar} transition-all`}
          style={{ width: `${(sentiment.positive / total) * 100}%` }}
        />
        <div
          className={`${styles.neutral.bar} transition-all`}
          style={{ width: `${(sentiment.neutral / total) * 100}%` }}
        />
        <div
          className={`${styles.negative.bar} transition-all`}
          style={{ width: `${(sentiment.negative / total) * 100}%` }}
        />
      </div>

      <ul className="mt-5 space-y-3">
        {rows.map(({ key, count, label }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${styles[key].dot}`}
                aria-hidden
              />
              {label}
            </span>
            <span className="tabular-nums text-zinc-900 dark:text-zinc-100">
              <span className={styles[key].label}>{pct(count)}%</span>
              <span className="text-zinc-400 dark:text-zinc-500">
                {" "}
                · {count.toLocaleString()}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
