"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAudioCapture } from "@/contexts/audio-capture-context";
import {
  clearTranscribeSessionCache,
  getLastRecordingId,
  saveLastRecordingId,
} from "@/lib/persisted-app-state";
import { getRecording } from "@/lib/recordings-db";

/**
 * Restores the last active recording after reload when the URL has no
 * `recordingId` (URL wins when present — see RecordingLoader).
 */
export function SessionHydration() {
  const searchParams = useSearchParams();
  const { loadRecordingById } = useAudioCapture();
  const ranForKey = useRef<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "recordings") return;
    if (tab && tab !== "dashboard" && tab !== "transcribe") return;
    if (searchParams.get("recordingId")) return;

    const last = getLastRecordingId();
    if (!last) return;

    const key = `session:${last}`;
    if (ranForKey.current === key) return;
    ranForKey.current = key;

    queueMicrotask(async () => {
      const rec = await getRecording(last);
      if (!rec) {
        ranForKey.current = null;
        saveLastRecordingId(null);
        clearTranscribeSessionCache();
        return;
      }
      await loadRecordingById(last);
    });
  }, [searchParams, loadRecordingById]);

  return null;
}
