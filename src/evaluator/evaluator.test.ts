import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateIncident } from "./evaluator.js";

test("agent outperforms baseline on INC-001", async () => {
  const result = await evaluateIncident(
    "incidents/INC-001",
  );

  assert.equal(result.incidentId, "INC-001");

  assert.equal(
    result.baseline.overall,
    0.6,
  );

  assert.equal(
    result.agent.overall,
    1,
  );

  assert.ok(
    result.agent.overall >
      result.baseline.overall,
  );
});

test("agent identifies all required evidence signals", async () => {
  const result = await evaluateIncident(
    "incidents/INC-001",
  );

  assert.equal(
    result.agent.evidence.score,
    1,
  );

  assert.match(
    result.agent.evidence.reason,
    /3\/3/,
  );
});

test("agent identifies exact source location", async () => {
  const result = await evaluateIncident(
    "incidents/INC-001",
  );

  assert.equal(
    result.agent.location.score,
    1,
  );

  assert.equal(
    result.agent.rootCause.score,
    1,
  );

  assert.equal(
    result.agent.remediation.score,
    1,
  );

  assert.equal(
    result.agent.verification.score,
    1,
  );
});
