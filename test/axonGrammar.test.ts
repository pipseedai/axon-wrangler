import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { INITIAL, Registry } from "vscode-textmate";
import { loadWASM, OnigScanner, OnigString } from "vscode-oniguruma";

const grammarPath = join(process.cwd(), "syntaxes", "axon.tmLanguage.json");
const realShapeSamplePath = join(process.cwd(), "samples", "real-shape.axon");
const wasmPath = require.resolve("vscode-oniguruma/release/onig.wasm");

type ScopedToken = { text: string; scopes: string[] };

async function loadAxonGrammar() {
  await loadWASM(readFileSync(wasmPath).buffer);

  const registry = new Registry({
    onigLib: Promise.resolve({
      createOnigScanner: (patterns) => new OnigScanner(patterns),
      createOnigString: (source) => new OnigString(source),
    }),
    loadGrammar: async (scopeName) => {
      if (scopeName !== "source.axon") {
        return null;
      }

      return JSON.parse(readFileSync(grammarPath, "utf8"));
    },
  });

  const grammar = await registry.loadGrammar("source.axon");
  assert.ok(grammar, "source.axon grammar should load");
  return grammar;
}

test("Axon TextMate grammar assigns conservative v0 scopes", async () => {
  const grammar = await loadAxonGrammar();
  const sourceLines = [
    "// comment",
    "read(site).map(s => do",
    "id: @p:demo-site-123",
    "enabled: true and area > 42.5",
    "note: \"quoted text\"",
  ];
  const scopedText = tokenizeLines(grammar, sourceLines);

  assertToken(scopedText, "// comment", "comment.line.double-slash.axon");
  assertToken(scopedText, "read", "entity.name.function.axon");
  assertToken(scopedText, "map", "entity.name.function.method.axon");
  assertToken(scopedText, "=>", "keyword.operator.axon");
  assertToken(scopedText, "do", "keyword.control.axon");
  assertToken(scopedText, "id", "variable.parameter.key.axon");
  assertToken(scopedText, ":", "punctuation.separator.key-value.axon");
  assertToken(scopedText, "@p:demo-site-123", "constant.other.reference.axon");
  assertToken(scopedText, "true", "constant.language.axon");
  assertToken(scopedText, "and", "keyword.operator.word.axon");
  assertToken(scopedText, ">", "keyword.operator.axon");
  assertToken(scopedText, "42.5", "constant.numeric.axon");
  assertToken(scopedText, "quoted text", "string.quoted.double.axon");
});

test("Axon TextMate grammar scopes real-shaped chained calls, keys, operators, and literals", async () => {
  const grammar = await loadAxonGrammar();
  const sampleLines = readFileSync(realShapeSamplePath, "utf8").split(/\r?\n/);
  const scopedText = tokenizeLines(grammar, sampleLines);

  assertToken(scopedText, "readAll", "entity.name.function.axon");
  assertToken(scopedText, "sort", "entity.name.function.method.axon");
  assertToken(scopedText, "toRecList", "entity.name.function.method.axon");
  assertToken(scopedText, "map", "entity.name.function.method.axon");
  assertToken(scopedText, "find", "entity.name.function.method.axon");
  assertToken(scopedText, "addMeta", "entity.name.function.method.axon");
  assertToken(scopedText, "toGrid", "entity.name.function.method.axon");

  for (const key of ["info", "title", "id", "dis", "name", "val", "key", "grid", "checked", "stale"]) {
    assertToken(scopedText, key, "variable.parameter.key.axon");
  }

  for (const operator of ["=>", "->", "==", "!=", ">="]) {
    assertToken(scopedText, operator, "keyword.operator.axon");
  }

  assertToken(scopedText, "@p:demo-site-123", "constant.other.reference.axon");
  assertToken(scopedText, "null", "constant.language.axon");
  assertToken(scopedText, "true", "constant.language.axon");
  assertToken(scopedText, "false", "constant.language.axon");
  assertToken(scopedText, "na", "constant.language.axon");
  assertToken(scopedText, "10", "constant.numeric.axon");
  assertToken(scopedText, "curVal", "string.quoted.double.axon");
});

function tokenizeLines(grammar: Awaited<ReturnType<typeof loadAxonGrammar>>, sourceLines: string[]): ScopedToken[] {
  return sourceLines.flatMap((source) => {
    const line = grammar.tokenizeLine(source, INITIAL);
    return line.tokens.map((token) => ({
      text: source.slice(token.startIndex, token.endIndex),
      scopes: token.scopes,
    }));
  });
}

function assertToken(tokens: ScopedToken[], expectedText: string, expectedScope: string): void {
  assert.ok(
    tokens.some((token) => token.text === expectedText && token.scopes.includes(expectedScope)),
    `expected ${JSON.stringify(expectedText)} to include scope ${expectedScope}\n${JSON.stringify(tokens, null, 2)}`,
  );
}
