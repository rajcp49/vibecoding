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
      <header className="border-b border-brand/15 bg-paper/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-brand transition hover:text-brand/85"
          >
            ← Dashboard
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink/60 underline-offset-2 transition hover:text-brand hover:underline"
          >
            Home
          </Link>
        </div>
      </header>
      <IndividualCallPageClient id={id} />
    </>
  );
}
