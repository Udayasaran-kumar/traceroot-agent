import assert from "node:assert/strict";
import { test } from "node:test";

import { inspectFileTool } from "./inspect-file.js";

test("inspects a repository file", async () => {
  const result = await inspectFileTool({
    repositoryPath: "incidents/INC-001/repository",
    filePath:
      "incidents/INC-001/repository/src/orders/service.ts",
  });

  assert.equal(
    result.path,
    "incidents/INC-001/repository/src/orders/service.ts",
  );

  assert.match(
    result.content,
    /pool\.connect/,
  );
});
