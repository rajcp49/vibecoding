import { NextResponse } from "next/server";

export const maxDuration = 120;

const MAX_BYTES = 25 * 1024 * 1024; // Whisper API limit
const OPENAI_URL = "https://api.openai.com/v1/audio/transcriptions";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "Server missing OPENAI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid or oversized upload." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Provide a non-empty audio file in the “file” field." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_BYTES / (1024 * 1024)} MB.` },
      { status: 400 },
    );
  }

  const outbound = new FormData();
  outbound.append("file", file, file.name || "audio.webm");
  outbound.append("model", "whisper-1");

  const openaiRes = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: outbound,
  });

  const raw = await openaiRes.text();
  if (!openaiRes.ok) {
    let message = raw || openaiRes.statusText;
    try {
      const j = JSON.parse(raw) as { error?: { message?: string } };
      if (j.error?.message) message = j.error.message;
    } catch {
      /* use raw */
    }
    return NextResponse.json(
      { error: message },
      { status: openaiRes.status >= 400 && openaiRes.status < 600 ? openaiRes.status : 502 },
    );
  }

  try {
    const data = JSON.parse(raw) as { text?: string };
    const text = typeof data.text === "string" ? data.text : "";
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "Unexpected response from transcription service." },
      { status: 502 },
    );
  }
}
