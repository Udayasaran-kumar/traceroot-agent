import type { RootCauseReport } from "../domain/investigation.js";

import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { generateHypotheses } from "./hypothesis-generator.js";
import { verifyHypothesis } from "./verification.js";
import { buildRootCauseReport } from "./report-builder.js";

export async function investigateIncident(
  incidentDirectory: string,
): Promise<RootCauseReport> {
  const incident = await loadIncident(incidentDirectory);

  const evidence = await collectEvidence(incident);

  const hypotheses = generateHypotheses(evidence);

  const primaryHypothesis = hypotheses
    .filter((hypothesis) => hypothesis.confidence > 0)
    .sort(
      (a, b) =>
        b.confidence - a.confidence,
    )[0];

  if (!primaryHypothesis) {
    throw new Error(
      "No investigation hypothesis was generated.",
    );
  }

  const verification = await verifyHypothesis(
    incident.repositoryPath,
    primaryHypothesis,
  );

  return buildRootCauseReport(
    incident.id,
    hypotheses,
    verification,
    evidence,
  );
}
