import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { loadIncident } from "./incident-loader.js";

const incidentDirectory = resolve(
  "incidents/INC-001",
);

test("loads incident metadata and evidence", async () => {
  const incident = await loadIncident(
    incidentDirectory,
  );

  assert.equal(incident.id, "INC-001");
  assert.equal(
    incident.title,
    "Orders API Production Incident",
  );
  assert.equal(incident.category, "database");

  assert.match(
    incident.evidence.incidentReport,
    /Orders API/,
  );

  assert.equal(
    incident.evidence.logs.length,
    1,
  );

  assert.match(
    incident.evidence.logs[0] ?? "",
    /Connection pool exhausted/,
  );

  assert.match(
    incident.evidence.stackTrace ?? "",
    /ConnectionPool\.connect/,
  );

  assert.ok(
    incident.repositoryPath.endsWith(
      "incidents/INC-001/repository",
    ),
  );
});
