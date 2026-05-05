import clsx from 'clsx';

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function safeJsonParse<T>(value: string): T | null {
  // Try direct parse first
  try {
    return JSON.parse(value) as T;
  } catch {
    // noop
  }

  // Try extracting from markdown code block
  const codeBlock = value.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock?.[1]) {
    try {
      return JSON.parse(codeBlock[1].trim()) as T;
    } catch {
      // noop
    }
  }

  // Try finding the first { or [ and attempt progressive parse
  const firstBrace = value.indexOf('{');
  const firstBracket = value.indexOf('[');
  const start =
    firstBrace === -1 ? firstBracket
    : firstBracket === -1 ? firstBrace
    : Math.min(firstBrace, firstBracket);

  if (start !== -1) {
    // Try progressively shorter suffixes to handle trailing text
    for (let end = value.length; end > start; end--) {
      const candidate = value.slice(start, end);
      if (candidate.endsWith('}') || candidate.endsWith(']')) {
        try {
          return JSON.parse(candidate) as T;
        } catch {
          // noop
        }
      }
    }
  }

  return null;
}

export function trimLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
