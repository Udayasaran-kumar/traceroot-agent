export const INCIDENT_CATEGORIES = [
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
] as const;

export type IncidentCategory =
  (typeof INCIDENT_CATEGORIES)[number];

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;

  evidence: {
    incidentReport: string;
    logs: string[];
    stackTrace?: string;
  };

  repositoryPath: string;
}
