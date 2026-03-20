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
          className="w-full rounded-lg border border-brand/15 bg-paper"
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
        <p className="rounded-lg border border-dashed border-brand/25 bg-brand/5 px-3 py-4 text-sm text-ink/70">
          No audio available for this clip.
        </p>
      )}

      {progressLabel ? (
        <p className="text-xs font-medium uppercase tracking-wide text-ink/55">
          Transcript segments · {progressLabel}
        </p>
      ) : null}

      <div
        className="max-h-[min(24rem,50vh)] space-y-3 overflow-y-auto rounded-lg border border-brand/12 bg-paper p-3"
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
                  ? "bg-brand/12 text-ink ring-1 ring-brand/35"
                  : "text-ink/90"
              }`}
            >
              <span className="font-semibold text-brand">
                {turn.speaker}
              </span>
              <span className="text-ink/45"> · </span>
              {turn.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
