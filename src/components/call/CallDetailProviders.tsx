"use client";

import { Suspense, type ReactNode } from "react";
import { AudioCaptureProvider } from "@/contexts/audio-capture-context";
import { CallRouteRecordingLoader } from "./CallRouteRecordingLoader";

export function CallDetailProviders({ children }: { children: ReactNode }) {
  return (
    <AudioCaptureProvider>
      <Suspense fallback={null}>
        <CallRouteRecordingLoader />
      </Suspense>
      {children}
    </AudioCaptureProvider>
  );
}
