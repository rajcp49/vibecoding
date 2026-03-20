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
    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-neutral-950 to-black p-6 text-stone-100 shadow-xl shadow-black/40 ring-1 ring-amber-500/10">
      <section>
        <h3 className="text-lg font-semibold text-amber-100/95">Talk Time Analysis</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">
          Estimated speaking distribution between agent and customer from the
          transcript (who contributed more words / turns).
        </p>
        {hasAnalysis ? (
          <div className="mt-4 overflow-hidden rounded-lg border border-amber-500/20 bg-black/30">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-amber-500/15">
                  <td className="px-4 py-3 text-stone-400">Agent Talk Time</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-amber-100">
                    {agentTalkPercent}%
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-stone-400">Customer Talk Time</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums text-amber-100">
                    {customerTalkPercent}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            Run{" "}
            <span className="font-medium text-amber-200/90">Analyze insights</span>{" "}
            on the Transcribe tab to estimate talk-time split from this
            transcript.
          </p>
        )}
      </section>

      <section className="mt-8 border-t border-amber-500/15 pt-8">
        <h3 className="text-lg font-semibold text-amber-100/95">Overall Call Score</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-500">
          Numeric score from 1–{scoreMax} based on flow, structure, and
          professional communication quality in the transcript.
        </p>
        {overallScore != null ? (
          <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-amber-100">
            {overallScore}
            <span className="text-lg font-medium text-stone-500"> / {scoreMax}</span>
          </p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            No score yet — open this clip in Transcribe and run{" "}
            <span className="font-medium text-amber-200/90">Analyze insights</span>.
          </p>
        )}
      </section>
    </div>
  );
}
