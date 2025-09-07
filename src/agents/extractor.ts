import { chatJSON } from '../utils/llm.js';

export async function extractFields(text: string, docType: 'lease'|'policy'|'statement'|'other') {
  const system = `Extract key fields from the document as JSON. Be concise.`;
  const schemas: Record<string, string> = {
    lease: `Return: { "property": string, "tenant": string, "landlord": string, "base_rent_per_month": string, "term_months": number, "start_date": string, "end_date": string, "escalation": string, "cam": string }`,
    policy: `Return: { "named_insured": string, "policy_number": string, "effective": string, "expiration": string, "coverage_limits": string, "exclusions": string }`,
    statement: `Return: { "client": string, "period": string, "holdings": { "us_equities": string, "international_equities": string, "fixed_income": string }, "notes": string }`,
    other: `Return: { "summary": string }`
  };
  const user = `${schemas[docType]}
---
DOCUMENT:
${text.slice(0, 4000)}`;
  return await chatJSON(system, user);
}
