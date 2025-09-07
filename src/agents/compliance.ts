const EMAIL=/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE=/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
const SSN=/(^|[^\d])(\d{3}-\d{2}-\d{4})(?!\d)/g;

export function redactPII(text: string) {
  let masked = text;
  const map: { type: string, value: string, mask: string, index: number }[] = [];
  masked = masked.replace(EMAIL, (m, offset) => { map.push({ type:'email', value:m, mask:'[REDACTED_EMAIL]', index:(offset??0)}); return '[REDACTED_EMAIL]'; });
  masked = masked.replace(PHONE, (m, offset) => { map.push({ type:'phone', value:m, mask:'[REDACTED_PHONE]', index:(offset??0)}); return '[REDACTED_PHONE]'; });
  masked = masked.replace(SSN, (m, pre, group, offset) => { map.push({ type:'ssn', value:group, mask:'[REDACTED_SSN]', index:(offset??0)}); return `${pre}[REDACTED_SSN]`; });
  return { masked, map };
}
