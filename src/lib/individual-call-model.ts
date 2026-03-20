import type { IndividualCallModel } from "@/components/individual-call/IndividualCallDashboard";
import { parseTranscriptTurns } from "@/lib/parse-transcript-turns";
import type {
  ActionItemExtracted,
  ExtractedKeyword,
  QuestionnaireItem,
} from "@/types/conversation-analysis";
import type { SavedRecording } from "@/types/saved-recording";

function safeStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function safeActionItems(raw: unknown): ActionItemExtracted[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => {
      if (!x || typeof x !== "object") return null;
      const o = x as Record<string, unknown>;
      const text = typeof o.text === "string" ? o.text.trim() : "";
      if (!text) return null;
      const t = o.type;
      const type =
        t === "commitment" || t === "follow_up" || t === "discussion_point"
          ? t
          : ("discussion_point" as const);
      const item: ActionItemExtracted = { text, type };
      if (typeof o.suggestedOwner === "string" && o.suggestedOwner.trim()) {
        return { ...item, suggestedOwner: o.suggestedOwner.trim() };
      }
      return item;
    })
    .filter((x): x is ActionItemExtracted => x !== null);
}

function safeQuestionnaireItems(raw: unknown): QuestionnaireItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const o = row as Record<string, unknown>;
      const topic = typeof o.topic === "string" ? o.topic.trim() : "";
      if (!topic) return null;
      return { topic, asked: o.asked === true };
    })
    .filter((x): x is QuestionnaireItem => x !== null);
}

function safeExtractedKeywords(raw: unknown): ExtractedKeyword[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (typeof row === "string") {
        const t = row.trim();
        return t ? { term: t } : null;
      }
      if (!row || typeof row !== "object") return null;
      const t = (row as Record<string, unknown>).term;
      return typeof t === "string" && t.trim() ? { term: t.trim() } : null;
    })
    .filter((x): x is ExtractedKeyword => x !== null);
}

export function savedRecordingToIndividualCallModel(
  rec: SavedRecording,
  audioUrl: string | null,
): IndividualCallModel {
  const a = rec.analysis;
  const ps = a?.summary?.primarySentiment ?? "neutral";
  const sentimentLabel: "Positive" | "Neutral" | "Negative" =
    ps === "positive" ? "Positive" : ps === "negative" ? "Negative" : "Neutral";
  const tt = a?.talkTimeAnalysis;
  const agent = tt?.agentTalkPercent ?? 50;
  const customer = tt?.customerTalkPercent ?? 50;
  const rawScore = a?.conversationQuality?.overallScore;
  const hasAnalysis = Boolean(a);
  const overallScore =
    hasAnalysis &&
    typeof rawScore === "number" &&
    Number.isFinite(rawScore)
      ? rawScore
      : null;

  return {
    title: rec.title,
    summary: a?.conversationQuality?.summary ?? "",
    sentimentLabel,
    transcriptTurns: parseTranscriptTurns(rec.transcript),
    audioUrl,
    agentTalkPercent: agent,
    customerTalkPercent: customer,
    overallScore,
    hasAnalysis,
    actionItems: safeActionItems(a?.actionItems),
    positiveObservations: safeStringList(a?.positiveObservations),
    negativeObservations: safeStringList(a?.negativeObservations),
    questionnaireItems: safeQuestionnaireItems(a?.questionnaireItems),
    topKeywords: safeExtractedKeywords(a?.extractedKeywords),
  };
}
