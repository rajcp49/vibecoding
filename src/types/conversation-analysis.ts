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

/** Discovery / business questions coverage (individual call dashboard). */
export type QuestionnaireItem = {
  topic: string;
  asked: boolean;
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
  /**
   * Qualitative strengths observed in the call (for individual call dashboard).
   * Present on new analyses; older saved rows may omit.
   */
  positiveObservations?: string[];
  /**
   * Areas for improvement or risks (for individual call dashboard).
   * Present on new analyses; older saved rows may omit.
   */
  negativeObservations?: string[];
  /**
   * Which discovery / business question areas were addressed in the call.
   * Present on new analyses; older saved rows may omit.
   */
  questionnaireItems?: QuestionnaireItem[];
};
