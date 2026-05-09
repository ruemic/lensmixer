import { defaultModel, StreamGenerateError, streamGenerate } from "@/lib/gemini/client";
import { composeReducePrompt } from "@/lib/gemini/lenses";
import {
  encodeSSEFrame,
  newId,
  type FrameErrorKind,
  type ReduceFrame
} from "@/lib/gemini/sse";

export const runtime = "nodejs";

type ReduceRequest = {
  cards?: Array<{ id: string; title: string; lensName?: string; text: string }>;
  directive?: string;
  cardId?: string;
};

type CategorizedError = {
  message: string;
  kind: FrameErrorKind;
  detail?: string;
};

function categorize(error: unknown): CategorizedError {
  if (error instanceof StreamGenerateError) {
    return { message: error.message, kind: error.kind, detail: error.detail };
  }

  if (error instanceof Error) {
    const lower = error.message.toLowerCase();

    if (lower.includes("safety") || lower.includes("blocked") || lower.includes("prohibited")) {
      return {
        message: "Gemini declined the synthesis for safety reasons.",
        kind: "safety",
        detail: error.message
      };
    }

    if (lower.includes("rate") || lower.includes("quota") || lower.includes("429")) {
      return {
        message: "Gemini rate limit hit. Try again in a moment.",
        kind: "rate_limit",
        detail: error.message
      };
    }

    if (lower.includes("fetch") || lower.includes("network") || lower.includes("econn")) {
      return { message: "Network error talking to Gemini.", kind: "network", detail: error.message };
    }

    return { message: error.message, kind: "unknown" };
  }

  return { message: "Reduce failed.", kind: "unknown" };
}

export async function POST(request: Request) {
  let body: ReduceRequest;

  try {
    body = (await request.json()) as ReduceRequest;
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const cards = (body.cards ?? []).filter((card) => card.text?.trim().length);

  if (cards.length === 0) {
    return Response.json({ error: "cards must contain at least one entry with text" }, { status: 400 });
  }

  const directive = body.directive?.trim() ?? "";
  const opId = newId("op_reduce");
  const cardId = body.cardId?.trim() || newId("card_reduced");
  const sourceCardIds = cards.map((card) => card.id);

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (frame: ReduceFrame) => {
        if (closed) {
          return;
        }

        try {
          controller.enqueue(encodeSSEFrame(frame));
        } catch {
          closed = true;
        }
      };

      const closeController = () => {
        if (closed) {
          return;
        }

        closed = true;

        try {
          controller.close();
        } catch {
          // Already closed.
        }
      };

      send({
        type: "start",
        opId,
        cardId,
        sourceCardIds,
        directive,
        model: defaultModel
      });

      const abort = new AbortController();
      const cancelHandler = () => {
        abort.abort();
        closed = true;
      };
      request.signal.addEventListener("abort", cancelHandler);

      const prompt = composeReducePrompt({ cards, directive });
      let collected = "";

      (async () => {
        try {
          for await (const chunk of streamGenerate({ prompt, signal: abort.signal })) {
            collected += chunk.text;
            send({ type: "delta", text: chunk.text });
          }

          send({ type: "done", text: collected });
        } catch (error) {
          const categorized = categorize(error);
          console.error("[reduce] failed:", categorized.detail ?? categorized.message);
          send({
            type: "error",
            message: categorized.message,
            kind: categorized.kind,
            detail: categorized.detail
          });
        } finally {
          request.signal.removeEventListener("abort", cancelHandler);
          closeController();
        }
      })();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
