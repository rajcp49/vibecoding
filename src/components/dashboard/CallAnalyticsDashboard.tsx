"use client";

import type { CallAnalyticsOverview } from "@/types/call-analytics";
import { formatDurationSeconds } from "@/lib/format-duration";
import { DashboardGettingStarted } from "./DashboardGettingStarted";
import { DashboardMetricCard } from "./DashboardMetricCard";
import { SavedRecordingsPanel } from "./SavedRecordingsPanel";
import { useDashboardOverview } from "./use-dashboard-overview";

const ICON = "h-6 w-6";

export function CallAnalyticsDashboard() {
  const data = useDashboardOverview();
  return <CallAnalyticsDashboardView data={data} />;
}

function IconPhone() {
  return (
    <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function IconSmile() {
  return (
    <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className={ICON} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconTimer() {
  return (
    <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function IconKey() {
  return (
    <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zm-6 0a6 6 0 00-12 0v11a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4"
      />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function SectionLabel({
  kicker,
  title,
  subtitle,
  className = "",
}: {
  kicker: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400/90">
        {kicker}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-stone-100">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function CallAnalyticsDashboardView({ data }: { data: CallAnalyticsOverview }) {
  const hasAnalyzed = data.totalCallsProcessed > 0;
  const s = data.sentiment;
  const sentimentTotal = s.positive + s.negative + s.neutral;
  const topKeywordsDisplay =
    data.topKeywords.length > 0 ? (
      <ul className="space-y-2 text-sm">
        {data.topKeywords.slice(0, 8).map((k) => (
          <li
            key={k.term}
            className="flex justify-between gap-2 rounded-lg border border-sky-500/15 bg-sky-500/5 px-2.5 py-1.5"
          >
            <span className="truncate font-medium text-sky-200">{k.term}</span>
            <span className="shrink-0 tabular-nums font-semibold text-sky-400/90">
              {k.mentions}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-stone-600">—</span>
    );

  const sentimentValue =
    sentimentTotal > 0 ? (
      <div className="space-y-2 text-sm font-medium">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <span className="text-emerald-200/90">Positive</span>
          <span className="tabular-nums text-lg font-bold text-emerald-300">
            {s.positive}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
          <span className="text-amber-200/90">Neutral</span>
          <span className="tabular-nums text-lg font-bold text-amber-300">
            {s.neutral}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2">
          <span className="text-rose-200/90">Negative</span>
          <span className="tabular-nums text-lg font-bold text-rose-300">
            {s.negative}
          </span>
        </div>
      </div>
    ) : (
      <span className="text-stone-600">—</span>
    );

  const actionTotal = data.totalActionItems + data.totalFollowUps;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-200/90">
          Overview
        </div>
        <h1 className="mt-4 bg-gradient-to-r from-amber-100 via-yellow-200 to-orange-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
          Main Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-400">
          Color-coded numbers and quick summaries—see library health, tone, and
          workload at a glance.
        </p>
      </header>

      <DashboardGettingStarted />

      <SectionLabel
        className="mt-10"
        kicker="Metrics"
        title="Library & quality"
        subtitle="Most numbers here are from analyzed calls only. Open any clip under “Your calls” to transcribe and refresh stats."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DashboardMetricCard
          accent="amber"
          icon={<IconPhone />}
          title="Total Calls Processed"
          description="Running count of all recordings analyzed by the system."
          value={data.totalCallsProcessed.toLocaleString()}
        >
          <p className="text-xs leading-relaxed text-stone-500">
            Saved files live in{" "}
            <a
              href="#your-calls"
              className="font-semibold text-cyan-400/90 underline underline-offset-2 hover:text-cyan-300"
            >
              Your calls
            </a>{" "}
            below—open one to transcribe, analyze, and view the full detail page.
          </p>
        </DashboardMetricCard>

        <DashboardMetricCard
          accent="rose"
          icon={<IconSmile />}
          title="Sentiment Split"
          description="Breakdown of positive vs. negative vs. neutral calls across all recordings."
          value={sentimentValue}
          valueVariant="rich"
        />

        <DashboardMetricCard
          accent="violet"
          icon={<IconStar />}
          title="Average Call Score"
          description="Mean quality score across all processed calls, scored 0–10."
          value={
            hasAnalyzed ? `${data.averageQualityScore.toFixed(1)} / 10` : "—"
          }
        />

        <DashboardMetricCard
          accent="cyan"
          icon={<IconTimer />}
          title="Avg. Call Duration"
          description="Average length of calls to benchmark engagement time."
          value={
            hasAnalyzed
              ? formatDurationSeconds(data.averageDurationSeconds)
              : "—"
          }
        />

        <DashboardMetricCard
          accent="sky"
          icon={<IconKey />}
          title="Top Keywords"
          description="Most frequently discussed topics across the entire call library."
          value={topKeywordsDisplay}
          valueVariant="rich"
        />

        <DashboardMetricCard
          accent="emerald"
          icon={<IconCheck />}
          title="Action Items Total"
          description="Aggregate count of follow-up tasks and commitments identified across all calls."
          value={actionTotal.toLocaleString()}
        />
      </div>

      <SectionLabel
        className="mt-14"
        kicker="Library"
        title="Your calls"
        subtitle="Play audio, open the full detail page, or remove a clip from this device."
      />
      <SavedRecordingsPanel variant="page" />
    </div>
  );
}
