import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createInvestigationState,
} from "./investigation-state.js";

import {
  executeAction,
  recordAction,
} from "./tool-executor.js";

test("records an investigation action", () => {
  const state = createInvestigationState(
    "INC-001",
    "incidents/INC-001/repository",
  );

  const action = {
    tool: "search_repository" as const,
    input: {
      repositoryPath:
        "incidents/INC-001/repository",
      query: "pool.connect",
    },
    reason: "Find connection acquisition.",
  };

  const nextState = recordAction(
    state,
    action,
  );

  assert.equal(
    nextState.actions.length,
    1,
  );

  assert.equal(
    nextState.actions[0]?.tool,
    "search_repository",
  );

  assert.equal(
    nextState.status,
    "investigating",
  );
});

test("executes repository search through the tool layer", async () => {
  const result = await executeAction({
    tool: "search_repository",
    input: {
      repositoryPath:
        "incidents/INC-001/repository",
      query: "pool.connect",
    },
    reason: "Find connection acquisition.",
  });

  assert.ok(Array.isArray(result));

  assert.ok(
    result.some(
      (match) =>
        typeof match === "object" &&
        match !== null &&
        "file" in match &&
        String(match.file).endsWith(
          "src/orders/service.ts",
        ),
    ),
  );
});
