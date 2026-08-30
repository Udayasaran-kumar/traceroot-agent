import { loadIncident } from "./incident-loader.js";
import { collectEvidence } from "./evidence-collector.js";
import { createInvestigationState } from "./investigation-state.js";
import { runInvestigationLoop } from "./investigation-loop.js";

async function main(): Promise<void> {
  const incidentDirectory =
    process.argv[2] ?? "incidents/INC-001";

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

  const result = await runInvestigationLoop(
    initialState,
    {
      maxSteps: 10,
    },
  );

  console.log(
    JSON.stringify(result, null, 2),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
