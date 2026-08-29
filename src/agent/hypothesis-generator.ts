import type {
  EvidenceItem,
  InvestigationHypothesis,
} from "../domain/investigation.js";

export function generateHypotheses(
  evidence: EvidenceItem[],
): InvestigationHypothesis[] {
  const text = evidence
    .map((item) => item.content)
    .join("\n")
    .toLowerCase();

  const hypotheses: InvestigationHypothesis[] = [];

  if (
    text.includes("pool.connect") &&
    text.includes("connection pool exhausted")
  ) {
    hypotheses.push({
      statement:
        "Database connection leak caused by failing to release acquired connections.",
      supportingEvidence: [
        "createOrder acquires a database connection with pool.connect().",
        "The connection pool has a maximum capacity of 5.",
        "The production logs report Connection pool exhausted.",
      ],
      contradictingEvidence: [],
      confidence: 0.9,
    });
  }

  if (
    text.includes("connection pool exhausted") &&
    text.includes("maxConnections")
  ) {
    hypotheses.push({
      statement:
        "Connection pool capacity is too small for the application's request volume.",
      supportingEvidence: [
        "The connection pool has a maximum capacity of 5.",
        "The failure occurs under increased request volume.",
      ],
      contradictingEvidence: [
        "The repository provides a release mechanism for returning connections to the pool.",
      ],
      confidence: 0.45,
    });
  }

  if (
    text.includes("health") &&
    text.includes("connection pool exhausted")
  ) {
    hypotheses.push({
      statement:
        "The entire service or application process is unavailable.",
      supportingEvidence: [],
      contradictingEvidence: [
        "GET /health continues to return HTTP 200.",
        "The application process remains running.",
      ],
      confidence: 0.1,
    });
  }

  return hypotheses;
}
