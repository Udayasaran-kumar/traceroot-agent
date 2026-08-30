import assert from "node:assert/strict";
import { test } from "node:test";

import {
  loadIncident,
} from "./incident-loader.js";

import {
  collectEvidence,
} from "./evidence-collector.js";

import {
  createInvestigationState,
} from "./investigation-state.js";

import {
  runInvestigationLoop,
} from "./investigation-loop.js";

test("runs the investigation loop through hypothesis verification", async () => {
  const incident = await loadIncident(
    "incidents/INC-001",
  );

  const evidence = await collectEvidence(
    incident,
  );

  const state = {
    ...createInvestigationState(
      incident.id,
      incident.repositoryPath,
    ),
    evidence,
  };

  const result = await runInvestigationLoop(
    state,
    {
      maxSteps: 10,
    },
  );

  assert.ok(
    result.evidence.length > 0,
  );

  assert.ok(
    result.hypotheses.length > 0,
  );

  assert.ok(
    result.actions.length >= 2,
  );

  assert.equal(
    result.status,
    "confirmed",
  );

  assert.equal(
    result.verification?.status,
    "confirmed",
  );

  assert.ok(
    result.report,
  );

  assert.equal(
    result.report?.incidentId,
    "INC-001",
  );

  assert.match(
    result.report?.rootCause ?? "",
    /Database connection leak/,
  );

  assert.equal(
    result.report?.location.file,
    "src/orders/service.ts",
  );

  assert.match(
    result.report?.remediation ?? "",
    /connection\.release\(\)/,
  );

  assert.equal(
    result.report?.confidence,
    0.9,
  );
});
