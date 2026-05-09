import { defaultModel, StreamGenerateError, streamGenerate } from "@/lib/gemini/client";
import { composeLensPrompt, selectLenses } from "@/lib/gemini/lenses";
import {
  encodeSSEFrame,
  newId,
  type ExpandFrame,
  type FrameErrorKind
} from "@/lib/gemini/sse";

export const runtime = "nodejs";

type ExpandRequest = {
  parentCardId?: string;
  parentText?: string;
  directive?: string;
  lensCount?: number;
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
      return { message: "Gemini declined this lens for safety reasons.", kind: "safety", detail: error.message };
    }

    if (lower.includes("rate") || lower.includes("quota") || lower.includes("429")) {
      return { message: "Gemini rate limit hit. Try again in a moment.", kind: "rate_limit", detail: error.message };
    }

    if (lower.includes("fetch") || lower.includes("network") || lower.includes("econn")) {
      return { message: "Network error talking to Gemini.", kind: "network", detail: error.message };
    }

    return { message: error.message, kind: "unknown" };
  }

  return { message: "Lens stream failed.", kind: "unknown" };
}

export async function POST(request: Request) {
  let body: ExpandRequest;

  try {
    body = (await request.json()) as ExpandRequest;
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const parentText = body.parentText?.trim();

  if (!parentText) {
    return Response.json({ error: "parentText is required" }, { status: 400 });
  }

  const parentCardId = body.parentCardId?.trim() || "card_seed";
  const directive = body.directive?.trim() ?? "";
  const lensCount = Math.min(Math.max(body.lensCount ?? 3, 1), 6);
  const lenses = selectLenses(lensCount);
  const opId = newId("op_expand");
  const lensDescriptors = lenses.map((lens, index) => ({
    index,
    id: lens.id,
    name: lens.name,
    childCardId: newId(`card_${lens.id}`)
  }));

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (frame: ExpandFrame) => {
        if (closed) {
          return;
        }

        try {
          controller.enqueue(encodeSSEFrame(frame));
        } catch {
          // Controller was closed by the framework (client disconnect).
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
        parentCardId,
        directive,
        lenses: lensDescriptors,
        model: defaultModel
      });

      const abort = new AbortController();
      const cancelHandler = () => {
        abort.abort();
        closed = true;
      };
      request.signal.addEventListener("abort", cancelHandler);

      const tasks = lenses.map(async (lens, lensIndex) => {
        send({ type: "lens_start", lensIndex });
        const prompt = composeLensPrompt({ parentText, directive, lens });
        let collected = "";

        try {
          for await (const chunk of streamGenerate({
            prompt,
            signal: abort.signal
          })) {
            collected += chunk.text;
            send({ type: "delta", lensIndex, text: chunk.text });
          }

          send({ type: "lens_done", lensIndex, text: collected });
        } catch (error) {
          const categorized = categorize(error);
          console.error(`[expand] lens ${lensIndex} (${lens.name}) failed:`, categorized.detail ?? categorized.message);
          send({
            type: "lens_error",
            lensIndex,
            message: categorized.message,
            kind: categorized.kind,
            detail: categorized.detail
          });
        }
      });

      Promise.allSettled(tasks)
        .then(() => {
          send({ type: "complete" });
          closeController();
        })
        .catch((error: unknown) => {
          const categorized = categorize(error);
          console.error("[expand] run failed:", categorized.detail ?? categorized.message);
          send({
            type: "error",
            message: categorized.message,
            kind: categorized.kind,
            detail: categorized.detail
          });
          closeController();
        })
        .finally(() => {
          request.signal.removeEventListener("abort", cancelHandler);
        });
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
