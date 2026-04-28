/**
 * Conservative Axon pretty-printer v0.
 *
 * This intentionally does not parse Axon. Keep transformations text-preserving
 * and fixture-backed: remove trailing horizontal whitespace and ensure exactly
 * one final newline.
 */
export function prettyPrintAxon(source: string): string {
  const withoutTrailingWhitespace = source
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+$/u, ""))
    .join("\n");

  return `${withoutTrailingWhitespace.replace(/\n*$/u, "")}\n`;
}
