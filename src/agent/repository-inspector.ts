import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

import { readTextFile } from "../lib/filesystem.js";

export interface RepositoryFile {
  path: string;
  size: number;
}

export interface InspectedFile {
  path: string;
  content: string;
}

export async function listRepositoryFiles(
  repositoryPath: string,
): Promise<RepositoryFile[]> {
  const results: RepositoryFile[] = [];

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".git"
        ) {
          continue;
        }

        await walk(fullPath);
      }

      if (entry.isFile()) {
        const fileStats = await stat(fullPath);

        results.push({
          path: fullPath,
          size: fileStats.size,
        });
      }
    }
  }

  await walk(repositoryPath);

  return results.sort((a, b) =>
    a.path.localeCompare(b.path),
  );
}

export async function inspectRepositoryFile(
  repositoryPath: string,
  filePath: string,
): Promise<InspectedFile> {
  const content = await readTextFile(filePath);

  return {
    path: filePath,
    content,
  };
}
