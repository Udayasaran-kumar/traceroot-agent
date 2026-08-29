import { inspectRepositoryFile } from "../agent/repository-inspector.js";

export interface InspectFileInput {
  repositoryPath: string;
  filePath: string;
}

export async function inspectFileTool(
  input: InspectFileInput,
) {
  return inspectRepositoryFile(
    input.repositoryPath,
    input.filePath,
  );
}
