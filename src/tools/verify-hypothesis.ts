import { verifyHypothesis } from "../agent/verification.js";
import type { InvestigationHypothesis } from "../domain/investigation.js";

export interface VerifyHypothesisInput {
  repositoryPath: string;
  hypothesis: InvestigationHypothesis;
}

export async function verifyHypothesisTool(
  input: VerifyHypothesisInput,
) {
  return verifyHypothesis(
    input.repositoryPath,
    input.hypothesis,
  );
}
