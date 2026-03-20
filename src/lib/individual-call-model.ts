import type { IndividualCallModel } from "@/components/individual-call/IndividualCallDashboard";
import { parseTranscriptTurns } from "@/lib/parse-transcript-turns";
import type { SavedRecording } from "@/types/saved-recording";

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
  };
}
