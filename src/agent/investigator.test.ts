import assert from "node:assert/strict";
import { test } from "node:test";

import { investigateIncident } from "./investigator.js";

test("runs the complete incident investigation workflow", async () => {
  const report = await investigateIncident(
    "incidents/INC-001",
  );

  assert.equal(report.incidentId, "INC-001");

  assert.match(
    report.rootCause,
    /Database connection leak/,
  );

  assert.equal(
    report.location.file,
    "src/orders/service.ts",
  );

  assert.equal(
    report.location.function,
    "createOrder",
  );

  assert.equal(report.confidence, 0.9);

  assert.ok(report.evidence.length > 0);
});
