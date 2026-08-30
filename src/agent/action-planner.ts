import type {
  InvestigationHypothesis,
} from "../domain/investigation.js";

import type {
  InvestigationAction,
  InvestigationState,
} from "./investigation-state.js";

export function planNextAction(
  state: InvestigationState,
): InvestigationAction | null {
  switch (state.currentObjective) {
    case "find connection acquisition":
      return {
        tool: "search_repository",
        input: {
          repositoryPath: state.repositoryPath,
          query: "pool.connect",
        },
        reason:
          "Locate database connection acquisition in the repository.",
      };

    case "check connection release":
      return {
        tool: "search_repository",
        input: {
          repositoryPath: state.repositoryPath,
          query: "connection.release",
        },
        reason:
          "Check whether acquired database connections are released.",
      };

    case "verify hypothesis": {
      const hypothesis = state.hypotheses.find(
        (item: InvestigationHypothesis) =>
          item.confidence >= 0.8,
      );

      if (!hypothesis || state.verification !== undefined) {
        return null;
      }

      return {
        tool: "verify_hypothesis",
        input: {
          repositoryPath: state.repositoryPath,
          hypothesis,
        },
        reason:
          "Verify the highest-confidence hypothesis against the repository fixture.",
      };
    }

    case "complete":
      return null;
  }
}