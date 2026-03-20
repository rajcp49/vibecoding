"use client";

import { useEffect, useRef, useState } from "react";
import {
  IndividualCallDashboard,
  type IndividualCallModel,
} from "@/components/individual-call/IndividualCallDashboard";
import { savedRecordingToIndividualCallModel } from "@/lib/individual-call-model";
import { getRecording } from "@/lib/recordings-db";

export function IndividualCallPageClient({ id }: { id: string }) {
  const [model, setModel] = useState<IndividualCallModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) {
        setError(null);
        setModel(null);
      }
    });
    void (async () => {
      const rec = await getRecording(id);
      if (cancelled) return;
      if (!rec) {
        setError("Recording not found in this browser.");
        return;
      }
      const next = URL.createObjectURL(rec.audio);
      if (cancelled) {
        URL.revokeObjectURL(next);
        return;
      }
      urlRef.current = next;
      setModel(savedRecordingToIndividualCallModel(rec, next));
    })();
    return () => {
      cancelled = true;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-brand">{error}</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-ink/50">
        Loading…
      </div>
    );
  }

  return <IndividualCallDashboard model={model} />;
}
