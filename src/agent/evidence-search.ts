import { readTextFile } from "../lib/filesystem.js";
import { listRepositoryFiles } from "./repository-inspector.js";

export interface SearchMatch {
  file: string;
  line: number;
  content: string;
}

export async function searchRepository(
  repositoryPath: string,
  query: string,
): Promise<SearchMatch[]> {
  const files = await listRepositoryFiles(repositoryPath);
  const matches: SearchMatch[] = [];

  for (const file of files) {
    if (
      !file.path.endsWith(".ts") &&
      !file.path.endsWith(".js") &&
      !file.path.endsWith(".json") &&
      !file.path.endsWith(".md")
    ) {
      continue;
    }

    const content = await readTextFile(file.path);
    const lines = content.split("\n");

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];

      if (
        line !== undefined &&
        line.toLowerCase().includes(query.toLowerCase())
      ) {
        matches.push({
          file: file.path,
          line: index + 1,
          content: line.trim(),
        });
      }
    }
  }

  return matches;
}
