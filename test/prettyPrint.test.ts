import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { prettyPrintAxon } from "../src/prettyPrint";

const fixturesRoot = join(process.cwd(), "test", "fixtures");

for (const fixtureName of readdirSync(fixturesRoot)) {
  test(`prettyPrintAxon fixture: ${fixtureName}`, () => {
    const input = readFileSync(join(fixturesRoot, fixtureName, "input.axon"), "utf8");
    const expected = readFileSync(join(fixturesRoot, fixtureName, "expected.axon"), "utf8");

    assert.equal(prettyPrintAxon(input), expected);
  });
}
