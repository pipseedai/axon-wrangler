import assert from "node:assert/strict";
import test from "node:test";
import { AXON_HOVERS } from "../src/hoverData";

const expectedTerms = [
  "debugType",
  "readAll",
  "readAllStream",
  "parseFilter",
  "filterToFunc",
  "fold",
  "na",
  "toSpan",
];

test("curated Axon hover dictionary covers the initial source-safe terms", () => {
  assert.deepEqual(Object.keys(AXON_HOVERS).sort(), expectedTerms.sort());
});

test("Axon hovers stay concise and source-safe", () => {
  for (const [term, hover] of Object.entries(AXON_HOVERS)) {
    assert.ok(hover.label.includes(term) || hover.label.toLowerCase().includes(term.toLowerCase()));
    assert.ok(hover.detail.length > 20, `${term} detail should be useful`);
    assert.ok(hover.detail.length < 280, `${term} detail should stay short`);
    assert.doesNotMatch(hover.detail, /probably|maybe|unknown/i, `${term} should avoid speculative wording`);
  }
});

test("hover content includes known gotchas for risky Axon terms", () => {
  assert.match(AXON_HOVERS.debugType.detail, /instead of.*typeof/i);
  assert.match(AXON_HOVERS.readAll.detail, /readAllStream/i);
  assert.match(AXON_HOVERS.readAllStream.detail, /limit/i);
  assert.match(AXON_HOVERS.na.detail, /distinct from null/i);
  assert.match(AXON_HOVERS.toSpan.detail, /last7days.*not valid/i);
});
