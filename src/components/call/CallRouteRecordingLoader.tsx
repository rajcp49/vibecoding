"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAudioCapture } from "@/contexts/audio-capture-context";

/** Loads the `[id]` route param into `AudioCaptureProvider` for Transcribe / analyze. */
export function CallRouteRecordingLoader() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const { loadRecordingById } = useAudioCapture();
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (lastId.current === id) return;
    lastId.current = id;
    void loadRecordingById(id);
  }, [id, loadRecordingById]);

  return null;
}
