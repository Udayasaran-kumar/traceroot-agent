import type { EvidenceItem } from "../domain/investigation.js";

export function deduplicateEvidence(
  evidence: EvidenceItem[],
): EvidenceItem[] {
  const seen = new Set<string>();
  const result: EvidenceItem[] = [];

  for (const item of evidence) {
    const key = `${item.source}\n${item.content}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(item);
  }

  return result;
}
