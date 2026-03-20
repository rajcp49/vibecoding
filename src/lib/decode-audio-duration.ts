/** Decode blob duration in seconds (browser). */
export async function decodeAudioDurationSeconds(
  blob: Blob,
): Promise<number | undefined> {
  if (typeof window === "undefined" || !blob.size) return undefined;
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const Ctor =
      window.AudioContext ||
      (
        window as unknown as {
          webkitAudioContext: typeof AudioContext;
        }
      ).webkitAudioContext;
    if (!Ctor) return undefined;
    const ctx = new Ctor();
    const buf = await ctx.decodeAudioData(arrayBuffer.slice(0));
    await ctx.close();
    const d = buf.duration;
    return Number.isFinite(d) && d > 0 ? d : undefined;
  } catch {
    return undefined;
  }
}
