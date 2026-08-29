import { investigateIncident } from "./investigator.js";

const report = await investigateIncident(
  "incidents/INC-001",
);

console.log(
  JSON.stringify(report, null, 2),
);
