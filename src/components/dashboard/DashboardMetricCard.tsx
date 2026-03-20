import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  title: string;
  description: string;
  value: ReactNode;
  valueVariant?: "hero" | "rich";
  children?: ReactNode;
};

/** Metric tile — uses only brand / ink / paper from the global theme. */
export function DashboardMetricCard({
  icon,
  title,
  description,
  value,
  valueVariant = "hero",
  children,
}: Props) {
  return (
    <div className="group surface-rich flex flex-col rounded-2xl border border-brand/20 p-6 transition hover:border-brand/40 hover:shadow-[0_24px_60px_-20px_color-mix(in_srgb,var(--theme-brand)_22%,transparent)]">
      <div className="flex gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-brand/25 bg-gradient-to-br from-brand/15 to-brand/5 text-brand shadow-inner shadow-brand/10 [&>svg]:h-6 [&>svg]:w-6"
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold tracking-tight text-ink">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-5 border-t border-brand/10 pt-5">
        <div
          className={
            valueVariant === "hero"
              ? "bg-gradient-to-br from-brand via-brand/90 to-brand/75 bg-clip-text text-3xl font-bold tabular-nums tracking-tight text-transparent"
              : "min-h-[2.5rem] text-ink"
          }
        >
          {value}
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}
