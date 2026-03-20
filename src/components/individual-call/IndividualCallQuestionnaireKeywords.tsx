"use client";

import Link from "next/link";
import type { ExtractedKeyword, QuestionnaireItem } from "@/types/conversation-analysis";

type Props = {
  hasAnalysis: boolean;
  questionnaireItems: QuestionnaireItem[];
  topKeywords: ExtractedKeyword[];
};

function hashPick(s: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h % modulo;
}

const ICON_CLASS = "h-5 w-5 shrink-0 text-brand";

function KeywordGlyph({ term }: { term: string }) {
  const i = hashPick(term, 6);
  const stroke = { strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (i) {
    case 0:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      );
    case 1:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M4 7h16M4 12h10M4 17h16" />
        </svg>
      );
    case 2:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 3:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case 4:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      );
    default:
      return (
        <svg className={ICON_CLASS} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden {...stroke}>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export function IndividualCallQuestionnaireKeywords({
  hasAnalysis,
  questionnaireItems,
  topKeywords,
}: Props) {
  if (!hasAnalysis) {
    return (
      <section
        className="surface-rich mb-10 rounded-2xl border border-brand/12 p-6 sm:p-8"
        aria-labelledby="qk-empty-heading"
      >
        <h2 id="qk-empty-heading" className="text-lg font-semibold text-ink">
          Questionnaire &amp; keywords
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">
          Run{" "}
          <span className="font-medium text-brand">Analyze insights</span> from
          the{" "}
          <Link href="/" className="font-medium text-brand underline-offset-2 hover:underline">
            dashboard
          </Link>{" "}
          for this recording to see discovery coverage and top themes.
        </p>
      </section>
    );
  }

  const hasQuestionnaire = questionnaireItems.length > 0;
  const hasKeywords = topKeywords.length > 0;

  return (
    <section
      className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start"
      aria-label="Questionnaire and keyword analysis"
    >
      <div className="surface-rich min-h-[12rem] rounded-2xl border border-brand/12 p-6 shadow-[0_16px_48px_-28px_rgba(42,36,32,0.1)] sm:p-7">
        <h2
          id="questionnaire-heading"
          className="text-lg font-semibold leading-tight text-ink"
        >
          Business questionnaire coverage
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Discovery topics inferred for this call and whether each was
          meaningfully addressed in the transcript.
        </p>
        {!hasQuestionnaire ? (
          <p className="mt-6 text-sm text-ink/50">
            No questionnaire rows in this analysis. Re-run{" "}
            <span className="font-medium text-brand">Analyze insights</span> to
            refresh.
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-brand/12">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand/15 bg-paper">
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-ink"
                  >
                    Question topic
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 font-semibold text-ink"
                  >
                    Asked?
                  </th>
                </tr>
              </thead>
              <tbody>
                {questionnaireItems.map((row, i) => (
                  <tr
                    key={`${row.topic}-${i}`}
                    className={`border-b border-brand/8 last:border-b-0 ${
                      i % 2 === 0 ? "bg-white" : "bg-paper/90"
                    }`}
                  >
                    <td className="px-4 py-3 text-ink/90">{row.topic}</td>
                    <td className="px-4 py-3">
                      {row.asked ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink/45">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="surface-rich min-h-[12rem] rounded-2xl border border-brand/12 p-6 shadow-[0_16px_48px_-28px_rgba(42,36,32,0.1)] sm:p-7">
        <h2
          id="keywords-heading"
          className="text-lg font-semibold leading-tight text-ink"
        >
          Top keywords discussed
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Recurring themes from this transcript—useful for focus and coaching.
        </p>
        {!hasKeywords ? (
          <p className="mt-6 text-sm text-ink/50">
            No keywords extracted. Re-run{" "}
            <span className="font-medium text-brand">Analyze insights</span>.
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topKeywords.map((k) => (
              <li key={k.term}>
                <div className="flex items-center gap-3 rounded-xl border border-brand/15 bg-gradient-to-b from-white to-paper/80 px-4 py-3.5 shadow-[0_4px_20px_-12px_rgba(42,36,32,0.12)] ring-1 ring-brand/8 transition hover:ring-brand/20">
                  <KeywordGlyph term={k.term} />
                  <span className="min-w-0 font-medium leading-snug text-ink">
                    {k.term}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
