type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: "default" | "violet" | "emerald" | "amber";
};

const accentRing: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "from-zinc-400/20 to-transparent",
  violet: "from-violet-500/25 to-transparent",
  emerald: "from-emerald-500/25 to-transparent",
  amber: "from-amber-500/25 to-transparent",
};

export function StatCard({ label, value, hint, accent = "default" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentRing[accent]} opacity-0 transition-opacity group-hover:opacity-100`}
        aria-hidden
      />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
