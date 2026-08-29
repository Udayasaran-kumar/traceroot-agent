import assert from "node:assert/strict";
import { test } from "node:test";

import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { generateHypotheses } from "./hypothesis-generator.js";
import { verifyHypothesis } from "./verification.js";
import { buildRootCauseReport } from "./report-builder.js";

test("builds a confirmed root cause report", async () => {
  const incident = await loadIncident("incidents/INC-001");
  const evidence = await collectEvidence(incident);
  const hypotheses = generateHypotheses(evidence);

  const hypothesis = hypotheses.find((item) =>
    item.statement.includes("Database connection leak"),
  );

  assert.ok(hypothesis);

  const verification = await verifyHypothesis(
    incident.repositoryPath,
    hypothesis,
  );

  const report = buildRootCauseReport(
    incident.id,
    hypotheses,
    verification,
    evidence,
  );

  assert.equal(report.incidentId, "INC-001");

  assert.match(
    report.rootCause,
    /Database connection leak/,
  );

  assert.equal(
    report.location.file,
    "src/orders/service.ts",
  );

  assert.equal(
    report.location.function,
    "createOrder",
  );

  assert.match(
    report.mechanism,
    /does not release/,
  );

  assert.equal(report.causalChain.length, 6);

  assert.match(
    report.remediation,
    /connection\.release\(\)/,
  );

  assert.equal(report.confidence, 0.9);
});
