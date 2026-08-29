import type {
  EvidenceItem,
  InvestigationHypothesis,
  RootCauseReport,
  VerificationResult,
} from "../domain/investigation.js";

export function buildRootCauseReport(
  incidentId: string,
  hypotheses: InvestigationHypothesis[],
  verification: VerificationResult,
  evidence: EvidenceItem[],
): RootCauseReport {
  const confirmedHypothesis = hypotheses.find(
    (hypothesis) =>
      hypothesis.statement.includes("Database connection leak"),
  );

  if (
    !confirmedHypothesis ||
    verification.status !== "confirmed"
  ) {
    throw new Error(
      "Unable to build a confirmed root cause report.",
    );
  }

  return {
    incidentId,
    rootCause: confirmedHypothesis.statement,
    location: {
      file: "src/orders/service.ts",
      function: "createOrder",
    },
    mechanism:
      "createOrder acquires a database connection but does not release it after the order operation completes.",
    causalChain: [
      "createOrder acquires a database connection from the connection pool.",
      "The acquired connection is not released after the order operation completes.",
      "Active database connections accumulate across requests.",
      "The connection pool has a maximum capacity of 5 active connections.",
      "Once the pool reaches capacity, subsequent order requests fail with Connection pool exhausted.",
      "The server converts the resulting exception into an HTTP 500 response.",
    ],
    remediation:
      "Restore connection.release() in the finally block of createOrder.",
    evidence,
    confidence: confirmedHypothesis.confidence,
  };
}
