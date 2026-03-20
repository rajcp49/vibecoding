import type { SavedRecording } from "@/types/saved-recording";

const DB_NAME = "vibecoding-recordings";
const STORE = "recordings";
const VERSION = 1;

export const RECORDINGS_CHANGED_EVENT = "vibecoding-recordings-changed";

function notifyChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(RECORDINGS_CHANGED_EVENT));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
  });
}

export async function getRecording(id: string): Promise<SavedRecording | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).get(id);
    r.onsuccess = () => resolve(r.result as SavedRecording | undefined);
    r.onerror = () => reject(r.error ?? new Error("get failed"));
  });
}

export async function updateRecording(
  id: string,
  patch: Partial<Omit<SavedRecording, "id">>,
): Promise<void> {
  const existing = await getRecording(id);
  if (!existing) return;
  await saveRecording({ ...existing, ...patch, id });
}

export async function saveRecording(rec: SavedRecording): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("save failed"));
    tx.objectStore(STORE).put(rec);
  });
  notifyChanged();
}

export async function getAllRecordings(): Promise<SavedRecording[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const r = tx.objectStore(STORE).getAll();
    r.onsuccess = () => {
      const list = (r.result as SavedRecording[]).sort(
        (a, b) => b.createdAt - a.createdAt,
      );
      resolve(list);
    };
    r.onerror = () => reject(r.error ?? new Error("read failed"));
  });
}

export async function deleteRecording(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("delete failed"));
    tx.objectStore(STORE).delete(id);
  });
  notifyChanged();
}

export function countRecordings(): Promise<number> {
  return getAllRecordings().then((r) => r.length);
}
