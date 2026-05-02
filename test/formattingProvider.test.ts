import assert from "node:assert/strict";
import test from "node:test";
import { prettyPrintAxon } from "../src/prettyPrint";

function providerAdjacentFormat(text: string): string {
  return prettyPrintAxon(text);
}

test("Format Document path uses the conservative pretty-printer result", () => {
  const input = "readAll(point)  \r\n\r\n";
  const expected = "readAll(point)\n";

  assert.equal(providerAdjacentFormat(input), expected);
});

test("Format Selection path can format a selected fragment without semantic rewrites", () => {
  const selected = "  echo(\"hello\")  \n\n\n";
  const expected = "  echo(\"hello\")\n";

  assert.equal(providerAdjacentFormat(selected), expected);
});
