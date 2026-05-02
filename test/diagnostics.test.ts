import assert from "node:assert/strict";
import test from "node:test";
import { findAxonDiagnostics } from "../src/diagnostics";

function codes(text: string): string[] {
  return findAxonDiagnostics(text).map((finding) => finding.code);
}

test("diagnostics flag conservative Axon footguns", () => {
  const text = [
    'x: val.typeof == "Str"',
    'name.toLower()',
    'name.toUpper()',
    'dict.get("missing", "fallback")',
    'readAll(point and his).limit(10)',
    'readAll(site).sort("dis")',
    'siteRef == siteRef',
  ].join("\n");

  assert.deepEqual(codes(text), [
    "typeof-debugType",
    "string-case-func",
    "string-case-func",
    "dict-get-fallback",
    "readAll-limit",
    "filter-tautology",
  ]);
});

test("diagnostics messages name the safer Axon shape", () => {
  const diagnostics = findAxonDiagnostics(
    'typeof x\nname.toLower()\ndict.get("x", 1)\nreadAll(point).limit(3)\nequipRef == equipRef',
  );
  const messages = diagnostics.map((diagnostic) => diagnostic.message).join("\n");

  assert.match(messages, /debugType/);
  assert.match(messages, /lower\(\)/);
  assert.match(messages, /fallback explicitly/);
  assert.match(messages, /readAllStream/);
  assert.match(messages, /compared with itself/);
});

test("diagnostics skip comments and quoted strings", () => {
  const text = [
    '// typeof name.toLower() dict.get("x", 1) readAll(point).limit(1)',
    'msg: "typeof name.toUpper() siteRef == siteRef"',
    'safe: debugType',
  ].join("\n");

  assert.deepEqual(findAxonDiagnostics(text), []);
});
