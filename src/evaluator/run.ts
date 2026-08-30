import { evaluateIncident } from "./evaluator.js";

const result = await evaluateIncident(
  "incidents/INC-001",
);

console.log(
  JSON.stringify(result, null, 2),
);