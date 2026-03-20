import type {
  ActionItemExtracted,
  ActionItemType,
  ConversationAnalysis,
  ExtractedKeyword,
  TalkTimeAnalysis,
} from "@/types/conversation-analysis";

function isNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function clampScore(n: number, min = 1, max = 10): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clampPercent(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function parseTalkTime(raw: unknown): TalkTimeAnalysis {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  let a = clampPercent(isNumber(o.agentTalkPercent) ? o.agentTalkPercent : 50);
  let b = clampPercent(isNumber(o.customerTalkPercent) ? o.customerTalkPercent : 50);
  const sum = a + b;
  if (sum <= 0) {
    return { agentTalkPercent: 50, customerTalkPercent: 50 };
  }
  a = Math.round((a / sum) * 100);
  b = 100 - a;
  return { agentTalkPercent: a, customerTalkPercent: b };
}

/** Best-effort parse; fills gaps so UI never breaks. */
export function parseConversationAnalysis(raw: unknown): ConversationAnalysis {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const sum = o.summary as Record<string, unknown> | undefined;
  const ps = sum?.primarySentiment;
  const primarySentiment =
    ps === "positive" || ps === "negative" || ps === "neutral" ? ps : "neutral";

  const ekRaw = o.extractedKeywords;
  const extractedKeywords: ExtractedKeyword[] = Array.isArray(ekRaw)
    ? (ekRaw as Record<string, unknown>[])
        .map((row) => {
          if (typeof row === "string") return { term: row };
          const t = row.term;
          return { term: typeof t === "string" ? t : "" };
        })
        .filter((k) => k.term.trim().length > 0)
    : [];

  const cq = o.conversationQuality as Record<string, unknown> | undefined;
  const ap = o.agentPerformance as Record<string, unknown> | undefined;
  const sp = o.sentimentAndPatterns as Record<string, unknown> | undefined;
  const ai = o.actionItems;

  const dims = Array.isArray(ap?.dimensions)
    ? (ap.dimensions as Record<string, unknown>[]).map((d) => ({
        name: typeof d.name === "string" ? d.name : "Dimension",
        score: clampScore(isNumber(d.score) ? d.score : 5),
        feedback: typeof d.feedback === "string" ? d.feedback : "",
      }))
    : [];

  const segments = Array.isArray(sp?.segments)
    ? (sp.segments as Record<string, unknown>[]).map((s) => ({
        phase: typeof s.phase === "string" ? s.phase : "Segment",
        sentiment: typeof s.sentiment === "string" ? s.sentiment : "neutral",
        note: typeof s.note === "string" ? s.note : "",
      }))
    : [];

  const items: ActionItemExtracted[] = Array.isArray(ai)
    ? (ai as Record<string, unknown>[]).map((x) => {
        const t = x.type;
        const type: ActionItemType =
          t === "commitment" || t === "follow_up" || t === "discussion_point"
            ? t
            : "discussion_point";
        const base: ActionItemExtracted = {
          text: typeof x.text === "string" ? x.text : "",
          type,
        };
        if (typeof x.suggestedOwner === "string" && x.suggestedOwner) {
          return { ...base, suggestedOwner: x.suggestedOwner };
        }
        return base;
      })
    : [];

  const talkTimeAnalysis = parseTalkTime(o.talkTimeAnalysis);

  return {
    summary: { primarySentiment },
    extractedKeywords,
    talkTimeAnalysis,
    conversationQuality: {
      overallScore: clampScore(
        isNumber(cq?.overallScore) ? cq.overallScore : 5,
      ),
      summary: typeof cq?.summary === "string" ? cq.summary : "",
      pacing: typeof cq?.pacing === "string" ? cq.pacing : "",
      structure: typeof cq?.structure === "string" ? cq.structure : "",
      engagement: typeof cq?.engagement === "string" ? cq.engagement : "",
    },
    agentPerformance: {
      summary: typeof ap?.summary === "string" ? ap.summary : "",
      dimensions: dims.length > 0 ? dims : [],
    },
    sentimentAndPatterns: {
      overallTone:
        typeof sp?.overallTone === "string" ? sp.overallTone : "",
      emotionalSummary:
        typeof sp?.emotionalSummary === "string" ? sp.emotionalSummary : "",
      behavioralSignals: Array.isArray(sp?.behavioralSignals)
        ? (sp.behavioralSignals as unknown[]).filter(
            (x): x is string => typeof x === "string",
          )
        : [],
      segments,
      notableShifts: Array.isArray(sp?.notableShifts)
        ? (sp.notableShifts as unknown[]).filter(
            (x): x is string => typeof x === "string",
          )
        : [],
    },
    actionItems: items.filter((i) => i.text.length > 0),
  };
}
