import assert from "node:assert/strict";
import { test } from "node:test";

import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { generateHypotheses } from "./hypothesis-generator.js";

test("generates a database connection leak hypothesis", async () => {
  const incident = await loadIncident("incidents/INC-001");
  const evidence = await collectEvidence(incident);

  const hypotheses = generateHypotheses(evidence);

  assert.ok(hypotheses.length >= 1);

  assert.ok(
    hypotheses.some((hypothesis) =>
      hypothesis.statement.includes(
        "Database connection leak",
      ),
    ),
  );
});
