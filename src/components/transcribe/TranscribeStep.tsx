"use client";

import Link from "next/link";
import { useAudioCapture } from "@/contexts/audio-capture-context";
import { CallInsightsPanel } from "./CallInsightsPanel";

export function TranscribeStep() {
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
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/60 p-6 shadow-xl shadow-black/40 ring-1 ring-amber-500/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-sm font-semibold text-black shadow-md shadow-amber-500/30">
              1
            </span>
            <div>
              <h2 className="text-lg font-semibold text-stone-100">
                Review &amp; transcribe
              </h2>
              <p className="text-sm text-stone-500">
                Use <span className="font-medium text-amber-400/90">Upload</span>{" "}
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
              className="shrink-0 rounded-lg border border-stone-600 px-3 py-1.5 text-xs font-medium text-stone-400 transition hover:border-amber-500/30 hover:text-amber-200/80 disabled:opacity-50"
            >
              Clear session
            </button>
          ) : null}
        </div>

        {autoSaveNotice ? (
          <p className="mt-5 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
            {autoSaveNotice}.{" "}
            <Link
              href="/?tab=dashboard"
              className="font-semibold text-amber-300 underline-offset-2 hover:underline"
            >
              View in Dashboard
            </Link>
          </p>
        ) : null}

        {recordedBlob ? (
          <section
            className="mt-6 overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/5 to-black/40 ring-1 ring-amber-500/10"
            aria-label="Audio playback"
          >
            <div className="border-b border-amber-500/15 bg-black/30 px-4 py-3 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600/90">
                Current clip
              </p>
              <p className="mt-1 truncate text-sm text-stone-400">
                {fileLabel ? (
                  <>
                    <span className="font-medium text-stone-200">{fileLabel}</span>
                    <span className="text-stone-600">
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
                  className="block min-h-[48px] w-full max-w-full rounded-lg bg-black/50 shadow-inner ring-1 ring-amber-500/20"
                  src={audioUrl}
                  controls
                  controlsList="nodownload"
                  preload="metadata"
                />
              ) : (
                <div className="flex min-h-[48px] items-center rounded-lg border border-dashed border-stone-700 bg-black/30 px-3 text-sm text-stone-500">
                  Preparing playback…
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-amber-500/20 bg-black/20 px-4 py-10 text-center text-sm text-stone-500">
            No clip yet. Use Upload in the header or sidebar to choose a file.
          </div>
        )}

        {recordedBlob ? (
          <div className="mt-6 rounded-xl border border-amber-500/15 bg-black/30 p-4 sm:p-5">
            <label
              htmlFor="save-title"
              className="block text-sm font-medium text-stone-400"
            >
              Title in library
            </label>
            <input
              id="save-title"
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="e.g. Acme — pricing call"
              className="mt-2 w-full rounded-lg border border-stone-700 bg-black/30 px-3 py-2.5 text-stone-100 placeholder:text-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />

            <div className="mt-5">
              <button
                type="button"
                onClick={() => void transcribe()}
                disabled={transcribing || isAnalyzing || !recordedBlob}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 py-3.5 text-sm font-semibold text-black shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-yellow-500 disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
              >
                {transcribing ? "Transcribing…" : "Transcribe"}
              </button>
            </div>
          </div>
        ) : null}

        {error ? (
          <p
            className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>

      {transcript ? (
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/60 p-6 shadow-xl ring-1 ring-amber-500/10 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600/80">
              Transcript
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void runAnalysis()}
                disabled={isAnalyzing || transcribing}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-yellow-700 px-4 py-2 text-sm font-semibold text-black shadow-md shadow-amber-900/40 transition hover:from-amber-500 hover:to-yellow-600 disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing…" : "Analyze insights"}
              </button>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(transcript);
                }}
                className="rounded-xl border border-stone-600 px-4 py-2 text-sm font-medium text-stone-400 transition hover:border-amber-500/30 hover:text-amber-200/80"
              >
                Copy transcript
              </button>
            </div>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-stone-200">
            {transcript}
          </p>
          {analysisError ? (
            <p
              className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-2 text-sm text-rose-200"
              role="alert"
            >
              {analysisError}
            </p>
          ) : null}
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-500/15 pb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-xs font-bold text-black shadow-md shadow-amber-500/25">
              2
            </span>
            <h2 className="text-lg font-semibold text-stone-100">
              Call insights
            </h2>
          </div>
          <CallInsightsPanel data={analysis} />
        </div>
      ) : null}
    </div>
  );
}
