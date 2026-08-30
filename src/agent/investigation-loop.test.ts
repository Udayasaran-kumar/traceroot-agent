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
});
