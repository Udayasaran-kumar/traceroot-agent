import assert from "node:assert/strict";
import test from "node:test";

import {
  deduplicateEvidence,
} from "./evidence-deduplicator.js";

test("removes exact duplicate evidence while preserving unique evidence", () => {
  const evidence = [
    {
      source: "src/orders/service.ts:15",
      content: "const connection = await pool.connect();",
    },
    {
      source: "src/orders/service.ts:15",
      content: "const connection = await pool.connect();",
    },
    {
      source: "src/db/pool.ts:12",
      content: 'throw new Error("Connection pool exhausted");',
    },
  ];

  const result = deduplicateEvidence(evidence);

  assert.equal(result.length, 2);

  assert.equal(
    result[0]?.source,
    "src/orders/service.ts:15",
  );

  assert.equal(
    result[1]?.source,
    "src/db/pool.ts:12",
  );
});
