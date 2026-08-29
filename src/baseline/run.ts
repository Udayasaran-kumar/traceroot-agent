import { loadIncident } from "../agent/incident-loader.js";
import { investigateBaseline } from "./investigator.js";

const incident = await loadIncident("incidents/INC-001");
const result = investigateBaseline(incident);

console.log(JSON.stringify(result, null, 2));
