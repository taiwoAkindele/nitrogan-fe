import type { BuilderState, PredictionStats } from "../types";
import { AVAILABLE_GEOGRAPHIES, AVAILABLE_INDUSTRIES } from "./mock-data";

// Mock scoring so the Discovery prediction reacts to the ICP builder instead of
// showing frozen numbers. The model encodes the real trade-off of audience
// building: broader targeting raises reach; each requirement narrows it but
// raises confidence that the matches are genuinely high-intent.
const TOTAL_ADDRESSABLE = 4200; // monthly pool (mock)

// Picking any value in a dimension gives a baseline, scaling toward the full
// pool as more are selected. Zero selected → no audience in that dimension.
function coverage(selected: number, total: number): number {
  if (selected === 0) return 0;
  return Math.min(1, 0.3 + 0.7 * (selected / total));
}

export function computePrediction(state: BuilderState): PredictionStats {
  const industryCov = coverage(
    state.industries.length,
    AVAILABLE_INDUSTRIES.length
  );
  const geoCov = coverage(
    state.geographies.length,
    AVAILABLE_GEOGRAPHIES.length
  );

  const [min, max] = state.companySizeRange;
  const sizeCov = Math.min(1, Math.max(0.2, (max - min) / 950));

  const techCount = state.selectedTechIds.length;
  const triggerCount = Object.values(state.intentTriggers).filter(
    Boolean
  ).length;

  // Tech and triggers are requirements — each one a prospect must match, so
  // each narrows the reachable audience.
  const narrowing = Math.pow(0.85, techCount) * Math.pow(0.78, triggerCount);

  const reachPerMonth = Math.round(
    TOTAL_ADDRESSABLE * industryCov * geoCov * sizeCov * narrowing
  );

  const hasAudience = industryCov > 0 && geoCov > 0;

  // More intent signals → more confident the matches are high-intent.
  const confidence = hasAudience
    ? Math.min(97, 58 + triggerCount * 9 + techCount * 4)
    : 0;

  const velocity =
    reachPerMonth >= 150 ? "High" : reachPerMonth >= 60 ? "Medium" : "Low";

  const optimizationLabel =
    confidence >= 90
      ? "Peak Performance"
      : confidence >= 75
        ? "Strong"
        : confidence >= 60
          ? "Moderate"
          : "Building";

  return {
    confidence,
    velocity,
    reachPerMonth,
    leadsPerWeek: Math.round(reachPerMonth / 4),
    optimizationLabel,
  };
}
