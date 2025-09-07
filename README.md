# Multi-Agent Mini (Node + TogetherAI)

Minimal multi-agent workflow for document-heavy industries (Real Estate, Specialty Insurance, Financial Advisory).
Focus: **Extractor Agent**, **Compliance (Redaction) Agent**, **QA Agent (RAG)**, plus a tiny **router** + orchestrator.

Why this exists: lightweight demo that runs locally with a TogetherAI key.

## Features
- Parse plain text samples from `data/` (drop in your own `.txt` files).
- Extractor Agent: JSON key-field extraction by doc type (lease, policy, statement).
- Compliance Agent: regex PII redaction (emails, phones, SSN-like) with a reversible mask map.
- QA Agent: simple RAG (chunk → rank by token overlap → LLM answer with citations like `[c:docIdx#chunkIdx]`).
- Orchestrator: routes between `extract`, `redact`, `ask` intents.

## Quickstart
1) Install deps:
```bash
npm install
```
2) Set your TogetherAI API key:
```bash
# create .env from example
echo "TOGETHER_API_KEY=" > .env
# paste your key value after the equals
```
3) Run the demo (recommended: compiled JS):
```bash
npm run build
node dist/index.js demo
```
Or run directly with ts-node (ESM):
```bash
npx ts-node src/index.ts demo
```

## Add your own docs
Drop `.txt` files into `data/real_estate`, `data/insurance`, or `data/finance`.
Then run the demo again or call the CLI:
```bash
npx ts-node src/index.ts ask "What is the lease term?"
npx ts-node src/index.ts extract data/real_estate/lease_sample.txt
npx ts-node src/index.ts redact data/insurance/policy_sample.txt
```

## Notes
- Chat uses TogetherAI. QA ranking uses simple token overlap by default. You can enable embeddings later by choosing a supported embeddings model via Together's REST API.
- No DB everything is local for now
- Keep files short for speed. For PDFs, convert to `.txt` or wire a parser later.
