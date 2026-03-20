"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { TranscriptTurn } from "@/lib/parse-transcript-turns";

type Props = {
  audioUrl: string | null;
  turns: TranscriptTurn[];
};

export function RecordingTranscriptPanel({ audioUrl, turns }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const totalTurns = turns.length;

  useEffect(() => {
    queueMicrotask(() => setActiveIndex(0));
  }, [turns]);

  const progressLabel = useMemo(() => {
    if (totalTurns <= 1) return null;
    return `${activeIndex + 1} / ${totalTurns}`;
  }, [activeIndex, totalTurns]);

  return (
    <div className="space-y-4">
      {audioUrl ? (
        <audio
          ref={audioRef}
          className="w-full"
          src={audioUrl}
          controls
          preload="metadata"
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            const d = el.duration;
            if (!Number.isFinite(d) || d <= 0 || totalTurns <= 0) return;
            const ratio = el.currentTime / d;
            const idx = Math.min(
              totalTurns - 1,
              Math.floor(ratio * totalTurns),
            );
            setActiveIndex(idx);
          }}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-amber-500/25 bg-black/30 px-3 py-4 text-sm text-stone-500">
          No audio available for this clip.
        </p>
      )}

      {progressLabel ? (
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Transcript segments · {progressLabel}
        </p>
      ) : null}

      <div
        className="max-h-[min(24rem,50vh)] space-y-3 overflow-y-auto rounded-lg border border-amber-500/15 bg-black/40 p-3 ring-1 ring-amber-500/10"
        role="region"
        aria-label="Call transcript"
      >
        {turns.map((turn, i) => {
          const isActive = i === activeIndex && totalTurns > 1;
          return (
            <div
              key={`${turn.speaker}-${i}-${turn.text.slice(0, 24)}`}
              className={`rounded-md px-3 py-2 text-sm leading-relaxed transition-colors ${
                isActive
                  ? "bg-amber-500/15 text-stone-100 ring-1 ring-amber-400/30"
                  : "text-stone-300"
              }`}
            >
              <span className="font-semibold text-amber-300/90">
                {turn.speaker}
              </span>
              <span className="text-stone-600"> · </span>
              {turn.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
