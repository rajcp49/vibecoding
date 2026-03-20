import type { ReactNode } from "react";

export default function CallDetailLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#050505]">{children}</div>
  );
}
