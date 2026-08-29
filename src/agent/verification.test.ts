import assert from "node:assert/strict";
import { test } from "node:test";

import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { generateHypotheses } from "./hypothesis-generator.js";
import { verifyHypothesis } from "./verification.js";

test("confirms the database connection leak through fixture tests", async () => {
  const incident = await loadIncident("incidents/INC-001");
  const evidence = await collectEvidence(incident);
  const hypotheses = generateHypotheses(evidence);

  const hypothesis = hypotheses.find((item) =>
    item.statement.includes("Database connection leak"),
  );

  assert.ok(hypothesis);

  const result = await verifyHypothesis(
    incident.repositoryPath,
    hypothesis,
  );

  assert.equal(result.status, "confirmed");
  assert.equal(
    result.method,
    "Fixture regression tests",
  );
});
