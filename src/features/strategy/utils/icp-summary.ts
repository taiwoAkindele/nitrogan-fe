import type { BuilderState, TechItem } from "../types";

// Collapses the ICP builder state into a single human-readable line, e.g.
// "Fintech, Logistics · Nigeria, Kenya · 50–500 employees · WhatsApp API · 1 intent trigger".
// This is the audience hand-off from Discover → Act: it seeds a draft campaign.
export function buildIcpSummary(
  state: BuilderState,
  techCatalog: TechItem[]
): string {
  const parts: string[] = [];

  parts.push(
    state.industries.length ? state.industries.join(", ") : "Any industry"
  );
  parts.push(
    state.geographies.length ? state.geographies.join(", ") : "Global"
  );

  const [min, max] = state.companySizeRange;
  parts.push(`${min}–${max} employees`);

  const techNames = state.selectedTechIds
    .map((id) => techCatalog.find((t) => t.id === id)?.name)
    .filter((name): name is string => Boolean(name));
  if (techNames.length) {
    parts.push(techNames.join(", "));
  }

  const triggerCount = Object.values(state.intentTriggers).filter(
    Boolean
  ).length;
  if (triggerCount) {
    parts.push(`${triggerCount} intent trigger${triggerCount > 1 ? "s" : ""}`);
  }

  return parts.join(" · ");
}
