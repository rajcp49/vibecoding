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

export type UploadPipelineResult = {
  ok: boolean;
  recordingId: string | null;
};

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
  isUploadModalOpen: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  /** Save → transcribe → analyze; returns whether analysis completed and recording id. */
  queueUploadPipeline: (file: File) => Promise<UploadPipelineResult>;
  resetRecording: () => void;
  transcribe: (blobOverride?: Blob) => Promise<string | null>;
  runAnalysis: (transcriptOverride?: string | null) => Promise<boolean>;
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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  const transcribe = useCallback(async (blobOverride?: Blob): Promise<string | null> => {
    const blob = blobOverride ?? recordedBlob;
    if (!blob || blob.size === 0) {
      setError("Add an audio file first.");
      return null;
    }
    setPhase("transcribing");
    setError(null);
    try {
      const ext = extensionForMime(blob instanceof File ? blob.type || recordMime : recordMime);
      const name =
        blob instanceof File
          ? blob.name
          : fileLabel ?? `recording.${ext}`;
      const fd = new FormData();
      fd.append("file", blob, name);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        setPhase("idle");
        return null;
      }
      const next = data.text?.trim() ?? "";
      setTranscript(next);
      setAnalysis(null);
      setAnalysisError(null);
      const rid = currentRecordingIdRef.current ?? currentRecordingId;
      if (rid) {
        await updateRecording(rid, { transcript: next });
      }
      return next;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      return null;
    } finally {
      setPhase("idle");
    }
  }, [recordedBlob, recordMime, fileLabel, currentRecordingId]);

  const runAnalysis = useCallback(
    async (transcriptOverride?: string | null): Promise<boolean> => {
      const t = (transcriptOverride ?? transcript).trim();
      if (!t) {
        setAnalysisError("Transcribe the call first.");
        return false;
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
          return false;
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
          return true;
        }
        setAnalysisError("No analysis returned.");
        return false;
      } catch (e) {
        setAnalysis(null);
        setAnalysisError(e instanceof Error ? e.message : "Network error");
        return false;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [transcript, currentRecordingId],
  );

  const queueUploadPipeline = useCallback(
    async (file: File): Promise<UploadPipelineResult> => {
      setError(null);
      setTranscript("");
      setAnalysis(null);
      setAnalysisError(null);
      setRecordedBlob(file);
      setRecordMime(file.type || "audio/webm");
      setFileLabel(file.name);
      setSaveTitle(file.name.replace(/\.[^.]+$/, "") || "");
      try {
        await persistNewBlob(file, file.type || "audio/webm", file.name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save recording.");
        return { ok: false, recordingId: null };
      }
      const text = await transcribe(file);
      if (text == null || text.trim() === "") {
        return {
          ok: false,
          recordingId: currentRecordingIdRef.current,
        };
      }
      const analysisOk = await runAnalysis(text);
      return {
        ok: analysisOk,
        recordingId: currentRecordingIdRef.current,
      };
    },
    [persistNewBlob, transcribe, runAnalysis],
  );

  const openUploadModal = useCallback(() => {
    setError(null);
    setAnalysisError(null);
    setIsUploadModalOpen(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
  }, []);

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
    isUploadModalOpen,
    openUploadModal,
    closeUploadModal,
    queueUploadPipeline,
    resetRecording,
    transcribe,
    runAnalysis,
    loadRecordingById,
  };

  return (
    <AudioCaptureContext.Provider value={value}>
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

export { FILE_ACCEPT };
