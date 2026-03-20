"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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

function RecordingRow({
  rec,
  onRemoved,
}: {
  rec: SavedRecording;
  onRemoved: () => void;
}) {
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
    <li className="surface-rich overflow-hidden rounded-xl border border-brand/15 border-l-4 border-l-brand p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-snug text-ink">{rec.title}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${
                analyzed
                  ? "bg-brand/15 text-brand ring-brand/35"
                  : "bg-ink/5 text-ink/70 ring-ink/15"
              }`}
            >
              {analyzed ? "Analyzed" : "Not analyzed"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink/55">
            {formatWhen(rec.createdAt)}
            {durationLabel ? ` · ${durationLabel}` : null}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={`/call/${encodeURIComponent(rec.id)}`}
            className="rounded-lg bg-gradient-to-r from-brand via-brand/95 to-brand/85 px-3 py-1.5 text-xs font-semibold text-paper shadow-[0_4px_16px_-4px_rgba(184,134,11,0.4)] transition hover:brightness-105"
          >
            Open call
          </Link>
          <button
            type="button"
            onClick={() => void remove()}
            disabled={deleting}
            className="rounded-lg border border-ink/15 bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink/80 transition hover:border-brand/25 hover:bg-brand/5 hover:text-ink disabled:opacity-50"
          >
            {deleting ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>

      {url ? (
        <audio
          className="mt-3 w-full rounded-lg border border-brand/10 bg-paper/80 [&::-webkit-media-controls-panel]:bg-paper"
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
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {preview}
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-ink/50">
          No transcript yet — open the call and run Transcribe.
        </p>
      )}
    </li>
  );
}

type SortKey = "newest" | "oldest" | "title";

type PanelProps = {
  /** Flatter layout on the dashboard “All clips” section (no outer card). */
  variant?: "default" | "page";
};

export function SavedRecordingsPanel({ variant = "default" }: PanelProps) {
  const [list, setList] = useState<SavedRecording[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

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

  const filteredSorted = useMemo(() => {
    if (!list) return null;
    let rows = [...list];
    const q = query.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.transcript.toLowerCase().includes(q),
      );
    }
    rows.sort((a, b) => {
      if (sort === "newest") return b.createdAt - a.createdAt;
      if (sort === "oldest") return a.createdAt - b.createdAt;
      return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
    });
    return rows;
  }, [list, query, sort]);

  const empty = useMemo(() => list !== null && list.length === 0, [list]);
  const noMatches = useMemo(
    () =>
      list !== null &&
      list.length > 0 &&
      filteredSorted !== null &&
      filteredSorted.length === 0,
    [list, filteredSorted],
  );

  const sectionClass = isPage
    ? "mb-0 scroll-mt-8"
    : "mb-10 rounded-2xl border border-brand/15 bg-gradient-to-b from-white to-paper p-6 shadow-[0_24px_60px_-28px_rgba(42,36,32,0.12)] ring-1 ring-brand/10 sm:p-8";

  const heading = isPage ? "All clips" : "Your saved calls";

  const sub = isPage
    ? "Stored in this browser (IndexedDB)."
    : "Audio and transcripts stored in this browser (IndexedDB). Play back anytime.";

  return (
    <section
      id={isPage ? "your-calls" : undefined}
      className={sectionClass}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-ink">{heading}</h2>
          <p className="text-sm text-ink/60">{sub}</p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {isPage && list && list.length > 0 ? (
            <>
              <label className="sr-only" htmlFor="clips-search">
                Search clips
              </label>
              <input
                id="clips-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-full min-w-[10rem] rounded-lg border border-brand/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 sm:w-44"
              />
              <label className="sr-only" htmlFor="clips-sort">
                Sort clips
              </label>
              <select
                id="clips-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-brand/15 bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
              </select>
            </>
          ) : null}
          <Link
            href="/#getting-started"
            className="inline-flex items-center justify-center rounded-xl border border-brand/25 bg-brand/8 px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:border-brand/40 hover:bg-brand/12"
          >
            How it works
          </Link>
        </div>
      </div>

      {loadError ? (
        <p className="mt-4 text-sm text-brand" role="alert">
          {loadError}
        </p>
      ) : null}

      {list === null ? (
        <p className="mt-6 text-sm text-ink/50">Loading…</p>
      ) : empty ? (
        <p className="mt-6 rounded-xl border border-dashed border-brand/25 bg-brand/5 px-4 py-8 text-center text-sm text-ink/65">
          Nothing saved yet. Use{" "}
          <span className="font-semibold uppercase text-brand">Upload</span> in
          the sidebar or header — clips show up here automatically.
        </p>
      ) : noMatches ? (
        <p className="mt-6 rounded-xl border border-dashed border-ink/15 bg-ink/5 px-4 py-6 text-center text-sm text-ink/70">
          No clips match “{query.trim()}”. Try a different search.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {filteredSorted?.map((rec) => (
            <RecordingRow key={rec.id} rec={rec} onRemoved={load} />
          ))}
        </ul>
      )}
    </section>
  );
}
