export const CONFIDENCE_LEVELS = [
  "low",
  "medium",
  "high",
] as const;

export type Confidence =
  (typeof CONFIDENCE_LEVELS)[number];

export interface Evidence {
  source: string;
  location?: string;
  explanation: string;
}

export interface Hypothesis {
  description: string;
  confidence: Confidence;
  status: "supported" | "rejected" | "unverified";
  evidence: Evidence[];
}

export interface VerificationResult {
  status: "confirmed" | "rejected" | "not_run";
  method?: string;
  details?: string;
}

export interface InvestigationResult {
  incidentId: string;

  rootCause: string;
  confidence: Confidence;

  evidence: Evidence[];

  alternativeHypotheses: Hypothesis[];

  verification: VerificationResult;

  recommendedAction: string;
}
