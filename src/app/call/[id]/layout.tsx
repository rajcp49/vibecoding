import type { ReactNode } from "react";
import { CallDetailProviders } from "@/components/call/CallDetailProviders";

export default function CallDetailLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-paper">
      <CallDetailProviders>{children}</CallDetailProviders>
    </div>
  );
}
