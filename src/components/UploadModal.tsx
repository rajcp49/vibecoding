"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FILE_ACCEPT, useAudioCapture } from "@/contexts/audio-capture-context";

export function UploadModal() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [running, setRunning] = useState(false);

  const {
    isUploadModalOpen,
    closeUploadModal,
    queueUploadPipeline,
    phase,
    isAnalyzing,
    isBusy,
    error,
    analysisError,
  } = useAudioCapture();

  const handleFile = useCallback(
    async (file: File) => {
      setRunning(true);
      try {
        const result = await queueUploadPipeline(file);
        if (result.ok && result.recordingId) {
          closeUploadModal();
          router.push(`/call/${encodeURIComponent(result.recordingId)}`);
        }
      } finally {
        setRunning(false);
      }
    },
    [queueUploadPipeline, closeUploadModal, router],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) void handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  useEffect(() => {
    if (!isUploadModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy && !running) closeUploadModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isUploadModalOpen, isBusy, running, closeUploadModal]);

  if (!isUploadModalOpen) return null;

  const showProgress = running || isBusy;
  const progressLabel =
    phase === "transcribing"
      ? "Transcribing audio…"
      : isAnalyzing
        ? "Analyzing insights…"
        : running
          ? "Saving & preparing…"
          : null;

  const combinedError = error ?? analysisError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={() => {
          if (!showProgress) closeUploadModal();
        }}
        disabled={showProgress}
      />
      <div
        className="surface-rich relative z-10 w-full max-w-md rounded-2xl border border-brand/20 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        <h2
          id="upload-modal-title"
          className="text-lg font-semibold text-ink"
        >
          Upload audio
        </h2>
        <p className="mt-1 text-sm text-ink/65">
          Choose a file. We&apos;ll save it to this browser, transcribe it, run
          AI analysis, and show you the call page when it&apos;s ready.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!showProgress) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={showProgress ? undefined : onDrop}
          className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-colors ${
            showProgress
              ? "cursor-not-allowed border-ink/10 bg-paper opacity-80"
              : dragOver
                ? "border-brand bg-brand/8"
                : "border-brand/25 bg-brand/5 hover:border-brand/40"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={FILE_ACCEPT}
            disabled={showProgress}
            onChange={onInputChange}
          />
          {showProgress ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <span
                className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent"
                aria-hidden
              />
              <p className="text-sm font-medium text-brand">
                {progressLabel ?? "Working…"}
              </p>
              <p className="text-xs text-ink/50">This can take a minute.</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">
                Drop a file here or
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-3 rounded-xl bg-gradient-to-r from-brand via-brand/95 to-brand/85 px-5 py-2.5 text-sm font-semibold text-paper shadow-[0_6px_24px_-6px_rgba(184,134,11,0.45)] transition hover:brightness-105"
              >
                Browse files
              </button>
              <p className="mt-3 text-center text-xs text-ink/50">
                MP3, WAV, M4A, WebM, and other common audio formats.
              </p>
            </>
          )}
        </div>

        {combinedError && !showProgress ? (
          <p
            className="mt-4 rounded-lg border border-ink/15 bg-ink/5 px-3 py-2 text-sm text-ink"
            role="alert"
          >
            {combinedError}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={showProgress}
            onClick={closeUploadModal}
            className="rounded-lg border border-ink/15 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-brand/25 hover:bg-brand/5 disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
