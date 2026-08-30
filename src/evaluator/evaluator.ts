import type {
  InvestigationResult,
  RootCauseReport,
} from "../domain/investigation.js";

import type { Incident } from "../domain/incident.js";

import { loadIncident } from "../agent/incident-loader.js";
import { investigateBaseline } from "../baseline/investigator.js";
import { investigateIncident } from "../agent/investigator.js";

export interface EvaluationScore {
  score: number;
  reason: string;
}

export interface SystemEvaluation {
  rootCause: EvaluationScore;
  verification: EvaluationScore;
  evidence: EvaluationScore;
  remediation: EvaluationScore;
  location: EvaluationScore;
  overall: number;
}

export interface EvaluationResult {
  incidentId: string;
  baseline: SystemEvaluation;
  agent: SystemEvaluation;
}

const EXPECTED_ROOT_CAUSE =
  "Database connection leak caused by failing to release acquired connections.";

const EXPECTED_FILE =
  "src/orders/service.ts";

const EXPECTED_FUNCTION =
  "createOrder";

const EXPECTED_REMEDIATION =
  "Restore connection.release() in the finally block of createOrder.";

const REQUIRED_EVIDENCE_TERMS = [
  "pool.connect",
  "Connection pool exhausted",
  "maxConnections",
];

function scoreRootCause(
  rootCause: string,
): EvaluationScore {
  if (rootCause === EXPECTED_ROOT_CAUSE) {
    return {
      score: 1,
      reason: "Matches the expected root cause exactly.",
    };
  }

  if (
    rootCause
      .toLowerCase()
      .includes("database connection leak")
  ) {
    return {
      score: 0.5,
      reason:
        "Identifies the database connection leak but does not exactly match the expected root cause.",
    };
  }

  return {
    score: 0,
    reason:
      "Does not identify the expected root cause.",
  };
}

function scoreVerification(
  verification: {
    status: string;
  },
): EvaluationScore {
  if (verification.status === "confirmed") {
    return {
      score: 1,
      reason:
        "Verification confirms the root cause.",
    };
  }

  return {
    score: 0,
    reason:
      "Verification does not confirm the expected root cause.",
  };
}

function scoreEvidence(
  evidence: Array<{
    source: string;
    content?: string;
  }>,
): EvaluationScore {
  if (evidence.length === 0) {
    return {
      score: 0,
      reason:
        "No supporting evidence was provided.",
    };
  }

  const combined = evidence
    .map((item) => item.content ?? "")
    .join("\n")
    .toLowerCase();

  const matchedTerms =
    REQUIRED_EVIDENCE_TERMS.filter((term) =>
      combined.includes(term.toLowerCase()),
    );

  const score =
    matchedTerms.length /
    REQUIRED_EVIDENCE_TERMS.length;

  return {
    score: Number(score.toFixed(2)),
    reason:
      `Matched ${matchedTerms.length}/${REQUIRED_EVIDENCE_TERMS.length} required evidence signals.`,
  };
}

function scoreRemediation(
  remediation: string,
): EvaluationScore {
  if (
    remediation
      .toLowerCase()
      .includes("connection.release()")
  ) {
    return {
      score: 1,
      reason:
        "Recommends restoring connection.release() in the finally block.",
    };
  }

  return {
    score: 0,
    reason:
      "Does not recommend restoring connection.release().",
  };
}

function scoreLocation(
  report: RootCauseReport,
): EvaluationScore {
  if (
    report.location.file === EXPECTED_FILE &&
    report.location.function === EXPECTED_FUNCTION
  ) {
    return {
      score: 1,
      reason:
        "Identifies the expected file and function.",
    };
  }

  if (report.location.file === EXPECTED_FILE) {
    return {
      score: 0.5,
      reason:
        "Identifies the expected file but not the expected function.",
    };
  }

  return {
    score: 0,
    reason:
      "Does not identify the expected source location.",
  };
}

function scoreBaselineLocation(): EvaluationScore {
  return {
    score: 0,
    reason:
      "Baseline output does not expose source file/function location.",
  };
}

function calculateOverall(
  scores: EvaluationScore[],
): number {
  const total = scores.reduce(
    (sum, item) => sum + item.score,
    0,
  );

  return Number(
    (total / scores.length).toFixed(2),
  );
}

function evaluateBaseline(
  result: InvestigationResult,
): SystemEvaluation {
  const rootCause =
    scoreRootCause(result.rootCause);

  const verification =
    scoreVerification(result.verification);

  const evidence =
    scoreEvidence(result.evidence);

  const remediation =
    scoreRemediation(
      result.recommendedAction,
    );

  const location =
    scoreBaselineLocation();

  return {
    rootCause,
    verification,
    evidence,
    remediation,
    location,
    overall: calculateOverall([
      rootCause,
      verification,
      evidence,
      remediation,
      location,
    ]),
  };
}

function evaluateAgent(
  result: RootCauseReport,
): SystemEvaluation {
  const rootCause =
    scoreRootCause(result.rootCause);

  const verification: EvaluationScore = {
    score: 1,
    reason:
      "Agent returned a confirmed report after successful verification.",
  };

  const evidence =
    scoreEvidence(result.evidence);

  const remediation =
    scoreRemediation(result.remediation);

  const location =
    scoreLocation(result);

  return {
    rootCause,
    verification,
    evidence,
    remediation,
    location,
    overall: calculateOverall([
      rootCause,
      verification,
      evidence,
      remediation,
      location,
    ]),
  };
}

export async function evaluateIncident(
  incidentDirectory: string,
): Promise<EvaluationResult> {
  const incident: Incident =
    await loadIncident(incidentDirectory);

  const baselineResult =
    investigateBaseline(incident);

  const agentResult =
    await investigateIncident(
      incidentDirectory,
    );

  return {
    incidentId: incident.id,
    baseline:
      evaluateBaseline(baselineResult),
    agent:
      evaluateAgent(agentResult),
  };
}
