import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: Props) {
  return (
    <div className="flex gap-4 rounded-xl border border-amber-500/15 bg-gradient-to-b from-neutral-900/70 to-black/40 p-4 shadow-lg ring-1 ring-amber-500/10">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300/90"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-stone-100">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-400">
          {description}
        </p>
      </div>
    </div>
  );
}
