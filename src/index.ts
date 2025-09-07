import fs from 'fs';
import path from 'path';
import { routeFromCli, classifyDocType } from './agents/router.js';
import { extractFields } from './agents/extractor.js';
import { redactPII } from './agents/compliance.js';
import { answerQuestionAcrossDocs } from './agents/qa.js';

function readText(p: string) {
  return fs.readFileSync(p, 'utf-8');
}

async function runDemo() {
  // Lease extraction
  const leasePath = path.join('data','real_estate','lease_sample.txt');
  const lease = readText(leasePath);
  const leaseType = classifyDocType(lease);
  const leaseExtract = await extractFields(lease, leaseType as any);
  console.log("\n=== Lease Extraction ===");
  console.log(leaseExtract);

  // Policy redaction
  const policyPath = path.join('data','insurance','policy_sample.txt');
  const policy = readText(policyPath);
  const red = redactPII(policy);
  console.log("\n=== Policy Redaction ===");
  console.log(red);

  // Cross-doc QA
  const finPath = path.join('data','finance','statement_sample.txt');
  const fin = readText(finPath);
  const qa = await answerQuestionAcrossDocs("What is the policy expiration and the base rent per month?", [lease, policy, fin]);
  console.log("\n=== QA Across Docs ===");
  console.log(qa.answer);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'demo';

  if (cmd === 'demo') return runDemo();

  if (cmd === 'extract') {
    const file = args[1]; if (!file) throw new Error('Usage: extract <path-to-text-file>');
    const text = readText(file);
    const t = classifyDocType(text);
    const out = await extractFields(text, t as any);
    console.log(JSON.stringify({ docType: t, fields: out }, null, 2));
    return;
  }

  if (cmd === 'redact') {
    const file = args[1]; if (!file) throw new Error('Usage: redact <path-to-text-file>');
    const text = readText(file);
    const out = redactPII(text);
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  if (cmd === 'ask') {
    const q = args.slice(1).join(' ');
    if (!q) throw new Error('Usage: ask <question text>');
    // Gather all docs in data/
    const dirs = ['data/real_estate','data/insurance','data/finance'];
    const docs: string[] = [];
    for (const d of dirs) {
      if (!fs.existsSync(d)) continue;
      const files = fs.readdirSync(d).filter(f => f.endsWith('.txt'));
      for (const f of files) docs.push(readText(path.join(d, f)));
    }
    const out = await answerQuestionAcrossDocs(q, docs);
    console.log(out.answer);
    return;
  }

  console.log('Commands: demo | extract <file> | redact <file> | ask <question>');
}

main().catch(e => { console.error(e); process.exit(1); });
