// Lane id helper used by the AG-UI text-message events emitted from the
// streaming SSE handler. Kept as its own module so the AG-UI surface can grow
// without touching the controller.

export const reduceLaneId = "reduce";

export function laneIdForLens(lensIndex: number) {
  return `lens_${lensIndex}`;
}
