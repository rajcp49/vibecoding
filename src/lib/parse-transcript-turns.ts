export type TranscriptTurn = {
  /** Display label: Agent, Customer, or Speaker */
  speaker: string;
  text: string;
};

const SPEAKER_LINE =
  /^\s*(agent|representative|rep\.?|sales|support|staff|host)\s*[:：]\s*(.*)$/i;
const CUSTOMER_LINE =
  /^\s*(customer|caller|client|user|buyer|guest)\s*[:：]\s*(.*)$/i;

/**
 * Split a plain transcript into turns for side-by-side playback.
 * Handles common "Agent:" / "Customer:" prefixes; otherwise returns one block.
 */
export function parseTranscriptTurns(transcript: string): TranscriptTurn[] {
  const t = transcript.trim();
  if (!t) return [];

  const lines = t.split(/\r?\n/);
  const turns: TranscriptTurn[] = [];
  let current: TranscriptTurn | null = null;

  const flush = () => {
    if (current && current.text.trim()) {
      turns.push({
        speaker: current.speaker,
        text: current.text.trim(),
      });
    }
    current = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let m = trimmed.match(SPEAKER_LINE);
    if (m) {
      flush();
      current = { speaker: "Agent", text: m[2] ?? "" };
      continue;
    }
    m = trimmed.match(CUSTOMER_LINE);
    if (m) {
      flush();
      current = { speaker: "Customer", text: m[2] ?? "" };
      continue;
    }

    if (current) {
      current.text += (current.text ? "\n" : "") + trimmed;
    } else {
      current = { speaker: "Transcript", text: trimmed };
    }
  }
  flush();

  if (turns.length > 0) return turns;
  return [{ speaker: "Transcript", text: t }];
}
