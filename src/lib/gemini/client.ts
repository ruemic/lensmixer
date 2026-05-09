import { GoogleGenAI } from "@google/genai";

export const defaultModel = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

let cachedClient: GoogleGenAI | null = null;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local before running map or reduce."
    );
  }

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

export type StreamGenerateInput = {
  prompt: string;
  model?: string;
  signal?: AbortSignal;
};

export type StreamChunk = {
  text: string;
};

export class StreamGenerateError extends Error {
  readonly kind: "safety" | "rate_limit" | "network" | "unknown";
  readonly detail?: string;

  constructor(message: string, kind: StreamGenerateError["kind"], detail?: string) {
    super(message);
    this.name = "StreamGenerateError";
    this.kind = kind;
    this.detail = detail;
  }
}

const acceptableFinishReasons = new Set(["STOP", "MAX_TOKENS"]);

export async function* streamGenerate({
  prompt,
  model,
  signal
}: StreamGenerateInput): AsyncGenerator<StreamChunk> {
  const client = getClient();
  const response = await client.models.generateContentStream({
    model: model ?? defaultModel,
    contents: prompt
  });

  let yielded = false;

  for await (const chunk of response) {
    if (signal?.aborted) {
      return;
    }

    const promptBlock = chunk.promptFeedback?.blockReason;

    if (promptBlock) {
      throw new StreamGenerateError(
        "Gemini declined the prompt for safety reasons.",
        "safety",
        String(promptBlock)
      );
    }

    const candidate = chunk.candidates?.[0];
    const finishReason = candidate?.finishReason;

    if (finishReason && !acceptableFinishReasons.has(String(finishReason))) {
      const reason = String(finishReason);
      const isSafety = reason === "SAFETY" || reason === "PROHIBITED_CONTENT" || reason === "BLOCKLIST";
      throw new StreamGenerateError(
        isSafety
          ? "Gemini cut off this response for safety reasons."
          : `Gemini stopped early: ${reason}.`,
        isSafety ? "safety" : "unknown",
        reason
      );
    }

    const text = chunk.text;

    if (typeof text === "string" && text.length > 0) {
      yielded = true;
      yield { text };
    }
  }

  if (!yielded) {
    throw new StreamGenerateError(
      "Gemini returned an empty response.",
      "safety",
      "EMPTY_RESPONSE"
    );
  }
}
