export type Lens = {
  id: string;
  name: string;
  instruction: string;
};

export const defaultLenses: Lens[] = [
  {
    id: "base",
    name: "Base case",
    instruction:
      "Argue the most plausible base-case reading. State the strongest concrete claim and the assumption it depends on."
  },
  {
    id: "dissent",
    name: "Dissent",
    instruction:
      "Argue the strongest case against the base-case reading. Surface contradictions, missing evidence, and second-order effects most people miss."
  },
  {
    id: "wildcards",
    name: "Wildcards",
    instruction:
      "Surface low-probability, high-impact paths that would invalidate any tidy conclusion. Be concrete about the trigger and the dominant downstream effect."
  }
];

export function selectLenses(count: number): Lens[] {
  if (count <= 0) {
    return [];
  }

  if (count <= defaultLenses.length) {
    return defaultLenses.slice(0, count);
  }

  const result: Lens[] = [...defaultLenses];

  for (let i = defaultLenses.length; i < count; i += 1) {
    result.push({
      id: `extra_${i}`,
      name: `Lens ${i + 1}`,
      instruction:
        "Take an angle the prior lenses did not cover. Be concrete and stay in the operator's domain."
    });
  }

  return result;
}

const rollupOutputRules = `# Output rules — follow EXACTLY

The output has TWO sections separated by a "---" line.

## Section 1 — Roll-up (legible at a glance)
- Line 1: ONE SENTENCE HEADLINE — 5 to 9 words, declarative, news-wire voice. No quotes, no markdown, no prefix label, no period at the end.
- Line 2: blank line.
- Lines 3+: exactly 2 to 3 bullet points starting with "- " (hyphen + space). Each bullet is one short sentence, under 18 words, no markdown, no nested bullets.

## Separator
After the last bullet: blank line, then "---" on its own line, then blank line.

## Section 2 — Supporting body (depth on demand, rendered as Markdown)
- A full report-style explanation: 4 to 6 paragraphs of substantive reasoning, plus optional sub-lists or pull quotes where natural.
- Markdown is welcome and encouraged: **bold** for the key claims, *italic* for emphasis, \`inline code\` for proper nouns or specific terms, "- " bullets if a list helps, and "> quote" for caveats or counterpoints.
- Be concrete. Name specific mechanisms, numbers, dates, or examples. Avoid hedging language.
- No level-1 or level-2 markdown headers (no "#" or "##"). Level-3 sub-headings ("###") are allowed sparingly to break up sections.
- Do not restate the headline or bullets verbatim — go deeper.

## Global rules
- Do not include preambles, conclusions, or meta-commentary.
- Do not use the words "headline", "summary", "tldr", "key points", or "bullets" anywhere in the output.
- Stay within the lens you were given.`;

type ExpandPromptInput = {
  parentText: string;
  directive: string;
  lens: Lens;
};

export function composeLensPrompt({ parentText, directive, lens }: ExpandPromptInput) {
  const directiveBlock = directive.trim()
    ? `# Operator directive\n${directive.trim()}\n\n`
    : "";

  return `${directiveBlock}# Lens: ${lens.name}
${lens.instruction}

# Parent context
${parentText.trim()}

${rollupOutputRules}
`;
}

type ReducePromptInput = {
  cards: Array<{ title: string; lensName?: string; text: string }>;
  directive: string;
};

export function composeReducePrompt({ cards, directive }: ReducePromptInput) {
  const directiveBlock = directive.trim()
    ? `# Operator directive\n${directive.trim()}\n\n`
    : "";
  const cardBlocks = cards
    .map((card, index) => {
      const heading = card.lensName ? `${card.title} (${card.lensName})` : card.title;
      return `## Source ${index + 1}: ${heading}\n${card.text.trim()}`;
    })
    .join("\n\n");

  return `${directiveBlock}# Task
Integrate the following sources into one synthesis with a headline, bullets, and supporting body.
- Reconcile contradictions; do not flatten dissent into false consensus.
- Do not list which source said what. No provenance notes.
- Headline must be a single sentence that holds the integrated claim across all sources.

# Sources
${cardBlocks}

${rollupOutputRules}
- For the synthesis, use 3 to 4 bullets instead of 2 to 3, and 4 paragraphs of supporting body instead of 3.
`;
}
