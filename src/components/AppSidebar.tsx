"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudioCapture } from "@/contexts/audio-capture-context";

export function AppSidebar() {
  const pathname = usePathname();
  const {
    triggerUpload,
    resetRecording,
    isBusy,
    recordedBlob,
  } = useAudioCapture();

  const homeActive = pathname === "/";

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-amber-500/15 bg-black/80 backdrop-blur-md md:w-72 md:border-b-0 md:border-r">
      <div className="border-b border-amber-500/10 px-5 py-6">
        <Link
          href="/"
          className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-lg font-semibold tracking-tight text-transparent"
        >
          Vibecoding
        </Link>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-amber-600/80">
          Call intelligence
        </p>
        <button
          type="button"
          onClick={triggerUpload}
          disabled={isBusy}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-amber-500/20 transition hover:from-amber-400 hover:to-yellow-500 hover:shadow-amber-400/25 disabled:opacity-40"
        >
          Upload
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        <Link
          href="/"
          className={`rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
            homeActive
              ? "border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-yellow-600/10 text-amber-100 shadow-inner shadow-amber-900/20"
              : "text-stone-400 hover:bg-amber-500/5 hover:text-amber-200/90"
          }`}
        >
          Dashboard
        </Link>
      </nav>

      <div className="border-t border-amber-500/10 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
          Tips
        </p>
        <ul className="space-y-2 text-xs leading-relaxed text-stone-500">
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span>
              <span className="font-medium text-amber-200/90">Gold</span> stats
              come from analyzed calls.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span>
              <span className="font-medium text-emerald-300/90">Green</span>{" "}
              badges mean insights are ready.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            <span>
              <span className="font-medium text-sky-300/90">Blue</span> means
              still needs transcribe + analyze.
            </span>
          </li>
        </ul>
      </div>

      {recordedBlob ? (
        <div className="border-t border-amber-500/10 p-4">
          <button
            type="button"
            onClick={resetRecording}
            disabled={isBusy}
            className="w-full rounded-xl border border-stone-700 bg-stone-950/80 px-4 py-2.5 text-sm font-medium text-stone-400 transition hover:border-amber-500/30 hover:text-amber-200/80 disabled:opacity-40"
          >
            Clear clip
          </button>
        </div>
      ) : null}
    </aside>
  );
}
