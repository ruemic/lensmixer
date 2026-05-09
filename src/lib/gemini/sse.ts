export type FrameErrorKind = "safety" | "rate_limit" | "network" | "unknown";

export type ExpandFrame =
  | {
      type: "start";
      opId: string;
      parentCardId: string;
      directive: string;
      lenses: Array<{ index: number; id: string; name: string; childCardId: string }>;
      model: string;
    }
  | { type: "lens_start"; lensIndex: number }
  | { type: "delta"; lensIndex: number; text: string }
  | { type: "lens_done"; lensIndex: number; text: string }
  | {
      type: "lens_error";
      lensIndex: number;
      message: string;
      kind: FrameErrorKind;
      detail?: string;
    }
  | { type: "complete" }
  | {
      type: "error";
      message: string;
      kind: FrameErrorKind;
      detail?: string;
    };

export type ReduceFrame =
  | {
      type: "start";
      opId: string;
      cardId: string;
      sourceCardIds: string[];
      directive: string;
      model: string;
    }
  | { type: "delta"; text: string }
  | { type: "done"; text: string }
  | {
      type: "error";
      message: string;
      kind: FrameErrorKind;
      detail?: string;
    };

export function encodeSSEFrame(frame: unknown) {
  return new TextEncoder().encode(`data: ${JSON.stringify(frame)}\n\n`);
}

export function newId(prefix: string) {
  return `${prefix}_${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

export async function* parseSSEFrames<T>(response: Response): AsyncGenerator<T> {
  if (!response.body) {
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      buffer += decoder.decode(value, { stream: true });

      let separatorIndex = buffer.indexOf("\n\n");

      while (separatorIndex !== -1) {
        const event = buffer.slice(0, separatorIndex);
        buffer = buffer.slice(separatorIndex + 2);
        const dataLine = event.split("\n").find((line) => line.startsWith("data:"));

        if (dataLine) {
          const payload = dataLine.replace(/^data:\s?/, "");

          try {
            yield JSON.parse(payload) as T;
          } catch {
            // skip malformed frame
          }
        }

        separatorIndex = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}
