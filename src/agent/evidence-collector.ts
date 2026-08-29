import type { Incident } from "../domain/incident.js";
import type { EvidenceItem } from "../domain/investigation.js";
import { searchRepository } from "./evidence-search.js";
import { deduplicateEvidence } from "./evidence-deduplicator.js";

export async function collectEvidence(
  incident: Incident,
): Promise<EvidenceItem[]> {
  const evidence: EvidenceItem[] = [
    {
      source: "incident.md",
      content: incident.evidence.incidentReport,
    },
    {
      source: "application.log",
      content: incident.evidence.logs.join("\n"),
    },
  ];

  if (incident.evidence.stackTrace) {
    evidence.push({
      source: "stacktrace.txt",
      content: incident.evidence.stackTrace,
    });
  }

  const searchTerms = [
    "pool.connect",
    "connection.release",
    "maxConnections",
    "Connection pool exhausted",
  ];

  for (const query of searchTerms) {
    const matches = await searchRepository(
      incident.repositoryPath,
      query,
    );

    for (const match of matches) {
      evidence.push({
        source: `${match.file}:${match.line}`,
        content: match.content,
      });
    }
  }

  return deduplicateEvidence(evidence);
}
