import type {
  EvidenceItem,
  VerificationResult,
} from "../domain/investigation.js";

import type {
  InvestigationAction,
  InvestigationState,
} from "./investigation-state.js";

import { deduplicateEvidence } from "./evidence-deduplicator.js";
import { generateHypotheses } from "./hypothesis-generator.js";

interface SearchMatch {
  file: string;
  line: number;
  content: string;
}

function isSearchMatch(value: unknown): value is SearchMatch {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.file === "string" &&
    typeof item.line === "number" &&
    typeof item.content === "string"
  );
}

function isVerificationResult(
  value: unknown,
): value is VerificationResult {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    item.status === "confirmed" ||
    item.status === "rejected"
  );
}

function searchResultsToEvidence(
  results: SearchMatch[],
): EvidenceItem[] {
  return results.map((match) => ({
    source: `${match.file}:${match.line}`,
    content: match.content,
  }));
}

export function applyToolResult(
  state: InvestigationState,
  action: InvestigationAction,
  result: unknown,
): InvestigationState {
  const nextState: InvestigationState = {
    ...state,
  };

  if (action.tool === "search_repository") {
    if (!Array.isArray(result)) {
      throw new Error(
        "search_repository returned an invalid result",
      );
    }

    const matches = result.filter(isSearchMatch);

    nextState.evidence = deduplicateEvidence([
      ...state.evidence,
      ...searchResultsToEvidence(matches),
    ]);

    if (action.input.query === "pool.connect") {
      nextState.currentObjective =
        "check connection release";
    }

    if (action.input.query === "connection.release") {
      nextState.hypotheses = generateHypotheses(
        nextState.evidence,
      );

      nextState.currentObjective =
        "verify hypothesis";
    }

    return nextState;
  }

  if (action.tool === "verify_hypothesis") {
    if (!isVerificationResult(result)) {
      throw new Error(
        "verify_hypothesis returned an invalid result",
      );
    }

    nextState.verification = result;

    nextState.status =
      result.status === "confirmed"
        ? "confirmed"
        : "failed";

    nextState.currentObjective = "complete";

    return nextState;
  }

  return nextState;
}