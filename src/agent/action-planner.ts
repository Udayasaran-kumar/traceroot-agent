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
  if (state.status === "initialized") {
    return {
      tool: "search_repository",
      input: {
        repositoryPath: state.repositoryPath,
        query: "pool.connect",
      },
      reason:
        "Locate database connection acquisition in the repository.",
    };
  }

  const hasSearchedConnectionRelease =
    state.actions.some(
      (item) =>
        item.tool === "search_repository" &&
        item.input.query === "connection.release",
    );

  if (
    state.status === "investigating" &&
    state.hypotheses.length === 0 &&
    !hasSearchedConnectionRelease
  ) {
    return {
      tool: "search_repository",
      input: {
        repositoryPath: state.repositoryPath,
        query: "connection.release",
      },
      reason:
        "Check whether acquired database connections are released.",
    };
  }

  const hypothesis = state.hypotheses.find(
    (item: InvestigationHypothesis) =>
      item.confidence >= 0.8,
  );

  if (
    state.status === "investigating" &&
    state.currentObjective === "verify hypothesis" &&
    hypothesis &&
    state.verification === undefined
  ) {
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

  return null;
}