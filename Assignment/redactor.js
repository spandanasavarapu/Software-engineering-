// Rule-based sensitive-data redaction engine.
// Detects and masks common PII patterns before documents are stored/shared.

const PATTERNS = [
  { name: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'PHONE', regex: /(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g },
  { name: 'AADHAAR_SSN', regex: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b|\b\d{4}\s?\d{4}\s?\d{4}\b/g },
  { name: 'CREDIT_CARD', regex: /\b(?:\d[ -]*?){13,16}\b/g },
  { name: 'DOB', regex: /\b(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2,4}\b/g }
];

function redactText(text) {
  if (!text) return { redacted: '', hits: 0 };
  let redacted = text;
  let hits = 0;
  PATTERNS.forEach(({ name, regex }) => {
    redacted = redacted.replace(regex, () => {
      hits += 1;
      return `[REDACTED:${name}]`;
    });
  });
  return { redacted, hits };
}

module.exports = { redactText };
