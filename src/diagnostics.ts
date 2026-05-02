export type AxonDiagnosticCode =
  | "typeof-debugType"
  | "string-case-func"
  | "dict-get-fallback"
  | "readAll-limit"
  | "filter-tautology";

export type AxonDiagnosticFinding = {
  code: AxonDiagnosticCode;
  message: string;
  start: number;
  end: number;
};

type Rule = {
  code: AxonDiagnosticCode;
  pattern: RegExp;
  message: (match: RegExpExecArray) => string;
  range?: (match: RegExpExecArray) => [number, number];
};

const RULES: Rule[] = [
  {
    code: "typeof-debugType",
    pattern: /\btypeof\b/g,
    message: () => "Axon does not use JavaScript typeof; use debugType for runtime type checks.",
  },
  {
    code: "string-case-func",
    pattern: /\.to(Lower|Upper)\s*\(/g,
    message: (match) => `Axon strings use ${match[1] === "Lower" ? "lower" : "upper"}(), not ${match[0].trim()}.`,
  },
  {
    code: "dict-get-fallback",
    pattern: /\b[A-Za-z_][A-Za-z0-9_]*\.get\s*\(\s*(["'`])[^"'`]+\1\s*,/g,
    message: () => "Axon Dict.get does not use a fallback argument; handle fallback explicitly after get().",
  },
  {
    code: "readAll-limit",
    pattern: /\breadAll\s*\([^\n)]*\)\s*\.limit\s*\(/g,
    message: () => "readAll() returns a grid; use readAllStream(...).limit(...).collect() or pass a DB limit option.",
  },
  {
    code: "filter-tautology",
    pattern: /\b(siteRef|equipRef|pointRef|spaceRef)\s*==\s*\1\b/g,
    message: (match) => `Suspicious filter tautology: ${match[1]} is compared with itself.`,
  },
];

export function findAxonDiagnostics(text: string): AxonDiagnosticFinding[] {
  const findings: AxonDiagnosticFinding[] = [];

  for (const rule of RULES) {
    for (const match of text.matchAll(rule.pattern)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (isIgnoredMatch(text, start)) continue;

      const [rangeStart, rangeEnd] = rule.range ? rule.range(match) : [start, end];
      findings.push({
        code: rule.code,
        message: rule.message(match),
        start: rangeStart,
        end: rangeEnd,
      });
    }
  }

  return findings.sort((a, b) => a.start - b.start || a.end - b.end);
}

function isIgnoredMatch(text: string, offset: number): boolean {
  return isAfterLineComment(text, offset) || isInsideQuotedString(text, offset);
}

function isAfterLineComment(text: string, offset: number): boolean {
  const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
  const commentStart = text.indexOf("//", lineStart);
  return commentStart !== -1 && commentStart < offset;
}

function isInsideQuotedString(text: string, offset: number): boolean {
  const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
  let quote: string | undefined;
  let escaped = false;

  for (let index = lineStart; index < offset; index += 1) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = undefined;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
  }

  return quote !== undefined;
}
