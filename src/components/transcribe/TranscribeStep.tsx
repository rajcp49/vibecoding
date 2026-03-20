"use client";

import Link from "next/link";
import { useAudioCapture } from "@/contexts/audio-capture-context";
import { CallInsightsPanel } from "./CallInsightsPanel";

const card =
  "surface-rich rounded-2xl border border-brand/12 p-6 sm:p-8";

type TranscribeStepProps = {
  /** Merges with root wrapper; use e.g. `max-w-none` in split layouts. */
  className?: string;
};

export function TranscribeStep({ className = "" }: TranscribeStepProps) {
  const {
    phase,
    recordedBlob,
    audioUrl,
    fileLabel,
    saveTitle,
    setSaveTitle,
    transcript,
    error,
    autoSaveNotice,
    analysis,
    analysisError,
    isAnalyzing,
    resetRecording,
    transcribe,
    runAnalysis,
  } = useAudioCapture();

  const transcribing = phase === "transcribing";

  return (
    <div className={`mx-auto max-w-4xl space-y-8 ${className}`}>
      <div className={card}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand via-brand/95 to-brand/85 text-sm font-semibold text-paper shadow-[0_4px_16px_-4px_rgba(184,134,11,0.4)]">
              1
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                Review &amp; transcribe
              </h2>
              <p className="text-sm text-ink/65">
                Use <span className="font-medium text-brand">Upload</span>{" "}
                in the header or sidebar to choose an audio file—it saves to your library
                automatically; then run Transcribe below.
              </p>
            </div>
          </div>
          {recordedBlob ? (
            <button
              type="button"
              onClick={resetRecording}
              disabled={transcribing || isAnalyzing}
              className="shrink-0 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium text-ink/65 transition hover:border-brand/30 hover:text-brand disabled:opacity-50"
            >
              Clear session
            </button>
          ) : null}
        </div>

        {autoSaveNotice ? (
          <p className="mt-5 rounded-lg border border-brand/20 bg-brand/8 px-3 py-2 text-sm text-ink">
            {autoSaveNotice}.{" "}
            <Link
              href="/"
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              View in Dashboard
            </Link>
          </p>
        ) : null}

        {recordedBlob ? (
          <section
            className="mt-6 overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-b from-brand/8 to-white"
            aria-label="Audio playback"
          >
            <div className="border-b border-brand/12 bg-brand/5 px-4 py-3 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Current clip
              </p>
              <p className="mt-1 truncate text-sm text-ink/65">
                {fileLabel ? (
                  <>
                    <span className="font-medium text-ink">{fileLabel}</span>
                    <span className="text-ink/45">
                      {" "}
                      · {(recordedBlob.size / 1024).toFixed(1)} KB
                    </span>
                  </>
                ) : (
                  <span>
                    Audio · {(recordedBlob.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </p>
            </div>
            <div className="relative z-0 px-4 pb-5 pt-4 sm:px-5">
              {audioUrl ? (
                <audio
                  className="block min-h-[48px] w-full max-w-full rounded-lg border border-brand/12 bg-paper shadow-inner"
                  src={audioUrl}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                />
              ) : (
                <div className="flex min-h-[48px] items-center rounded-lg border border-dashed border-ink/15 bg-paper px-3 text-sm text-ink/50">
                  Preparing playback…
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-brand/25 bg-brand/5 px-4 py-10 text-center text-sm text-ink/65">
            No clip yet. Use Upload in the header or sidebar to choose a file.
          </div>
        )}

        {recordedBlob ? (
          <div className="mt-6 rounded-xl border border-brand/12 bg-white p-4 sm:p-5 shadow-sm">
            <label
              htmlFor="save-title"
              className="block text-sm font-medium text-ink/80"
            >
              Title in library
            </label>
            <input
              id="save-title"
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="e.g. Acme — pricing call"
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-ink placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />

            <div className="mt-5">
              <button
                type="button"
                onClick={() => void transcribe()}
                disabled={transcribing || isAnalyzing || !recordedBlob}
                className="w-full rounded-xl bg-gradient-to-r from-brand via-brand/95 to-brand/85 py-3.5 text-sm font-semibold text-paper shadow-[0_8px_28px_-8px_rgba(184,134,11,0.45)] transition hover:brightness-105 disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
              >
                {transcribing ? "Transcribing…" : "Transcribe"}
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <p
            className="mt-4 rounded-lg border border-ink/15 bg-ink/5 px-3 py-2 text-sm text-ink"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      {transcript ? (
        <div className={card}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Transcript
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void runAnalysis()}
                disabled={isAnalyzing || transcribing}
                className="rounded-xl bg-gradient-to-r from-brand via-brand/95 to-brand/85 px-4 py-2 text-sm font-semibold text-paper shadow-[0_6px_24px_-6px_rgba(184,134,11,0.4)] transition hover:brightness-105 disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing…" : "Analyze insights"}
              </button>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(transcript);
                }}
                className="rounded-xl border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink/85 transition hover:border-brand/25 hover:text-brand"
              >
                Copy transcript
              </button>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-ink/90">
            {transcript}
          </p>
          {analysisError ? (
            <p
              className="mt-4 rounded-lg border border-ink/15 bg-ink/5 px-3 py-2 text-sm text-ink"
              role="alert"
            >
              {analysisError}
            </p>
          ) : null}
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-brand/15 pb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand via-brand/95 to-brand/85 text-xs font-bold text-paper shadow-[0_4px_14px_-4px_rgba(184,134,11,0.4)]">
              2
            </span>
            <h2 className="text-lg font-semibold text-ink">
              Call insights
            </h2>
          </div>
          <CallInsightsPanel data={analysis} />
        </div>
      ) : null}
    </div>
  );
}
