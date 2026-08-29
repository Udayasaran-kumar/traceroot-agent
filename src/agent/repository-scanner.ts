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

  async function walk(currentPath: string): Promise<void> {
    const entries = await readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".git"
      ) {
        continue;
      }

      const fullPath = join(currentPath, entry.name);

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
