import type { SentimentBreakdown as SentimentBreakdownType } from "@/types/call-analytics";

type Props = {
  sentiment: SentimentBreakdownType;
};

const styles = {
  positive: {
    bar: "bg-brand",
    dot: "bg-brand",
    label: "text-brand",
  },
  negative: {
    bar: "bg-ink",
    dot: "bg-ink",
    label: "text-ink",
  },
  neutral: {
    bar: "bg-ink/30",
    dot: "bg-ink/40",
    label: "text-ink/70",
  },
} as const;

export function SentimentBreakdown({ sentiment }: Props) {
  const total =
    sentiment.positive + sentiment.negative + sentiment.neutral;

  if (total === 0) {
    return (
      <div className="surface-rich rounded-2xl p-6">
        <h2 className="text-base font-semibold text-ink">
          Sentiment breakdown
        </h2>
        <p className="mt-1 text-sm text-ink/55">
          Share of calls by primary tone (from AI analysis)
        </p>
        <p className="mt-6 text-sm text-ink/50">
          No sentiment data yet. Transcribe a call and run{" "}
          <span className="font-medium text-ink/80">
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
    <div className="surface-rich rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Sentiment breakdown
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Share of calls by detected tone
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-xs font-medium text-ink/70">
          {total.toLocaleString()} calls
        </span>
      </div>

      <div
        className="mt-6 flex h-3 overflow-hidden rounded-full bg-ink/10"
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
            <span className="flex items-center gap-2 text-ink/85">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${styles[key].dot}`}
                aria-hidden
              />
              {label}
            </span>
            <span className="tabular-nums text-ink">
              <span className={styles[key].label}>{pct(count)}%</span>
              <span className="text-ink/35">
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
