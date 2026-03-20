export type SentimentLabel = "positive" | "negative" | "neutral";

export type SentimentBreakdown = Record<SentimentLabel, number>;

export type KeywordStat = {
  term: string;
  mentions: number;
};

export type CallAnalyticsOverview = {
  periodLabel: string;
  totalCallsProcessed: number;
  sentiment: SentimentBreakdown;
  averageQualityScore: number; // 0–10
  averageDurationSeconds: number;
  topKeywords: KeywordStat[];
  totalActionItems: number;
  totalFollowUps: number;
};
