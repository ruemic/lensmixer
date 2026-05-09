export type Rollup = {
  headline: string;
  bullets: string[];
  body: string;
  /** Non-bullet content sitting between bullets and the "---" separator, used as a fallback when the model skips bullets. */
  trailing: string;
};

const SEPARATOR_PATTERN = /^\s*[-_*]{3,}\s*$/;

function splitOnSeparator(text: string): { rollupPart: string; bodyPart: string } {
  const lines = text.split("\n");

  for (let i = 0; i < lines.length; i += 1) {
    if (SEPARATOR_PATTERN.test(lines[i])) {
      return {
        rollupPart: lines.slice(0, i).join("\n"),
        bodyPart: lines
          .slice(i + 1)
          .join("\n")
          .trim()
      };
    }
  }

  return { rollupPart: text, bodyPart: "" };
}

const PREAMBLE_PATTERN =
  /^\s*(headline|summary|tl;dr|tldr|key\s*points?|bullets?|takeaway|claim|lead)\s*[:\-—]\s*/i;
const MARKDOWN_HEADER_PATTERN = /^\s*#{1,6}\s+/;
const QUOTE_PATTERN = /^\s*["“”]([^"“”]+)["“”]\s*$/;

function stripHeadlinePrefix(line: string): string {
  let result = line.replace(MARKDOWN_HEADER_PATTERN, "").replace(PREAMBLE_PATTERN, "").trim();
  const quoted = result.match(QUOTE_PATTERN);

  if (quoted) {
    result = quoted[1].trim();
  }

  // Drop a trailing period for a cleaner news-headline feel; keep ! and ?.
  if (result.endsWith(".") && !result.endsWith("..") && !result.endsWith("...")) {
    result = result.slice(0, -1);
  }

  return result;
}

function splitHeadlineAndBody(text: string): { headline: string; body: string } {
  const trimmed = text.trim();

  if (!trimmed) {
    return { headline: "", body: "" };
  }

  const doubleBreak = trimmed.indexOf("\n\n");

  if (doubleBreak >= 0) {
    return {
      headline: trimmed.slice(0, doubleBreak).trim(),
      body: trimmed.slice(doubleBreak + 2).trim()
    };
  }

  const singleBreak = trimmed.indexOf("\n");

  // If a single newline appears within the first ~200 characters, treat
  // everything before it as the headline so partial streams render correctly.
  if (singleBreak > 0 && singleBreak <= 200) {
    return {
      headline: trimmed.slice(0, singleBreak).trim(),
      body: trimmed.slice(singleBreak + 1).trim()
    };
  }

  return { headline: trimmed, body: "" };
}

const BULLET_PATTERN = /^\s*(?:[-*•]|\d+[.)])\s+(.+?)\s*$/;

function parseBody(body: string): { bullets: string[]; trailing: string } {
  if (!body) {
    return { bullets: [], trailing: "" };
  }

  const lines = body.split(/\r?\n/);
  const bullets: string[] = [];
  const trailingParts: string[] = [];
  let inBullets = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const match = line.match(BULLET_PATTERN);

    if (match) {
      bullets.push(match[1]);
      inBullets = true;
      continue;
    }

    if (inBullets) {
      // Continuation of the previous bullet (a wrapped second line).
      bullets[bullets.length - 1] = `${bullets[bullets.length - 1]} ${line}`;
    } else {
      trailingParts.push(line);
    }
  }

  return {
    bullets,
    trailing: trailingParts.join(" ").trim()
  };
}

export function parseRollup(text: string): Rollup {
  const { rollupPart, bodyPart } = splitOnSeparator(text);
  const { headline: rawHeadline, body: bulletsSection } = splitHeadlineAndBody(rollupPart);
  const headline = stripHeadlinePrefix(rawHeadline);
  const { bullets, trailing } = parseBody(bulletsSection);

  return {
    headline,
    bullets,
    body: bodyPart,
    trailing
  };
}

export type RollupStreamLocation = "headline" | "bullets" | "body" | "trailing" | "idle";

/**
 * Returns where the live caret should sit while content is streaming.
 * Used by the renderer to anchor the blinking cursor on the right element.
 */
export function rollupCaretLocation(rollup: Rollup): RollupStreamLocation {
  if (rollup.body) {
    return "body";
  }

  if (rollup.bullets.length > 0) {
    return "bullets";
  }

  if (rollup.trailing) {
    return "trailing";
  }

  if (rollup.headline) {
    return "headline";
  }

  return "idle";
}
