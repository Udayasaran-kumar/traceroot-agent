import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createInvestigationState,
} from "./investigation-state.js";

import {
  planNextAction,
} from "./action-planner.js";

test("plans repository search for an initialized investigation", () => {
  const state = createInvestigationState(
    "INC-001",
    "incidents/INC-001/repository",
  );

  const action = planNextAction(state);

  assert.ok(action);

  assert.equal(
    action.tool,
    "search_repository",
  );

  assert.equal(
    action.input.query,
    "pool.connect",
  );

  assert.match(
    action.reason,
    /connection acquisition/i,
  );
});
