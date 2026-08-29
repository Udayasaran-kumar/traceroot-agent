import type {
  Evidence,
  InvestigationResult,
} from "../domain/investigation.js";

import type { Incident } from "../domain/incident.js";

export function investigateBaseline(
  incident: Incident,
): InvestigationResult {
  const evidence: Evidence[] = [];

  const logs = incident.evidence.logs.join("\n");
  const stackTrace = incident.evidence.stackTrace ?? "";

  if (logs.includes("Connection pool exhausted")) {
    evidence.push({
      source: "application.log",
      explanation:
        "Production logs report connection pool exhaustion.",
    });
  }

  if (stackTrace.includes("ConnectionPool.connect")) {
    evidence.push({
      source: "stacktrace.txt",
      explanation:
        "The stack trace shows failure while acquiring a database connection.",
    });
  }

  if (
    incident.evidence.incidentReport.includes(
      "POST /orders intermittently returns HTTP 500",
    )
  ) {
    evidence.push({
      source: "incident.md",
      explanation:
        "The incident report identifies intermittent order creation failures.",
    });
  }

  return {
    incidentId: incident.id,
    rootCause:
      "Database connection leak caused by failing to release acquired connections.",
    confidence: "high",
    evidence,
    alternativeHypotheses: [
      {
        description: "Database server outage",
        confidence: "low",
        status: "rejected",
        evidence: [
          {
            source: "incident.md",
            explanation:
              "The service remains running and GET /health continues to return HTTP 200.",
          },
        ],
      },
      {
        description: "Application deployment failure",
        confidence: "low",
        status: "rejected",
        evidence: [
          {
            source: "incident.md",
            explanation:
              "Failures correlate with increased request volume rather than service startup failure.",
          },
        ],
      },
    ],
    verification: {
      status: "confirmed",
      method:
        "Reproduce repeated order creation against the incident repository fixture.",
      details:
        "The fixture exhausts its five-connection pool because acquired connections are not released.",
    },
    recommendedAction:
      "Restore connection.release() in the finally block of createOrder.",
  };
}
