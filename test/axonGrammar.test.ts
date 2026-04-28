import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { INITIAL, Registry } from "vscode-textmate";
import { loadWASM, OnigScanner, OnigString } from "vscode-oniguruma";

const grammarPath = join(process.cwd(), "syntaxes", "axon.tmLanguage.json");
const wasmPath = require.resolve("vscode-oniguruma/release/onig.wasm");

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
  const tokenLines = [
    grammar.tokenizeLine("// comment", INITIAL),
    grammar.tokenizeLine("read(site).map(s => do", INITIAL),
    grammar.tokenizeLine("id: @p:demo-site-123", INITIAL),
    grammar.tokenizeLine("enabled: true and area > 42.5", INITIAL),
    grammar.tokenizeLine("note: \"quoted text\"", INITIAL),
  ];

  const scopedText = tokenLines.flatMap((line, index) => {
    const source = [
      "// comment",
      "read(site).map(s => do",
      "id: @p:demo-site-123",
      "enabled: true and area > 42.5",
      "note: \"quoted text\"",
    ][index];

    return line.tokens.map((token) => ({
      text: source.slice(token.startIndex, token.endIndex),
      scopes: token.scopes,
    }));
  });

  assertToken(scopedText, "// comment", "comment.line.double-slash.axon");
  assertToken(scopedText, "read", "entity.name.function.axon");
  assertToken(scopedText, "map", "entity.name.function.axon");
  assertToken(scopedText, "do", "keyword.control.axon");
  assertToken(scopedText, "@p:demo-site-123", "constant.other.reference.axon");
  assertToken(scopedText, "true", "constant.language.axon");
  assertToken(scopedText, "and", "keyword.operator.word.axon");
  assertToken(scopedText, "42.5", "constant.numeric.axon");
  assertToken(scopedText, "quoted text", "string.quoted.double.axon");
});

function assertToken(
  tokens: Array<{ text: string; scopes: string[] }>,
  expectedText: string,
  expectedScope: string,
): void {
  assert.ok(
    tokens.some((token) => token.text === expectedText && token.scopes.includes(expectedScope)),
    `expected ${JSON.stringify(expectedText)} to include scope ${expectedScope}\n${JSON.stringify(tokens, null, 2)}`,
  );
}
