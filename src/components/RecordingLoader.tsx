"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAudioCapture } from "@/contexts/audio-capture-context";

/** Loads `?recordingId=` into the session (e.g. from Recorded audio → Open). */
export function RecordingLoader() {
  const searchParams = useSearchParams();
  const { loadRecordingById } = useAudioCapture();
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    const recordingId = searchParams.get("recordingId");
    if (!recordingId) {
      lastId.current = null;
      return;
    }
    if (recordingId === lastId.current) return;
    lastId.current = recordingId;
    void loadRecordingById(recordingId);
  }, [searchParams, loadRecordingById]);

  return null;
}
