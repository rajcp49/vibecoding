export const TAB_IDS = ["dashboard"] as const;

export type AppTabId = (typeof TAB_IDS)[number];

export function parseTabParam(value: string | undefined): AppTabId {
  if (value === "transcribe" || value === "recordings") return "dashboard";
  if (value && TAB_IDS.includes(value as AppTabId)) {
    return value as AppTabId;
  }
  return "dashboard";
}
