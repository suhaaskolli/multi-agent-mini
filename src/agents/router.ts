export type Intent = 'extract' | 'redact' | 'ask';

export function routeFromCli(args: string[]): Intent {
  const [intent] = args;
  if (intent === 'extract' || intent === 'redact' || intent === 'ask') return intent;
  return 'ask';
}

export function classifyDocType(text: string): 'lease' | 'policy' | 'statement' | 'other' {
  const t = text.toLowerCase();
  if (t.includes('lease') || t.includes('landlord') || t.includes('rent')) return 'lease';
  if (t.includes('policy') || t.includes('coverage') || t.includes('endorsement') || t.includes('exclusions')) return 'policy';
  if (t.includes('statement') || t.includes('holdings') || t.includes('portfolio')) return 'statement';
  return 'other';
}
