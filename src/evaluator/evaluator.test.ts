import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluateIncident } from "./evaluator.js";

test("evaluates baseline and agent against INC-001 expectations", async () => {
  const result = await evaluateIncident(
    "incidents/INC-001",
  );

  assert.equal(
    result.incidentId,
    "INC-001",
  );

  assert.equal(
    result.baseline.rootCause.score,
    1,
  );

  assert.equal(
    result.baseline.verification.score,
    1,
  );

  assert.equal(
    result.agent.rootCause.score,
    1,
  );

  assert.equal(
    result.agent.location.score,
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

  assert.ok(
    result.agent.overall > 0,
  );
});