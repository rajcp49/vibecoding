"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  RECORDINGS_CHANGED_EVENT,
  deleteRecording,
  getAllRecordings,
} from "@/lib/recordings-db";
import type { SavedRecording } from "@/types/saved-recording";

function formatWhen(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ts));
  } catch {
    return new Date(ts).toLocaleString();
  }
}

function RecordingRow({ rec, onRemoved }: { rec: SavedRecording; onRemoved: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [durationLabel, setDurationLabel] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const u = URL.createObjectURL(rec.audio);
    setUrl(u);
    return () => {
      URL.revokeObjectURL(u);
    };
  }, [rec.audio]);

  const remove = useCallback(async () => {
    if (!window.confirm("Remove this recording from your dashboard?")) return;
    setDeleting(true);
    try {
      await deleteRecording(rec.id);
      onRemoved();
    } finally {
      setDeleting(false);
    }
  }, [rec.id, onRemoved]);

  const preview =
    rec.transcript.trim().length > 160
      ? `${rec.transcript.trim().slice(0, 160)}…`
      : rec.transcript.trim();

  const analyzed = Boolean(rec.analysis);

  return (
    <li className="overflow-hidden rounded-xl border border-amber-500/20 border-l-4 border-l-emerald-500/70 bg-gradient-to-b from-neutral-900/70 to-black/50 p-4 shadow-lg ring-1 ring-amber-500/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-stone-100">{rec.title}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
                analyzed
                  ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30"
                  : "bg-sky-500/15 text-sky-300 ring-sky-400/25"
              }`}
            >
              {analyzed ? "Analyzed" : "Not analyzed"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500">
            {formatWhen(rec.createdAt)}
            {durationLabel ? ` · ${durationLabel}` : null}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={`/call/${encodeURIComponent(rec.id)}`}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-semibold text-black shadow-md shadow-emerald-500/25 transition hover:from-emerald-400 hover:to-teal-500"
          >
            Open call
          </Link>
          <button
            type="button"
            onClick={() => void remove()}
            disabled={deleting}
            className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-1.5 text-xs font-medium text-rose-300/90 transition hover:border-rose-400/50 hover:bg-rose-500/15 disabled:opacity-50"
          >
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>

      {url ? (
        <audio
          className="mt-4 w-full"
          src={url}
          controls
          preload="metadata"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (!Number.isFinite(d)) return;
            const m = Math.floor(d / 60);
            const s = Math.floor(d % 60);
            setDurationLabel(`${m}:${s.toString().padStart(2, "0")}`);
          }}
        />
      ) : null}

      {preview ? (
        <p className="mt-3 text-sm leading-relaxed text-stone-400">
          {preview}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-stone-600">
          No transcript yet — open the call and run Transcribe.
        </p>
      )}
    </li>
  );
}

type PanelProps = {
  /** Flatter layout for the Recorded audio tab (no outer card). */
  variant?: "default" | "page";
};

export function SavedRecordingsPanel({ variant = "default" }: PanelProps) {
  const [list, setList] = useState<SavedRecording[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isPage = variant === "page";

  const load = useCallback(async () => {
    try {
      setLoadError(null);
      const rows = await getAllRecordings();
      setList(rows);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load recordings.");
      setList([]);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  useEffect(() => {
    const onChange = () => void load();
    window.addEventListener(RECORDINGS_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(RECORDINGS_CHANGED_EVENT, onChange);
  }, [load]);

  const empty = useMemo(() => list !== null && list.length === 0, [list]);

  return (
    <section
      id={isPage ? "your-calls" : undefined}
      className={
        isPage
          ? "mb-0 scroll-mt-8"
          : "mb-10 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-neutral-900/80 to-black/60 p-6 shadow-xl shadow-black/40 ring-1 ring-amber-500/10 sm:p-8"
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-100">
            {isPage ? "All clips" : "Your saved calls"}
          </h2>
          <p className="text-sm text-stone-500">
            {isPage
              ? "Stored in this browser (IndexedDB)."
              : "Audio and transcripts stored in this browser (IndexedDB). Play back anytime."}
          </p>
        </div>
        <a
          href="#getting-started"
          className="inline-flex items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200/90 shadow-md shadow-violet-900/30 transition hover:border-violet-400/50 hover:bg-violet-500/25"
        >
          How it works
        </a>
      </div>

      {loadError ? (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {loadError}
        </p>
      ) : null}

      {list === null ? (
        <p className="mt-6 text-sm text-stone-500">Loading…</p>
      ) : empty ? (
        <p className="mt-6 rounded-xl border border-dashed border-amber-500/25 bg-black/30 px-4 py-8 text-center text-sm text-stone-400">
          Nothing saved yet. Use{" "}
          <span className="font-semibold uppercase text-amber-400/90">
            Upload
          </span>{" "}
          in the sidebar or header — clips show up here automatically.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((rec) => (
            <RecordingRow key={rec.id} rec={rec} onRemoved={load} />
          ))}
        </ul>
      )}
    </section>
  );
}
