import { NextResponse } from "next/server";
import { ANALYZE_CALL_SYSTEM_PROMPT } from "@/lib/analyze-call-prompt";
import { parseConversationAnalysis } from "@/lib/parse-conversation-analysis";

export const maxDuration = 120;

const OPENAI_CHAT = "https://api.openai.com/v1/chat/completions";
const MAX_TRANSCRIPT_CHARS = 120_000;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "Server missing OPENAI_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const transcript =
    typeof body === "object" &&
    body !== null &&
    "transcript" in body &&
    typeof (body as { transcript: unknown }).transcript === "string"
      ? (body as { transcript: string }).transcript.trim()
      : "";

  if (!transcript) {
    return NextResponse.json(
      { error: "Provide a non-empty string \"transcript\"." },
      { status: 400 },
    );
  }

  const clipped =
    transcript.length > MAX_TRANSCRIPT_CHARS
      ? transcript.slice(0, MAX_TRANSCRIPT_CHARS)
      : transcript;

  const openaiRes = await fetch(OPENAI_CHAT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ANALYZE_CALL_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this call transcript:\n\n${clipped}`,
        },
      ],
    }),
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

  let content: string | undefined;
  try {
    const data = JSON.parse(raw) as {
      choices?: { message?: { content?: string } }[];
    };
    content = data.choices?.[0]?.message?.content?.trim();
  } catch {
    return NextResponse.json(
      { error: "Unexpected response from analysis service." },
      { status: 502 },
    );
  }

  if (!content) {
    return NextResponse.json(
      { error: "Empty analysis response." },
      { status: 502 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    return NextResponse.json(
      { error: "Analysis was not valid JSON." },
      { status: 502 },
    );
  }

  const analysis = parseConversationAnalysis(parsed);
  return NextResponse.json({ analysis });
}
