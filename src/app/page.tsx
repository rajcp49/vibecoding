import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { CallAnalyticsDashboard } from "@/components/dashboard/CallAnalyticsDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Call analytics, transcription, and saved recordings",
};

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppShell>
        <CallAnalyticsDashboard />
      </AppShell>
    </div>
  );
}
