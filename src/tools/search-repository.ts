import { searchRepository } from "../agent/evidence-search.js";

export interface SearchRepositoryInput {
  repositoryPath: string;
  query: string;
}

export async function searchRepositoryTool(
  input: SearchRepositoryInput,
) {
  return searchRepository(
    input.repositoryPath,
    input.query,
  );
}
