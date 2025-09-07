import { env } from './env.js';

// Use REST endpoints directly to avoid SDK/ESM interop issues.

export async function embedTexts(texts: string[]) {
  const resp = await fetch('https://api.together.xyz/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    // Use a Together-supported embedding model. E.g., snowflake-arctic-embed-m
    body: JSON.stringify({ model: 'snowflake-arctic-embed-m', input: texts })
  });
  if (!resp.ok) throw new Error(`Embeddings failed: ${resp.status} ${await resp.text()}`);
  const data = await resp.json();
  return (data.data || []).map((d: any) => d.embedding as number[]);
}

export async function chatJSON(system: string, user: string, model = 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo') {
  const resp = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt: `${system}\n\nUSER:\n${user}\n\nASSISTANT:`,
      max_tokens: 800,
      temperature: 0.2
    })
  });
  if (!resp.ok) throw new Error(`Inference failed: ${resp.status} ${await resp.text()}`);
  const data: any = await resp.json();
  const content = data?.output?.choices?.[0]?.text ?? '{}';
  try { return JSON.parse(content); } catch { return { raw: content }; }
}

export async function chatText(system: string, user: string, model = 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo') {
  const resp = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      prompt: `${system}\n\nUSER:\n${user}\n\nASSISTANT:`,
      max_tokens: 800,
      temperature: 0.2
    })
  });
  if (!resp.ok) throw new Error(`Inference failed: ${resp.status} ${await resp.text()}`);
  const data: any = await resp.json();
  return data?.output?.choices?.[0]?.text ?? '';
}
