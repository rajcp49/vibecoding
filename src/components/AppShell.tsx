"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { CallAnalyticsDashboard } from "@/components/dashboard/CallAnalyticsDashboard";
import { RecordingLoader } from "@/components/RecordingLoader";
import { AudioCaptureProvider, useAudioCapture } from "@/contexts/audio-capture-context";

function LegacyTabCleanup() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const raw = searchParams.get("tab");
    if (raw !== "recordings" && raw !== "transcribe") return;
    const q = new URLSearchParams(searchParams.toString());
    q.delete("tab");
    const s = q.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}

function MainTopBar() {
  const { triggerUpload, isBusy } = useAudioCapture();

  return (
    <div className="flex flex-col gap-3 border-b border-amber-500/15 bg-gradient-to-r from-black/70 via-neutral-950/80 to-black/70 px-4 py-3 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span className="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200/90">
          Home
        </span>
        <p className="text-xs text-stone-400">
          Upload adds files ·{" "}
          <a
            href="#your-calls"
            className="font-medium text-cyan-400/90 underline-offset-2 hover:underline"
          >
            Your calls
          </a>{" "}
          lists everything · open a call to transcribe
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300/90 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Library
        </span>
        <span className="hidden items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-300/90 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Metrics
        </span>
        <button
          type="button"
          onClick={triggerUpload}
          disabled={isBusy}
          className="shrink-0 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg shadow-amber-500/25 transition hover:from-amber-400 hover:to-yellow-500 hover:shadow-amber-400/30 disabled:opacity-40"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

function AppShellInner() {
  return (
    <>
      <RecordingLoader />
      <LegacyTabCleanup />
      <div className="flex min-h-0 w-full flex-1 flex-col bg-neutral-950 md:min-h-screen md:flex-row">
        <AppSidebar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <MainTopBar />
          <div className="pb-16 pt-4 md:pt-6">
            <div role="main" id="panel-dashboard">
              <CallAnalyticsDashboard />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export function AppShell() {
  return (
    <AudioCaptureProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-1 items-center justify-center bg-neutral-950 text-sm text-amber-200/60">
            Loading…
          </div>
        }
      >
        <AppShellInner />
      </Suspense>
    </AudioCaptureProvider>
  );
}
