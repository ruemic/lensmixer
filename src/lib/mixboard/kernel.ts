export type CardKind = "seed" | "lens" | "synthesis";
export type CardStatus = "queued" | "streaming" | "complete" | "failed";

export type CardErrorKind = "safety" | "rate_limit" | "network" | "unknown";

export type CardError = {
  kind: CardErrorKind;
  message: string;
  detail?: string;
};

export type Card = {
  id: string;
  kind: CardKind;
  title: string;
  text: string;
  parentIds: string[];
  directive?: string;
  lensId?: string;
  lensName?: string;
  provider?: string;
  model?: string;
  status: CardStatus;
  opId?: string;
  collapsedIntoId?: string;
  createdAt: string;
  error?: CardError;
};

export const seedCardId = "card_seed";

export function compactText(text: string, max = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > max ? `${normalized.slice(0, max - 3)}...` : normalized;
}

export function createSeedCard(question: string, createdAt: string): Card {
  return {
    id: seedCardId,
    kind: "seed",
    title: "Starting question",
    text: question,
    parentIds: [],
    status: "complete",
    createdAt
  };
}
