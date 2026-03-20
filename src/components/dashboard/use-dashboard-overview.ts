"use client";

import { useCallback, useEffect, useState } from "react";
import { computeAggregatedOverview } from "@/lib/aggregate-dashboard";
import {
  RECORDINGS_CHANGED_EVENT,
  getAllRecordings,
} from "@/lib/recordings-db";
import type { CallAnalyticsOverview } from "@/types/call-analytics";

export function useDashboardOverview(): CallAnalyticsOverview {
  const [data, setData] = useState<CallAnalyticsOverview>(() =>
    computeAggregatedOverview([]),
  );

  const refresh = useCallback(async () => {
    try {
      const rows = await getAllRecordings();
      setData(computeAggregatedOverview(rows));
    } catch {
      setData(computeAggregatedOverview([]));
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void refresh());
  }, [refresh]);

  useEffect(() => {
    const onChange = () => void refresh();
    window.addEventListener(RECORDINGS_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(RECORDINGS_CHANGED_EVENT, onChange);
  }, [refresh]);

  return data;
}
