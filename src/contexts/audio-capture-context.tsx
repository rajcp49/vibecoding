"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { extensionForMime } from "@/lib/audio-recorder";
import { decodeAudioDurationSeconds } from "@/lib/decode-audio-duration";
import {
  getRecording,
  saveRecording,
  updateRecording,
} from "@/lib/recordings-db";
import {
  clearTranscribeSessionCache,
  saveLastRecordingId,
  saveTranscribeSessionCache,
} from "@/lib/persisted-app-state";
import type { ConversationAnalysis } from "@/types/conversation-analysis";

type Phase = "idle" | "transcribing";

const FILE_ACCEPT =
  "audio/*,.webm,.mp3,.wav,.m4a,.mp4,.mpeg,.mpga,.ogg";

type AudioCaptureContextValue = {
  phase: Phase;
  recordedBlob: Blob | null;
  audioUrl: string | null;
  recordMime: string;
  fileLabel: string | null;
  saveTitle: string;
  setSaveTitle: (v: string) => void;
  transcript: string;
  error: string | null;
  autoSaveNotice: string | null;
  analysis: ConversationAnalysis | null;
  analysisError: string | null;
  isAnalyzing: boolean;
  isBusy: boolean;
  currentRecordingId: string | null;
  uploadInputRef: React.RefObject<HTMLInputElement | null>;
  resetRecording: () => void;
  triggerUpload: () => void;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  transcribe: () => Promise<void>;
  runAnalysis: () => Promise<void>;
  loadRecordingById: (id: string) => Promise<void>;
};

const AudioCaptureContext = createContext<AudioCaptureContextValue | null>(
  null,
);

