import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createInvestigationState,
} from "./investigation-state.js";

test("creates an initialized investigation state", () => {
  const state = createInvestigationState(
    "INC-001",
    "incidents/INC-001/repository",
  );

  assert.equal(state.incidentId, "INC-001");
  assert.equal(
    state.repositoryPath,
    "incidents/INC-001/repository",
  );

  assert.deepEqual(state.evidence, []);
  assert.deepEqual(state.hypotheses, []);
  assert.deepEqual(state.actions, []);

  assert.equal(state.status, "initialized");
  assert.equal(state.verification, undefined);
  assert.equal(state.report, undefined);
});
