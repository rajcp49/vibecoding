import type { CallAnalyticsOverview } from "@/types/call-analytics";
import type { SavedRecording } from "@/types/saved-recording";

function normalizeKeyword(s: string): string {
  const t = s.trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

/** Build dashboard KPIs from recordings that have completed AI analysis. */
export function computeAggregatedOverview(
  recordings: SavedRecording[],
): CallAnalyticsOverview {
  const analyzed = recordings.filter((r) => r.analysis);
  const n = analyzed.length;

  if (n === 0) {
    return {
      periodLabel: "No analyzed calls yet — transcribe & run insights",
      totalCallsProcessed: 0,
      sentiment: { positive: 0, negative: 0, neutral: 0 },
      averageQualityScore: 0,
      averageDurationSeconds: 0,
      topKeywords: [],
      totalActionItems: 0,
      totalFollowUps: 0,
    };
  }

  const sentiment = { positive: 0, negative: 0, neutral: 0 };
  let qualitySum = 0;
  let qualityN = 0;
  let durSum = 0;
  let durN = 0;
  const keywordCounts = new Map<string, number>();
  let totalActionItems = 0;
  let totalFollowUps = 0;

  for (const r of analyzed) {
    const a = r.analysis!;
    if (a.conversationQuality) {
      qualitySum += a.conversationQuality.overallScore;
      qualityN += 1;
    }

    const ps = a.summary?.primarySentiment;
    if (ps === "positive") sentiment.positive += 1;
    else if (ps === "negative") sentiment.negative += 1;
    else sentiment.neutral += 1;

    if (r.durationSeconds != null && r.durationSeconds > 0) {
      durSum += r.durationSeconds;
      durN += 1;
    }

    for (const kw of a.extractedKeywords ?? []) {
      const key = normalizeKeyword(kw.term);
      if (!key) continue;
      keywordCounts.set(key, (keywordCounts.get(key) ?? 0) + 1);
    }

    for (const item of a.actionItems) {
      if (item.type === "follow_up") totalFollowUps += 1;
      else totalActionItems += 1;
    }
  }

  const topKeywords = [...keywordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([term, mentions]) => ({ term, mentions }));

  return {
    periodLabel: `From ${n} analyzed call${n === 1 ? "" : "s"} in your library`,
    totalCallsProcessed: n,
    sentiment,
    averageQualityScore: qualityN > 0 ? qualitySum / qualityN : 0,
    averageDurationSeconds: durN > 0 ? durSum / durN : 0,
    topKeywords,
    totalActionItems,
    totalFollowUps,
  };
}