export function AudioCaptureProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordMime, setRecordMime] = useState<string>("audio/webm");
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [saveTitle, setSaveTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [autoSaveNotice, setAutoSaveNotice] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(
    null,
  );

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const currentRecordingIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!recordedBlob) {
      setAudioUrl(null);
      return;
    }
    const url = URL.createObjectURL(recordedBlob);
    setAudioUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [recordedBlob]);

  const persistNewBlob = useCallback(
    async (blob: Blob, mime: string, name: string | null) => {
      const id = crypto.randomUUID();
      const title =
        (name?.replace(/\.[^.]+$/, "") || "").trim() ||
        `Recording ${new Date().toLocaleString()}`;
      await saveRecording({
        id,
        createdAt: Date.now(),
        title,
        mimeType: mime || blob.type || "audio/webm",
        audio: blob,
        transcript: "",
      });
      currentRecordingIdRef.current = id;
      setCurrentRecordingId(id);
      setSaveTitle(title);
      setAutoSaveNotice("Saved to your library");
      window.setTimeout(() => setAutoSaveNotice(null), 3500);
      void (async () => {
        const sec = await decodeAudioDurationSeconds(blob);
        if (sec != null && sec > 0) {
          await updateRecording(id, { durationSeconds: sec });
        }
      })();
      return id;
    },
    [],
  );

  const loadRecordingById = useCallback(async (id: string) => {
    const rec = await getRecording(id);
    if (!rec) return;
    setRecordedBlob(rec.audio);
    setRecordMime(rec.mimeType);
    setFileLabel(null);
    setSaveTitle(rec.title);
    setTranscript(rec.transcript);
    setAnalysis(rec.analysis ?? null);
    setAnalysisError(null);
    setError(null);
    currentRecordingIdRef.current = rec.id;
    setCurrentRecordingId(rec.id);
  }, []);

  useEffect(() => {
    saveLastRecordingId(currentRecordingId);
  }, [currentRecordingId]);

  useEffect(() => {
    if (!currentRecordingId) return;
    const t = window.setTimeout(() => {
      saveTranscribeSessionCache({
        recordingId: currentRecordingId,
        transcript,
        saveTitle,
        fileLabel,
        analysis,
        updatedAt: Date.now(),
      });
    }, 400);
    return () => window.clearTimeout(t);
  }, [
    currentRecordingId,
    transcript,
    saveTitle,
    fileLabel,
    analysis,
  ]);

  useEffect(() => {
    if (!currentRecordingId) return;
    const t = window.setTimeout(() => {
      const next = saveTitle.trim();
      if (!next) return;
      void updateRecording(currentRecordingId, { title: next });
    }, 500);
    return () => window.clearTimeout(t);
  }, [saveTitle, currentRecordingId]);

  const resetRecording = useCallback(() => {
    setRecordedBlob(null);
    setRecordMime("audio/webm");
    setFileLabel(null);
    setSaveTitle("");
    setTranscript("");
    setError(null);
    setAnalysis(null);
    setAnalysisError(null);
    currentRecordingIdRef.current = null;
    setCurrentRecordingId(null);
    saveLastRecordingId(null);
    clearTranscribeSessionCache();
  }, []);

  const onFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      setError(null);
      setTranscript("");
      setAnalysis(null);
      setAnalysisError(null);
      if (!f) return;
      setRecordedBlob(f);
      setRecordMime(f.type || "audio/webm");
      setFileLabel(f.name);
      setSaveTitle(f.name.replace(/\.[^.]+$/, "") || "");
      await persistNewBlob(f, f.type || "audio/webm", f.name);
    },
    [persistNewBlob],
  );

  const triggerUpload = useCallback(() => {
    uploadInputRef.current?.click();
  }, []);

  const transcribe = useCallback(async () => {
    if (!recordedBlob || recordedBlob.size === 0) {
      setError("Add an audio file first.");
      return;
    }
    setPhase("transcribing");
    setError(null);
    try {
      const ext = extensionForMime(recordMime);
      const name = fileLabel ?? `recording.${ext}`;
      const fd = new FormData();
      fd.append("file", recordedBlob, name);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        setPhase("idle");
        return;
      }
      const next = data.text?.trim() ?? "";
      setTranscript(next);
      setAnalysis(null);
      setAnalysisError(null);
      const rid = currentRecordingIdRef.current ?? currentRecordingId;
      if (rid) {
        await updateRecording(rid, { transcript: next });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setPhase("idle");
    }
  }, [recordedBlob, recordMime, fileLabel, currentRecordingId]);

  const runAnalysis = useCallback(async () => {
    const t = transcript.trim();
    if (!t) {
      setAnalysisError("Transcribe the call first.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/analyze-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: t }),
      });
      const data = (await res.json()) as {
        analysis?: ConversationAnalysis;
        error?: string;
      };
      if (!res.ok) {
        setAnalysis(null);
        setAnalysisError(data.error ?? `Analysis failed (${res.status})`);
        return;
      }
      if (data.analysis) {
        setAnalysis(data.analysis);
        const rid = currentRecordingIdRef.current ?? currentRecordingId;
        if (rid) {
          await updateRecording(rid, {
            analysis: data.analysis,
            analyzedAt: Date.now(),
          });
        }
      } else {
        setAnalysisError("No analysis returned.");
      }
    } catch (e) {
      setAnalysis(null);
      setAnalysisError(e instanceof Error ? e.message : "Network error");
    } finally {
      setIsAnalyzing(false);
    }
  }, [transcript, currentRecordingId]);

  const isBusy = phase === "transcribing" || isAnalyzing;

  const value: AudioCaptureContextValue = {
    phase,
    recordedBlob,
    audioUrl,
    recordMime,
    fileLabel,
    saveTitle,
    setSaveTitle,
    transcript,
    error,
    autoSaveNotice,
    analysis,
    analysisError,
    isAnalyzing,
    isBusy,
    currentRecordingId,
    uploadInputRef,
    resetRecording,
    triggerUpload,
    onFileInputChange,
    transcribe,
    runAnalysis,
    loadRecordingById,
  };

  return (
    <AudioCaptureContext.Provider value={value}>
      <input
        ref={uploadInputRef}
        type="file"
        className="sr-only"
        accept={FILE_ACCEPT}
        aria-hidden
        tabIndex={-1}
        disabled={isBusy}
        onChange={onFileInputChange}
      />
      {children}
    </AudioCaptureContext.Provider>
  );
}

export function useAudioCapture() {
  const ctx = useContext(AudioCaptureContext);
  if (!ctx) {
    throw new Error("useAudioCapture must be used within AudioCaptureProvider");
  }
  return ctx;
}
