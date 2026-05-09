import { EventSchemas, EventType } from "@ag-ui/core";

const threadId = "macro-mixer";

export function aguiCustomEvent(name: string, value: Record<string, unknown>) {
  return EventSchemas.parse({
    type: EventType.CUSTOM,
    name,
    value,
    timestamp: Date.now()
  });
}

export function aguiStateSnapshot(snapshot: unknown) {
  return EventSchemas.parse({
    type: EventType.STATE_SNAPSHOT,
    snapshot,
    timestamp: Date.now()
  });
}

export function aguiStateDelta(delta: unknown[]) {
  return EventSchemas.parse({
    type: EventType.STATE_DELTA,
    delta,
    timestamp: Date.now()
  });
}

export function aguiRunStarted(opId: string) {
  return EventSchemas.parse({
    type: EventType.RUN_STARTED,
    threadId,
    runId: opId,
    timestamp: Date.now()
  });
}

export function aguiRunFinished(opId: string, result: Record<string, unknown> = {}) {
  return EventSchemas.parse({
    type: EventType.RUN_FINISHED,
    threadId,
    runId: opId,
    result,
    timestamp: Date.now()
  });
}

export function aguiRunError(message: string, code?: string) {
  return EventSchemas.parse({
    type: EventType.RUN_ERROR,
    message,
    code,
    timestamp: Date.now()
  });
}

type LaneTextEventInput = {
  opId: string;
  laneId: string;
  kind: "lens_start" | "delta" | "lens_done" | "reduce_start" | "reduce_done";
  text?: string;
  name?: string;
};

export function aguiLaneTextEvent({ opId, laneId, kind, text, name }: LaneTextEventInput) {
  const messageId = `${opId}:${laneId}`;
  const timestamp = Date.now();

  if (kind === "lens_start" || kind === "reduce_start") {
    return EventSchemas.parse({
      type: EventType.TEXT_MESSAGE_START,
      messageId,
      role: "assistant",
      name: name ?? laneId,
      timestamp
    });
  }

  if (kind === "lens_done" || kind === "reduce_done") {
    return EventSchemas.parse({
      type: EventType.TEXT_MESSAGE_END,
      messageId,
      timestamp
    });
  }

  return EventSchemas.parse({
    type: EventType.TEXT_MESSAGE_CONTENT,
    messageId,
    delta: text ?? "",
    timestamp
  });
}
