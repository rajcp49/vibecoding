/** Structured output from POST /api/analyze-call */

export type ConversationQuality = {
  /** 1–10 overall */
  overallScore: number;
  summary: string;
  pacing: string;
  structure: string;
  engagement: string;
};

export type AgentDimension = {
  name: string;
  /** 1–10 */
  score: number;
  feedback: string;
};

export type AgentPerformance = {
  summary: string;
  dimensions: AgentDimension[];
};

export type SentimentSegment = {
  /** e.g. Opening, Discovery, Close */
  phase: string;
  /** e.g. positive, neutral, negative, mixed */
  sentiment: string;
  note: string;
};

export type SentimentAndPatterns = {
  overallTone: string;
  emotionalSummary: string;
  behavioralSignals: string[];
  segments: SentimentSegment[];
  notableShifts: string[];
};

export type ActionItemType = "commitment" | "follow_up" | "discussion_point";

export type ActionItemExtracted = {
  text: string;
  type: ActionItemType;
  suggestedOwner?: string;
};

export type AnalysisSummary = {
  /** Dominant tone for dashboard rollups */
  primarySentiment: "positive" | "neutral" | "negative";
};

export type ExtractedKeyword = {
  term: string;
};

/** Estimated from transcript turn balance (percentages sum to ~100). */
export type TalkTimeAnalysis = {
  agentTalkPercent: number;
  customerTalkPercent: number;
};

export type ConversationAnalysis = {
  /** Present on new analyses; older saved rows may omit. */
  summary?: AnalysisSummary;
  /** Top themes for dashboard rollups. */
  extractedKeywords?: ExtractedKeyword[];
  /** Inferred from who speaks more in the transcript; optional on older analyses. */
  talkTimeAnalysis?: TalkTimeAnalysis;
  conversationQuality: ConversationQuality;
  agentPerformance: AgentPerformance;
  sentimentAndPatterns: SentimentAndPatterns;
  actionItems: ActionItemExtracted[];
};
