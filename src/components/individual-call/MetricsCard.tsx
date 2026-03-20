type Props = {
  hasAnalysis: boolean;
  agentTalkPercent: number;
  customerTalkPercent: number;
  overallScore: number | null;
  /** 1–10 from analysis; shown as X / 10 */
  scoreMax?: number;
};

export function MetricsCard({
  hasAnalysis,
  agentTalkPercent,
  customerTalkPercent,
  overallScore,
  scoreMax = 10,
}: Props) {
  return (
    <div className="surface-rich rounded-xl border border-brand/12 p-6 text-ink shadow-[0_12px_40px_-20px_rgba(42,36,32,0.12)]">
      <section>
        <h3 className="text-lg font-semibold text-ink">Talk Time Analysis</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/65">
          Estimated speaking distribution between agent and customer from the
          transcript (who contributed more words / turns).
        </p>
        {hasAnalysis ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-brand/15 bg-white">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-brand/10">
                  <td className="px-4 py-3 text-ink/80">Agent Talk Time</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-brand">
                    {agentTalkPercent}%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink/80">Customer Talk Time</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-brand">
                    {customerTalkPercent}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Run{" "}
            <span className="font-medium text-brand">Analyze insights</span>{" "}
            on this page to estimate talk-time split from this
            transcript.
          </p>
        )}
      </section>

      <section className="mt-8 border-t border-brand/15 pt-8">
        <h3 className="text-lg font-semibold text-ink">Overall Call Score</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/65">
          Numeric score from 1–{scoreMax} based on flow, structure, and
          professional communication quality in the transcript.
        </p>
        {overallScore != null ? (
          <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-brand">
            {overallScore}
            <span className="text-lg font-medium text-ink/55"> / {scoreMax}</span>
          </p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            No score yet — run{" "}
            <span className="font-medium text-brand">Analyze insights</span> above.
          </p>
        )}
      </section>
    </div>
  );
}
