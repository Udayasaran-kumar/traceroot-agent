import { join } from "node:path";
import type {
  Incident,
  IncidentCategory,
} from "../domain/incident.js";
import { readTextFile } from "../lib/filesystem.js";

interface IncidentMetadata {
  id: string;
  title: string;
  description?: string;
  category?: string;
}

const INCIDENT_CATEGORIES: readonly IncidentCategory[] = [
  "database",
  "api",
  "authorization",
  "dependency",
  "configuration",
  "concurrency",
  "cache",
  "memory",
  "downstream",
  "deployment",
];

function parseMetadata(content: string): IncidentMetadata {
  const parsed: unknown = JSON.parse(content);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("id" in parsed) ||
    !("title" in parsed) ||
    typeof parsed.id !== "string" ||
    typeof parsed.title !== "string"
  ) {
    throw new Error("Invalid incident metadata");
  }

  const metadata: IncidentMetadata = {
    id: parsed.id,
    title: parsed.title,
  };

  if (
    "description" in parsed &&
    typeof parsed.description === "string"
  ) {
    metadata.description = parsed.description;
  }

  if (
    "category" in parsed &&
    typeof parsed.category === "string"
  ) {
    metadata.category = parsed.category;
  }

  return metadata;
}

function resolveCategory(
  category: string | undefined,
): IncidentCategory {
  if (
    category !== undefined &&
    INCIDENT_CATEGORIES.includes(
      category as IncidentCategory,
    )
  ) {
    return category as IncidentCategory;
  }

  return "database";
}

export async function loadIncident(
  incidentDirectory: string,
): Promise<Incident> {
  const metadataContent = await readTextFile(
    join(incidentDirectory, "metadata.json"),
  );

  const metadata = parseMetadata(metadataContent);

  const incidentReport = await readTextFile(
    join(incidentDirectory, "evidence", "incident.md"),
  );

  const applicationLog = await readTextFile(
    join(incidentDirectory, "evidence", "application.log"),
  );

  const stackTrace = await readTextFile(
    join(incidentDirectory, "evidence", "stacktrace.txt"),
  );

  return {
    id: metadata.id,
    title: metadata.title,
    description:
      metadata.description ?? incidentReport,
    category: resolveCategory(metadata.category),
    evidence: {
      incidentReport,
      logs: [applicationLog],
      stackTrace,
    },
    repositoryPath: join(
      incidentDirectory,
      "repository",
    ),
  };
}
