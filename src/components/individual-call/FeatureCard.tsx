import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: Props) {
  return (
    <div className="surface-rich flex gap-4 rounded-xl border border-brand/12 p-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink/65">
          {description}
        </p>
      </div>
    </div>
  );
}
