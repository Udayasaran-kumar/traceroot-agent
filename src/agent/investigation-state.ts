import type {
  EvidenceItem,
  InvestigationHypothesis,
  RootCauseReport,
  VerificationResult,
} from "../domain/investigation.js";

export type InvestigationObjective =
  | "find connection acquisition"
  | "check connection release"
  | "verify hypothesis"
  | "complete";

export interface InvestigationAction {
  tool:
    | "search_repository"
    | "inspect_file"
    | "verify_hypothesis";
  input: Record<string, unknown>;
  reason: string;
}

export interface InvestigationState {
  incidentId: string;
  repositoryPath: string;

  evidence: EvidenceItem[];
  hypotheses: InvestigationHypothesis[];
  currentObjective: InvestigationObjective;
  verification?: VerificationResult;
  actions: InvestigationAction[];

  status:
    | "initialized"
    | "investigating"
    | "confirmed"
    | "failed";

  report?: RootCauseReport;
}

export function createInvestigationState(
  incidentId: string,
  repositoryPath: string,
): InvestigationState {
  return {
    incidentId,
    repositoryPath,
    evidence: [],
    hypotheses: [],
    currentObjective: "find connection acquisition",
    actions: [],
    status: "initialized",
  };
}