import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { createInvestigationState } from "./investigation-state.js";
import { runInvestigationLoop } from "./investigation-loop.js";

function printHeader(): void {
  console.log("");
  console.log("============================================");
  console.log("             TRACEROOT AGENT");
  console.log("     Evidence-Driven Incident Solver");
  console.log("============================================");
  console.log("");
}

function printStep(
  number: number,
  message: string,
): void {
  console.log(`[${number}] ${message}`);
}

function printResult(
  result: Awaited<ReturnType<typeof runInvestigationLoop>>,
): void {
  console.log("");
  console.log("--------------------------------------------");
  console.log("INVESTIGATION RESULT");
  console.log("--------------------------------------------");

  console.log(`Incident       : ${result.incidentId}`);
  console.log(`Status         : ${result.status}`);
  console.log(`Evidence items : ${result.evidence.length}`);
  console.log(`Hypotheses     : ${result.hypotheses.length}`);
  console.log(`Tool actions   : ${result.actions.length}`);

  console.log("");
  console.log("Hypotheses:");

  for (const hypothesis of result.hypotheses) {
    console.log(
      `  - ${hypothesis.statement} (${Math.round(
        hypothesis.confidence * 100,
      )}%)`,
    );
  }

  if (result.verification) {
    console.log("");
    console.log("Verification:");
    console.log(
      `  ${result.verification.status}${
        result.verification.method
          ? ` via ${result.verification.method}`
          : ""
      }`,
    );
  }

  if (result.report) {
    console.log("");
    console.log("✓ ROOT CAUSE CONFIRMED");
    console.log("");
    console.log(
      `Root cause   : ${result.report.rootCause}`,
    );
    console.log(
      `Location     : ${result.report.location.file}`,
    );

    if (result.report.location.function) {
      console.log(
        `Function     : ${result.report.location.function}`,
      );
    }

    console.log(
      `Confidence   : ${Math.round(
        result.report.confidence * 100,
      )}%`,
    );

    console.log("");
    console.log("Mechanism:");
    console.log(`  ${result.report.mechanism}`);

    console.log("");
    console.log("Causal chain:");

    result.report.causalChain.forEach(
      (step, index) => {
        console.log(`  ${index + 1}. ${step}`);
      },
    );

    console.log("");
    console.log("Remediation:");
    console.log(`  ${result.report.remediation}`);
  }

  console.log("");
  console.log("Agent action trace:");

  result.actions.forEach((action, index) => {
    console.log(
      `  ${index + 1}. ${action.tool}`,
    );
  });

  console.log("");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const jsonOutput = args.includes("--json");

  const incidentDirectory =
    args.find((arg) => !arg.startsWith("--")) ??
    "incidents/INC-001";

  const incident = await loadIncident(
    incidentDirectory,
  );

  const evidence = await collectEvidence(
    incident,
  );

  const initialState = {
    ...createInvestigationState(
      incident.id,
      incident.repositoryPath,
    ),
    evidence,
  };

  if (!jsonOutput) {
    printHeader();

    printStep(
      1,
      `Loaded incident ${incident.id}`,
    );

    printStep(
      2,
      `Collected ${evidence.length} evidence item(s)`,
    );

    printStep(
      3,
      "Running objective-driven investigation loop",
    );
  }

  const result = await runInvestigationLoop(
    initialState,
    {
      maxSteps: 10,
    },
  );

  if (jsonOutput) {
    console.log(
      JSON.stringify(result, null, 2),
    );
    return;
  }

  printStep(
    4,
    `Investigation completed with status: ${result.status}`,
  );

  printResult(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
