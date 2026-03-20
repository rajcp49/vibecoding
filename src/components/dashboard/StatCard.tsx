type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-brand/12 bg-white p-6 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/12 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <p className="text-sm font-medium text-ink/55">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-ink/50">{hint}</p>
      ) : null}
    </div>
  );
}
