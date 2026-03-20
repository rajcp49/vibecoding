"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudioCapture } from "@/contexts/audio-capture-context";

export function AppSidebar() {
  const pathname = usePathname();
  const {
    openUploadModal,
    resetRecording,
    isBusy,
    recordedBlob,
  } = useAudioCapture();

  const homeActive = pathname === "/";

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-brand/15 bg-white/95 shadow-[4px_0_40px_-20px_rgba(42,36,32,0.08)] backdrop-blur-md md:w-72 md:border-b-0 md:border-r md:border-brand/15">
      <div className="border-b border-brand/10 px-5 py-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-brand via-brand/90 to-brand/75 bg-clip-text text-lg font-semibold tracking-tight text-transparent"
        >
          Vibecoding
        </Link>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-brand/90">
          Call intelligence
        </p>
        <button
          type="button"
          onClick={openUploadModal}
          disabled={isBusy}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-brand via-brand/95 to-brand/85 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[0_6px_28px_-6px_rgba(184,134,11,0.45)] transition hover:brightness-105 disabled:opacity-40"
        >
          Upload
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        <Link
          href="/"
          className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            homeActive
              ? "border border-brand/25 bg-gradient-to-r from-brand/10 to-brand/5 text-ink shadow-sm ring-1 ring-brand/15"
              : "text-ink/70 hover:bg-brand/5 hover:text-ink"
          }`}
        >
          Dashboard
        </Link>
      </nav>

      <div className="border-t border-brand/10 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45">
          Tips
        </p>
        <ul className="space-y-2 text-xs leading-relaxed text-ink/65">
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_rgba(184,134,11,0.5)]" />
            <span>
              <span className="font-medium text-brand">Bold gold</span> stats
              come from analyzed calls.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand/50" />
            <span>
              <span className="font-medium text-ink/80">Soft gold</span> badges
              mean insights are ready.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ink/25" />
            <span>
              <span className="font-medium text-ink/70">Muted</span> means
              still needs transcribe + analyze.
            </span>
          </li>
        </ul>
      </div>

      {recordedBlob ? (
        <div className="border-t border-brand/10 p-4">
          <button
            type="button"
            onClick={resetRecording}
            disabled={isBusy}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:border-brand/30 hover:bg-brand/5 hover:text-ink disabled:opacity-40"
          >
            Clear clip
          </button>
        </div>
      ) : null}
    </aside>
  );
}
