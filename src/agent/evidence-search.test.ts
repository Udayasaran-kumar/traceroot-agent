import assert from "node:assert/strict";
import test from "node:test";

import { searchRepository } from "./evidence-search.js";

test("finds database connection acquisition in the repository", async () => {
  const matches = await searchRepository(
    "incidents/INC-001/repository",
    "pool.connect",
  );

  assert.ok(matches.length > 0);

  assert.ok(
    matches.some((match) =>
      match.file.endsWith("src/orders/service.ts"),
    ),
  );
});

test("finds connection pool release implementation", async () => {
  const matches = await searchRepository(
    "incidents/INC-001/repository",
    "release",
  );

  assert.ok(matches.length > 0);

  assert.ok(
    matches.some((match) =>
      match.file.endsWith("src/db/pool.ts"),
    ),
  );
});
