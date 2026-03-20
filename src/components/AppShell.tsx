"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { RecordingLoader } from "@/components/RecordingLoader";
import { UploadModal } from "@/components/UploadModal";
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
  const { openUploadModal, isBusy } = useAudioCapture();

  return (
    <div className="flex flex-col gap-3 border-b border-brand/20 bg-gradient-to-r from-white via-paper to-white px-4 py-3 shadow-[0_8px_32px_-20px_rgba(42,36,32,0.12)] md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
          Overview
        </span>
        <p className="text-xs text-ink/65">
          Upload runs transcribe + analysis · open a clip to transcribe and run
          insights ·{" "}
          <a
            href="#your-calls"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            Your calls
          </a>{" "}
          below
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-lg border border-brand/20 bg-brand/5 px-2.5 py-1 text-[10px] font-semibold text-ink/80 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Library
        </span>
        <span className="hidden items-center gap-1.5 rounded-lg border border-ink/10 bg-ink/5 px-2.5 py-1 text-[10px] font-semibold text-ink/75 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
          Metrics
        </span>
        <button
          type="button"
          onClick={openUploadModal}
          disabled={isBusy}
          className="shrink-0 rounded-lg bg-gradient-to-r from-brand via-brand/95 to-brand/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-paper shadow-[0_4px_20px_-4px_rgba(184,134,11,0.45)] transition hover:brightness-105 disabled:opacity-40"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

function AppShellInner({ children }: { children: ReactNode }) {
  return (
    <>
      <RecordingLoader />
      <LegacyTabCleanup />
      <UploadModal />
      <div className="flex min-h-0 w-full flex-1 flex-col bg-paper/90 md:min-h-screen md:flex-row">
        <AppSidebar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <MainTopBar />
          <div className="pb-16 pt-4 md:pt-6">
            <div role="main" id="panel-dashboard">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AudioCaptureProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen flex-1 items-center justify-center bg-paper text-sm text-brand">
            Loading…
          </div>
        }
      >
        <AppShellInner>{children}</AppShellInner>
      </Suspense>
    </AudioCaptureProvider>
  );
}
