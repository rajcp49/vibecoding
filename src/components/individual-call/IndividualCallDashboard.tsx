import { FeatureCard } from "@/components/individual-call/FeatureCard";
import { MetricsCard } from "@/components/individual-call/MetricsCard";
import { RecordingTranscriptPanel } from "@/components/individual-call/RecordingTranscriptPanel";
import type { TranscriptTurn } from "@/lib/parse-transcript-turns";

export type IndividualCallModel = {
  title: string;
  /** AI call summary (purpose, topics, outcome). */
  summary: string;
  /** Display sentiment */
  sentimentLabel: "Positive" | "Neutral" | "Negative";
  transcriptTurns: TranscriptTurn[];
  audioUrl: string | null;
  agentTalkPercent: number;
  customerTalkPercent: number;
  /** Null when this clip has not been analyzed yet. */
  overallScore: number | null;
  hasAnalysis: boolean;
};

const ICON_DOC = (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const ICON_SMILE = (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ICON_PLAY = (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

type Props = {
  model: IndividualCallModel;
};

export function IndividualCallDashboard({ model }: Props) {
  const summaryDesc = model.summary.trim()
    ? model.summary.trim()
    : "AI-generated summary covering the purpose, main topics, and outcome of the call. Run Analyze insights on the Transcribe tab to generate one for this recording.";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <h1 className="bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Individual Call Dashboard
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-400">
          Each call receives its own dedicated analysis page with granular detail
          to help teams understand exactly what happened during the conversation.
        </p>
        <p className="mt-2 text-sm font-medium text-amber-200/90">
          {model.title}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
        <div className="flex flex-col gap-4">
          <FeatureCard
            title="Call Summary"
            description={summaryDesc}
            icon={ICON_DOC}
          />
          <FeatureCard
            title="Call Sentiment"
            description={`Classified as ${model.sentimentLabel} based on tone and language analysis in the transcript.`}
            icon={ICON_SMILE}
          />
          <div className="rounded-xl border border-amber-500/15 bg-gradient-to-b from-neutral-900/80 to-black/50 p-4 shadow-lg ring-1 ring-amber-500/10">
            <div className="flex gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300/90"
                aria-hidden
              >
                {ICON_PLAY}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-stone-100">
                  Recording Player
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-400">
                  Play original audio alongside the transcript. Segment highlight
                  tracks playback progress when the transcript is split into
                  multiple parts.
                </p>
                <div className="mt-4">
                  <RecordingTranscriptPanel
                    audioUrl={model.audioUrl}
                    turns={model.transcriptTurns}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <MetricsCard
          hasAnalysis={model.hasAnalysis}
          agentTalkPercent={model.agentTalkPercent}
          customerTalkPercent={model.customerTalkPercent}
          overallScore={model.overallScore}
        />
      </div>
    </div>
  );
}
