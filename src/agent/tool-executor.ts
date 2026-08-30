import {
  searchRepositoryTool,
} from "../tools/search-repository.js";

import {
  inspectFileTool,
} from "../tools/inspect-file.js";

import {
  verifyHypothesisTool,
} from "../tools/verify-hypothesis.js";

import type {
  InvestigationAction,
  InvestigationState,
} from "./investigation-state.js";

export async function executeAction(
  action: InvestigationAction,
): Promise<unknown> {
  switch (action.tool) {
    case "search_repository":
      return searchRepositoryTool({
        repositoryPath:
          String(action.input.repositoryPath),
        query: String(action.input.query),
      });

    case "inspect_file":
      return inspectFileTool({
        repositoryPath:
          String(action.input.repositoryPath),
        filePath: String(action.input.filePath),
      });

    case "verify_hypothesis":
      return verifyHypothesisTool({
        repositoryPath:
          String(action.input.repositoryPath),
        hypothesis: action.input
          .hypothesis as never,
      });

    default:
      throw new Error(
        `Unsupported investigation tool: ${action.tool}`,
      );
  }
}

export function recordAction(
  state: InvestigationState,
  action: InvestigationAction,
): InvestigationState {
  return {
    ...state,
    actions: [
      ...state.actions,
      action,
    ],
    status: "investigating",
  };
}
