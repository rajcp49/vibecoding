import type { ReactNode } from "react";

export type MetricAccent =
  | "amber"
  | "sky"
  | "emerald"
  | "rose"
  | "violet"
  | "cyan";

const ACCENT = {
  amber: {
    card: "border-amber-500/25 shadow-amber-950/30 ring-amber-500/10 hover:border-amber-400/40 hover:ring-amber-400/15",
    icon: "border-amber-500/25 bg-gradient-to-br from-amber-500/15 to-yellow-600/5 text-amber-400 shadow-inner shadow-amber-950/50",
    hero: "from-amber-100 via-yellow-100 to-amber-200",
  },
  sky: {
    card: "border-sky-500/25 shadow-sky-950/20 ring-sky-500/10 hover:border-sky-400/40 hover:ring-sky-400/15",
    icon: "border-sky-500/25 bg-gradient-to-br from-sky-500/15 to-cyan-600/5 text-sky-400 shadow-inner shadow-sky-950/50",
    hero: "from-sky-200 via-cyan-100 to-sky-200",
  },
  emerald: {
    card: "border-emerald-500/25 shadow-emerald-950/20 ring-emerald-500/10 hover:border-emerald-400/40 hover:ring-emerald-400/15",
    icon: "border-emerald-500/25 bg-gradient-to-br from-emerald-500/15 to-teal-600/5 text-emerald-400 shadow-inner shadow-emerald-950/50",
    hero: "from-emerald-200 via-teal-100 to-emerald-200",
  },
  rose: {
    card: "border-rose-500/25 shadow-rose-950/20 ring-rose-500/10 hover:border-rose-400/40 hover:ring-rose-400/15",
    icon: "border-rose-500/25 bg-gradient-to-br from-rose-500/15 to-orange-600/5 text-rose-400 shadow-inner shadow-rose-950/50",
    hero: "from-rose-200 via-orange-100 to-amber-100",
  },
  violet: {
    card: "border-violet-500/25 shadow-violet-950/20 ring-violet-500/10 hover:border-violet-400/40 hover:ring-violet-400/15",
    icon: "border-violet-500/25 bg-gradient-to-br from-violet-500/15 to-fuchsia-600/5 text-violet-400 shadow-inner shadow-violet-950/50",
    hero: "from-violet-200 via-fuchsia-100 to-violet-200",
  },
  cyan: {
    card: "border-cyan-500/25 shadow-cyan-950/20 ring-cyan-500/10 hover:border-cyan-400/40 hover:ring-cyan-400/15",
    icon: "border-cyan-500/25 bg-gradient-to-br from-cyan-500/15 to-blue-600/5 text-cyan-400 shadow-inner shadow-cyan-950/50",
    hero: "from-cyan-200 via-blue-100 to-cyan-200",
  },
} as const;

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  value: ReactNode;
  valueVariant?: "hero" | "rich";
  children?: ReactNode;
  accent?: MetricAccent;
};

export function DashboardMetricCard({
  icon,
  title,
  description,
  value,
  valueVariant = "hero",
  children,
  accent = "amber",
}: Props) {
  const a = ACCENT[accent];

  return (
    <div
      className={`group flex flex-col rounded-2xl border bg-gradient-to-b from-neutral-900/90 to-black/90 p-6 shadow-xl shadow-black/50 ring-1 transition ${a.card}`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border [&>svg]:h-6 [&>svg]:w-6 ${a.icon}`}
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold tracking-tight text-stone-100">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5 border-t border-white/5 pt-5">
        <div
          className={
            valueVariant === "hero"
              ? `bg-gradient-to-br ${a.hero} bg-clip-text text-3xl font-bold tabular-nums tracking-tight text-transparent`
              : "min-h-[2.5rem] text-stone-100"
          }
        >
          {value}
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}
