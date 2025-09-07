export function chunkText(text: string, chunkSize = 1200, overlap = 150) {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + chunkSize);
    chunks.push(text.slice(i, end));
    if (end === text.length) break;
    i = end - overlap;
    if (i < 0) i = 0;
  }
  return chunks;
}

export function cosineSim(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i=0; i<a.length; i++) {
    dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i];
  }
  const denom = Math.sqrt(na)*Math.sqrt(nb) || 1;
  return dot/denom;
}
