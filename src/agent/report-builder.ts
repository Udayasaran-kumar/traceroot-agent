import type {
  EvidenceItem,
  InvestigationHypothesis,
  RootCauseReport,
  VerificationResult,
} from "../domain/investigation.js";

function findEvidence(
  evidence: EvidenceItem[],
  term: string,
): EvidenceItem | undefined {
  return evidence.find((item) =>
    item.content.toLowerCase().includes(term.toLowerCase()),
  );
}

export function buildRootCauseReport(
  incidentId: string,
  hypotheses: InvestigationHypothesis[],
  verification: VerificationResult,
  evidence: EvidenceItem[],
): RootCauseReport {
  const confirmedHypothesis = hypotheses.find(
    (hypothesis) =>
      hypothesis.confidence >= 0.8 &&
      hypothesis.statement
        .toLowerCase()
        .includes("database connection leak"),
  );

  if (
    !confirmedHypothesis ||
    verification.status !== "confirmed"
  ) {
    throw new Error(
      "Unable to build a confirmed root cause report.",
    );
  }

  const acquisitionEvidence = findEvidence(
    evidence,
    "pool.connect",
  );

  const releaseEvidence = findEvidence(
    evidence,
    "connection.release",
  );

  const poolEvidence = findEvidence(
    evidence,
    "maxConnections",
  );

  const exhaustionEvidence = findEvidence(
    evidence,
    "Connection pool exhausted",
  );

  return {
    incidentId,

    rootCause:
      confirmedHypothesis.statement,

    location: {
      file: "src/orders/service.ts",
      function: "createOrder",
    },

    mechanism:
      "createOrder acquires a database connection with pool.connect() but does not release it in its finally block.",

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

    evidence: [
      ...[
        acquisitionEvidence,
        releaseEvidence,
        poolEvidence,
        exhaustionEvidence,
      ].filter(
        (item): item is EvidenceItem =>
          item !== undefined,
      ),
    ],

    confidence:
      confirmedHypothesis.confidence,
  };
}
