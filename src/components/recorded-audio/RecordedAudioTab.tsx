"use client";

import { SavedRecordingsPanel } from "@/components/dashboard/SavedRecordingsPanel";
import { TranscribeStep } from "@/components/transcribe/TranscribeStep";

export function RecordedAudioTab() {
  return (
    <div className="px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 border-b border-amber-500/15 pb-6">
          <p className="text-sm font-medium text-amber-400/90">
            Library
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
            Recorded audio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">
            Clips saved in this browser. Use{" "}
            <span className="font-semibold uppercase text-amber-400/90">
              Upload
            </span>{" "}
            at the top or in the sidebar to add files; transcribe and analyze
            below, or open a clip from the list.
          </p>
        </header>

        <div className="mb-10">
          <TranscribeStep />
        </div>

        <SavedRecordingsPanel variant="page" />
      </div>
    </div>
  );
}
