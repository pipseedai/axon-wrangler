/**
 * Conservative Axon pretty-printer.
 *
 * This intentionally does not parse Axon. Keep transformations text-preserving
 * and fixture-backed: normalize line endings, remove trailing horizontal
 * whitespace, ensure exactly one final newline, and indent only obvious
 * line-oriented do/end/else block boundaries.
 */
const INDENT = "  ";

export function prettyPrintAxon(source: string): string {
  const normalizedLines = source
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+$/u, ""));

  const withoutTrailingBlankLines = dropTrailingBlankLines(normalizedLines);
  const indented = indentObviousBlocks(withoutTrailingBlankLines);

  return `${indented.join("\n")}\n`;
}

function dropTrailingBlankLines(lines: string[]): string[] {
  const result = [...lines];
  while (result.length > 0 && result[result.length - 1] === "") {
    result.pop();
  }
  return result;
}

function indentObviousBlocks(lines: string[]): string[] {
  let depth = 0;

  return lines.map((line) => {
    if (line.trim() === "") {
      return "";
    }

    const trimmed = line.trimStart();
    if (startsObviousBlockContinuation(trimmed)) {
      depth = Math.max(0, depth - 1);
    }

    const formatted = `${INDENT.repeat(depth)}${trimmed}`;

    if (startsElseBlock(trimmed) || endsWithLineOrientedDo(trimmed)) {
      depth += 1;
    }

    return formatted;
  });
}

function startsObviousBlockContinuation(trimmed: string): boolean {
  return startsEndBlock(trimmed) || startsElseBlock(trimmed);
}

function startsEndBlock(trimmed: string): boolean {
  return /^end(?:\b|\))/u.test(trimmed);
}

function startsElseBlock(trimmed: string): boolean {
  return /^else\b/u.test(trimmed);
}

function endsWithLineOrientedDo(trimmed: string): boolean {
  return /\bdo\s*$/u.test(trimmed);
}
