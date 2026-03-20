import { TAB_IDS, type AppTabId } from "@/lib/app-tabs";

const PREFERRED_TAB_KEY = "vibecoding:preferred-tab";
const LAST_RECORDING_KEY = "vibecoding:last-recording-id";
const TRANSCRIBE_CACHE_KEY = "vibecoding:transcribe-session-cache";

function safeSet(key: string, value: string, storage: Storage): void {
  try {
    storage.setItem(key, value);
  } catch {
    /* quota / private mode */
  }
}

function safeGet(key: string, storage: Storage): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeRemove(key: string, storage: Storage): void {
  try {
    storage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function isAppTabId(v: string): v is AppTabId {
  return (TAB_IDS as readonly string[]).includes(v);
}

/** Survives browser restart — used when the URL has no `?tab=`. */
export function savePreferredTab(tab: AppTabId): void {
  if (typeof window === "undefined") return;
  safeSet(PREFERRED_TAB_KEY, tab, localStorage);
}

export function getPreferredTab(): AppTabId | null {
  if (typeof window === "undefined") return null;
  const raw = safeGet(PREFERRED_TAB_KEY, localStorage);
  if (!raw) return null;
  if (raw === "transcribe" || raw === "recordings") return "dashboard";
  if (!isAppTabId(raw)) return null;
  return raw;
}

/** Current tab session — which recording the user was working on. */
export function saveLastRecordingId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    safeSet(LAST_RECORDING_KEY, id, sessionStorage);
  } else {
    safeRemove(LAST_RECORDING_KEY, sessionStorage);
  }
}

export function getLastRecordingId(): string | null {
  if (typeof window === "undefined") return null;
  return safeGet(LAST_RECORDING_KEY, sessionStorage);
}

export type TranscribeSessionCache = {
  recordingId: string;
  transcript: string;
  saveTitle: string;
  fileLabel: string | null;
  /** Serialized analysis for reload before IndexedDB re-read. */
  analysis: unknown | null;
  updatedAt: number;
};

export function saveTranscribeSessionCache(cache: TranscribeSessionCache): void {
  if (typeof window === "undefined") return;
  try {
    safeSet(TRANSCRIBE_CACHE_KEY, JSON.stringify(cache), sessionStorage);
  } catch {
    /* quota */
  }
}

export function getTranscribeSessionCache(): TranscribeSessionCache | null {
  if (typeof window === "undefined") return null;
  const raw = safeGet(TRANSCRIBE_CACHE_KEY, sessionStorage);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as TranscribeSessionCache;
    if (typeof o.recordingId !== "string" || !o.recordingId) return null;
    return o;
  } catch {
    return null;
  }
}

export function clearTranscribeSessionCache(): void {
  if (typeof window === "undefined") return;
  safeRemove(TRANSCRIBE_CACHE_KEY, sessionStorage);
}
