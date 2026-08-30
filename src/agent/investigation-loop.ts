import type {
  InvestigationAction,
  InvestigationState,
} from "./investigation-state.js";

import { planNextAction } from "./action-planner.js";
import {
  executeAction,
  recordAction,
} from "./tool-executor.js";
import { applyToolResult } from "./state-updater.js";
import { generateHypotheses } from "./hypothesis-generator.js";

export interface InvestigationLoopOptions {
  maxSteps?: number;
}

export async function runInvestigationLoop(
  initialState: InvestigationState,
  options: InvestigationLoopOptions = {},
): Promise<InvestigationState> {
  const maxSteps = options.maxSteps ?? 10;

  let state = initialState;

  for (let step = 0; step < maxSteps; step += 1) {
    if (
      state.status === "confirmed" ||
      state.status === "failed"
    ) {
      break;
    }

    const action: InvestigationAction | null =
      planNextAction(state);

    if (action === null) {
      break;
    }

    state = recordAction(state, action);

    const result = await executeAction(action);

    state = applyToolResult(
      state,
      action,
      result,
    );

    if (
      action.tool === "search_repository" &&
      action.input.query === "connection.release" &&
      state.hypotheses.length === 0
    ) {
      state = {
        ...state,
        hypotheses: generateHypotheses(
          state.evidence,
        ),
      };
    }
  }

  return state;
}
