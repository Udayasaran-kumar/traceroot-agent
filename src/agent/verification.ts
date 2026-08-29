import { execFile } from "node:child_process";
import { promisify } from "node:util";

import type {
  InvestigationHypothesis,
  VerificationResult,
} from "../domain/investigation.js";

const execFileAsync = promisify(execFile);

export async function verifyHypothesis(
  repositoryPath: string,
  hypothesis: InvestigationHypothesis,
): Promise<VerificationResult> {
  if (
    !hypothesis.statement
      .toLowerCase()
      .includes("database connection leak")
  ) {
    return {
      status: "not_run",
      method: "Fixture regression tests",
      details:
        "No verification strategy is currently defined for this hypothesis.",
    };
  }

  try {
    await execFileAsync("npm", ["test"], {
      cwd: repositoryPath,
    });

    return {
      status: "rejected",
      method: "Fixture regression tests",
      details:
        "The fixture tests passed, so the connection leak hypothesis was not reproduced.",
    };
  } catch (error) {
    const details =
      error instanceof Error
        ? error.message
        : String(error);

    return {
      status: "confirmed",
      method: "Fixture regression tests",
      details,
    };
  }
}
