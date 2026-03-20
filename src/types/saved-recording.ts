import type { ConversationAnalysis } from "@/types/conversation-analysis";

/** Stored in IndexedDB (browser-only). */
export type SavedRecording = {
  id: string;
  createdAt: number;
  title: string;
  mimeType: string;
  audio: Blob;
  transcript: string;
  /** From decoded audio (seconds). */
  durationSeconds?: number;
  /** Persisted when user runs Analyze insights. */
  analysis?: ConversationAnalysis;
  analyzedAt?: number;
};
