import assert from "node:assert/strict";
import test from "node:test";

import { listRepositoryFiles } from "./repository-inspector.js";

test("lists repository files while ignoring generated dependencies", async () => {
  const files = await listRepositoryFiles(
    "incidents/INC-001/repository",
  );

  const paths = files.map((file) => file.path);

  assert.ok(
    paths.some((path) =>
      path.endsWith("src/orders/service.ts"),
    ),
  );

  assert.ok(
    paths.some((path) =>
      path.endsWith("src/db/pool.ts"),
    ),
  );

  assert.ok(
    paths.some((path) =>
      path.endsWith("tests/orders.test.ts"),
    ),
  );

  assert.ok(
    !paths.some((path) =>
      path.includes("node_modules"),
    ),
  );
});
