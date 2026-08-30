import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createInvestigationState,
} from "./investigation-state.js";

import {
  applyToolResult,
} from "./state-updater.js";

test("adds repository search results to investigation evidence", () => {
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

  const nextState = applyToolResult(
    state,
    action,
    [
      {
        file:
          "incidents/INC-001/repository/src/orders/service.ts",
        line: 15,
        content:
          "const connection = await pool.connect();",
      },
    ],
  );

  assert.equal(nextState.evidence.length, 1);

  assert.equal(
    nextState.evidence[0]?.source,
    "incidents/INC-001/repository/src/orders/service.ts:15",
  );

  assert.match(
    nextState.evidence[0]?.content ?? "",
    /pool\.connect/,
  );
});

test("marks investigation confirmed after successful verification", () => {
  const state = createInvestigationState(
    "INC-001",
    "incidents/INC-001/repository",
  );

  const action = {
    tool: "verify_hypothesis" as const,
    input: {
      repositoryPath:
        "incidents/INC-001/repository",
      hypothesis: {
        statement: "Database connection leak",
        supportingEvidence: [],
        contradictingEvidence: [],
        confidence: 0.9,
      },
    },
    reason: "Verify hypothesis.",
  };

  const nextState = applyToolResult(
    state,
    action,
    {
      status: "confirmed",
      method: "Fixture regression tests",
      details:
        "Connection pool exhaustion reproduced.",
    },
  );

  assert.equal(
    nextState.status,
    "confirmed",
  );

  assert.equal(
    nextState.verification?.status,
    "confirmed",
  );
});
