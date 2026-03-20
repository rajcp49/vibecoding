import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Call analytics, transcription, and saved recordings",
};

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppShell />
    </div>
  );
}
