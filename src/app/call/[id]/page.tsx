import type { Metadata } from "next";
import Link from "next/link";
import { IndividualCallPageClient } from "@/components/individual-call/IndividualCallPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Call analysis",
    description: `Individual call dashboard for recording ${id.slice(0, 8)}…`,
  };
}

export default async function IndividualCallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <header className="border-b border-amber-500/15 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/?tab=recordings"
            className="text-sm font-semibold text-amber-300/90 transition hover:text-amber-200"
          >
            ← Recorded audio
          </Link>
          <Link
            href={`/?tab=dashboard&recordingId=${encodeURIComponent(id)}`}
            className="text-sm font-medium text-stone-400 underline-offset-2 transition hover:text-amber-200/80 hover:underline"
          >
            Open in Transcribe
          </Link>
        </div>
      </header>
      <IndividualCallPageClient id={id} />
    </>
  );
}
