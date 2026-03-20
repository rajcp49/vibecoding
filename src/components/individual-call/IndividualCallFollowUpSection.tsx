"use client";

import { useState } from "react";
import Link from "next/link";
import type { ActionItemExtracted } from "@/types/conversation-analysis";

type Props = {
  hasAnalysis: boolean;
  actionItems: ActionItemExtracted[];
  positiveObservations: string[];
  negativeObservations: string[];
};

function ArrowBullet() {
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand"
      aria-hidden
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.25}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </span>
  );
}

export function IndividualCallFollowUpSection({
  hasAnalysis,
  actionItems,
  positiveObservations,
  negativeObservations,
}: Props) {
  const [mobileTab, setMobileTab] = useState<"actions" | "observations">(
    "actions",
  );

  if (!hasAnalysis) {
    return (
      <section
        className="surface-rich mb-10 rounded-2xl border border-brand/12 p-6 sm:p-8"
        aria-labelledby="followup-heading"
      >
        <h2
          id="followup-heading"
          className="text-lg font-semibold text-ink"
        >
          Follow-up &amp; AI observations
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Run <span className="font-medium text-brand">Analyze insights</span>{" "}
          from the{" "}
          <Link href="/" className="font-medium text-brand underline-offset-2 hover:underline">
            dashboard
          </Link>{" "}
          (open this clip from{" "}
          <Link href="/#your-calls" className="font-medium text-brand underline-offset-2 hover:underline">
            Your calls
          </Link>
          ) to populate follow-up actions and qualitative notes from the
          transcript.
        </p>
      </section>
    );
  }

  const actionsPanel = (
    <div className="surface-rich flex min-h-[12rem] flex-col rounded-2xl border border-brand/12 p-6 sm:p-7">
      <h2 className="text-lg font-semibold text-ink">
        Follow-Up Action Items
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-ink/60">
        Commitments and next steps inferred from the call transcript.
      </p>
      {actionItems.length === 0 ? (
        <p className="mt-6 text-sm text-ink/50">
          No explicit follow-ups detected—review the transcript for next steps.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {actionItems.map((item) => (
            <li key={`${item.type}-${item.text.slice(0, 48)}`} className="flex gap-3">
              <ArrowBullet />
              <div className="min-w-0 pt-0.5">
                <p className="text-sm font-medium leading-snug text-ink">
                  {item.text}
                </p>
                {item.suggestedOwner ? (
                  <p className="mt-1 text-xs text-ink/45">
                    Suggested owner: {item.suggestedOwner}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const observationsPanel = (
    <div className="flex min-h-[12rem] flex-col rounded-2xl bg-ink p-6 text-paper shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] sm:p-7">
      <h2 className="text-lg font-semibold text-paper">
        AI-generated notes
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-paper/65">
        Qualitative takeaways from the analyzed transcript.
      </p>

      <div className="mt-6 space-y-8">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-paper">
            Positive observations
          </h3>
          {positiveObservations.length === 0 ? (
            <p className="mt-3 text-sm text-paper/50">
              None listed for this call.
            </p>
          ) : (
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-paper/90 marker:text-brand">
              {positiveObservations.map((line, i) => (
                <li key={`pos-${i}`} className="pl-1">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-paper/15 pt-8">
          <h3 className="text-sm font-semibold tracking-wide text-paper">
            Negative observations
          </h3>
          {negativeObservations.length === 0 ? (
            <p className="mt-3 text-sm text-paper/50">
              None listed for this call.
            </p>
          ) : (
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-paper/90 marker:text-brand">
              {negativeObservations.map((line, i) => (
                <li key={`neg-${i}`} className="pl-1">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="mb-10" aria-labelledby="followup-heading">
      <div className="mb-4 md:hidden">
        <h2 id="followup-heading" className="sr-only">
          Follow-up and observations
        </h2>
        <div
          className="flex rounded-xl border border-brand/15 bg-paper/80 p-1 shadow-inner"
          role="tablist"
          aria-label="Follow-up views"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "actions"}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              mobileTab === "actions"
                ? "bg-white text-brand shadow-sm ring-1 ring-brand/20"
                : "text-ink/60"
            }`}
            onClick={() => setMobileTab("actions")}
          >
            Action items
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "observations"}
            className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              mobileTab === "observations"
                ? "bg-ink text-paper shadow-sm"
                : "text-ink/60"
            }`}
            onClick={() => setMobileTab("observations")}
          >
            Observations
          </button>
        </div>
      </div>

      <h2
        id="followup-heading-desktop"
        className="mb-4 hidden text-lg font-semibold text-ink md:block"
      >
        Follow-up &amp; AI observations
      </h2>

      <div className="md:hidden">
        {mobileTab === "actions" ? (
          <div role="tabpanel">{actionsPanel}</div>
        ) : (
          <div role="tabpanel">{observationsPanel}</div>
        )}
      </div>

      <div className="hidden gap-6 md:grid md:grid-cols-2 md:items-start">
        {actionsPanel}
        {observationsPanel}
      </div>
    </section>
  );
}
