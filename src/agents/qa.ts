import { chunkText } from '../utils/chunk.js';
import { chatText } from '../utils/llm.js';

type ChunkRef = { text: string, docIdx: number, chunkIdx: number };

export async function answerQuestionAcrossDocs(question: string, docs: string[]) {
  // Build corpus
  const corpus: ChunkRef[] = [];
  docs.forEach((txt, di) => {
    const chunks = chunkText(txt);
    chunks.forEach((c, ci) => corpus.push({ text: c, docIdx: di, chunkIdx: ci }));
  });

  // Rank using simple token overlap to avoid embedding dependency
  const qTokens = question.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const scored = corpus.map((c, i) => {
    const t = c.text.toLowerCase();
    let score = 0;
    for (const qt of qTokens) {
      const matches = t.match(new RegExp(`\\b${qt}\\b`, 'g'));
      score += matches ? matches.length : 0;
    }
    score = score / Math.max(50, c.text.length);
    return { i, score };
  }).sort((a, b) => b.score - a.score).slice(0, 8);

  const top = scored.map((s: { i: number, score: number }) => corpus[s.i]);
  const ctx = top.map((c: ChunkRef, i: number) => `# C${i+1} [c:${c.docIdx}#${c.chunkIdx}]\n${c.text}`).join("\n\n");

  const system = "Answer using ONLY the provided context. Include the citation tags like [c:doc#chunk] inline when stating facts.";
  const user = `Question: ${question}\n\nContext:\n${ctx}`;
  const answer = await chatText(system, user);
  return { answer, top };
}
