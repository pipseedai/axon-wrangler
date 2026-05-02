import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

type Snippet = {
  prefix: string;
  body: string | string[];
  description: string;
};

const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
const snippets = JSON.parse(readFileSync(join(process.cwd(), "snippets", "axon.json"), "utf8")) as Record<string, Snippet>;

test("package contributes Axon snippets", () => {
  assert.deepEqual(packageJson.contributes.snippets, [
    { language: "axon", path: "./snippets/axon.json" },
  ]);
});

test("snippet pack contains only verified conservative Axon patterns", () => {
  const expectedPrefixes = ["do", "ifdo", "readHisNum", "readStreamLimit", "hasFallback", "debugType"];
  assert.deepEqual(Object.values(snippets).map((snippet) => snippet.prefix), expectedPrefixes);
  assert.equal(JSON.stringify(snippets).includes("try"), false, "try/catch remains deferred until syntax is confirmed");
});

test("snippet bodies include useful placeholders and safe examples", () => {
  assert.deepEqual(snippets["do/end block"].body, ["do", "  ${1:// body}", "end"]);
  assert.equal(snippets["read numeric history points"].body, "readAll(point and his and kind == \"Number\")");
  assert.equal(snippets["readAllStream limit collect"].body, "readAllStream(${1:filter}).limit(${2:100}).collect()");
  assert.match(String(snippets["dict has fallback"].body), /\.has\("\$\{2:key\}"\)/);
  assert.match(String(snippets["debug type"].body), /\.typeof/);
});
