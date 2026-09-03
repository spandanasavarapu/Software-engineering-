// Lightweight NLP-style document classifier using weighted keyword matching.
// Simulates an ML text-classification pipeline without external model dependencies.

const CATEGORY_KEYWORDS = {
  Criminal: ['murder', 'theft', 'assault', 'fir', 'bail', 'accused', 'prosecution', 'crime', 'weapon', 'arrest', 'evidence', 'witness'],
  Civil: ['plaintiff', 'defendant', 'damages', 'injunction', 'breach', 'dispute', 'liability', 'negligence', 'compensation claim'],
  Family: ['divorce', 'custody', 'alimony', 'marriage', 'maintenance', 'adoption', 'domestic', 'spouse'],
  Property: ['land', 'property', 'lease', 'tenancy', 'title deed', 'possession', 'encroachment', 'eviction', 'mortgage'],
  Corporate: ['company', 'shareholder', 'merger', 'contract', 'corporate', 'board', 'insolvency', 'partnership', 'arbitration'],
  Constitutional: ['fundamental right', 'writ', 'constitution', 'public interest', 'article', 'habeas corpus', 'judicial review'],
  Tax: ['tax', 'gst', 'income tax', 'assessment', 'revenue', 'refund', 'duty', 'exemption'],
  Labor: ['employee', 'employer', 'wages', 'termination', 'union', 'labor', 'workplace', 'pf', 'gratuity']
};

function classifyDocument(text) {
  const lower = (text || '').toLowerCase();
  const scores = {};
  let total = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    keywords.forEach((kw) => {
      const matches = lower.split(kw).length - 1;
      score += matches;
    });
    scores[category] = score;
    total += score;
  }

  let bestCategory = 'Uncategorized';
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  const confidence = total > 0 ? Math.min(99, Math.round((bestScore / total) * 100)) : 0;
  return { category: bestCategory, confidence };
}

module.exports = { classifyDocument };
