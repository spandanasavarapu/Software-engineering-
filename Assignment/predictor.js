// Heuristic case-timeline predictor.
// Estimates resolution time using case type baselines, priority weighting,
// and current judicial workload as a proxy for court congestion.

const BASE_DAYS = {
  Criminal: 180,
  Civil: 150,
  Family: 90,
  Property: 200,
  Corporate: 160,
  Constitutional: 240,
  Tax: 120,
  Labor: 100
};

const PRIORITY_MULTIPLIER = {
  urgent: 0.6,
  high: 0.8,
  medium: 1.0,
  low: 1.3
};

function predictCompletionDate({ caseType, priority, filedDate, judgeActiveCaseCount = 0 }) {
  const base = BASE_DAYS[caseType] || 150;
  const priorityFactor = PRIORITY_MULTIPLIER[priority] || 1.0;
  const workloadFactor = 1 + Math.min(judgeActiveCaseCount, 30) * 0.015; // congestion effect, capped
  const estimatedDays = Math.round(base * priorityFactor * workloadFactor);

  const filed = new Date(filedDate);
  const predicted = new Date(filed);
  predicted.setDate(predicted.getDate() + estimatedDays);

  return {
    estimatedDays,
    predictedDate: predicted.toISOString().split('T')[0]
  };
}

module.exports = { predictCompletionDate };
