import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

export interface RepositoryFile {
  path: string;
  size: number;
}

export async function listRepositoryFiles(
  repositoryPath: string,
): Promise<RepositoryFile[]> {
  const results: RepositoryFile[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = join(directory, entry.name);

      if (entry.name === "node_modules") {
        continue;
      }

      if (entry.name === "dist") {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
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
