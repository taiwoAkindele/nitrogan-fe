"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "@/lib/tenant/context";
import {
  AVAILABLE_INDUSTRIES,
  AVAILABLE_GEOGRAPHIES,
  TECH_CATALOG,
  INTENT_TRIGGER_OPTIONS,
  MOCK_SAMPLE_LEADS,
} from "../utils/mock-data";
import { buildIcpSummary } from "../utils/icp-summary";
import { computePrediction } from "../utils/prediction";
import { useLeadBuilderState } from "../hooks/use-lead-builder-state";
import { BuilderConfigPane } from "./builder-config-pane";
import { PredictorPanel } from "./predictor-panel";

export function LeadBuilder() {
  const router = useRouter();
  const { tenantId } = useTenant();
  // Mobile only (<lg): build the ICP first, then step to the prediction + actions.
  const [step, setStep] = useState<"build" | "preview">("build");
  const {
    state,
    addIndustry,
    removeIndustry,
    addGeography,
    removeGeography,
    setCompanySize,
    toggleTech,
    toggleTrigger,
    refreshSample,
  } = useLeadBuilderState();

  // Recomputes whenever the ICP changes, so the prediction is genuinely live.
  const prediction = useMemo(() => computePrediction(state), [state]);

  // No targeting dimensions → no audience, so the sample preview is empty too.
  const hasAudience =
    state.industries.length > 0 && state.geographies.length > 0;
  const sampleLeads = hasAudience ? MOCK_SAMPLE_LEADS : [];

  // Hand the built audience off to a new draft campaign (Discover → Act).
  const handleCreateCampaign = () => {
    const icp = buildIcpSummary(state, TECH_CATALOG);
    router.push(
      `/org/${tenantId}/campaigns/new?icp=${encodeURIComponent(icp)}`
    );
  };

  return (
    // lg+: two independently-scrolling columns. Below lg: one scrolling column.
    <div className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {/* Step 1 (Build) — full width below lg, fixed 420px scroll column at lg.
          On mobile this is hidden once the user steps to the preview. */}
      <aside
        className={cn(
          "w-full flex-col border-b border-border lg:flex lg:w-[420px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0",
          step === "build" ? "flex" : "hidden"
        )}
      >
        <BuilderConfigPane
          state={state}
          availableIndustries={AVAILABLE_INDUSTRIES}
          availableGeographies={AVAILABLE_GEOGRAPHIES}
          techCatalog={TECH_CATALOG}
          intentTriggers={INTENT_TRIGGER_OPTIONS}
          onAddIndustry={addIndustry}
          onRemoveIndustry={removeIndustry}
          onAddGeography={addGeography}
          onRemoveGeography={removeGeography}
          onCompanySizeChange={setCompanySize}
          onToggleTech={toggleTech}
          onToggleTrigger={toggleTrigger}
        />

        {/* Mobile: proceed to the prediction */}
        <div className="sticky bottom-0 z-10 border-t border-border bg-card p-4 lg:hidden">
          <Button
            className="h-11 w-full gap-2 font-bold"
            onClick={() => setStep("preview")}
          >
            Next: Preview
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </aside>

      {/* Step 2 (Preview) — the live prediction + actions. Hidden on mobile
          until the user steps over from the builder. */}
      <section
        className={cn(
          "relative flex-1 flex-col lg:flex lg:overflow-hidden",
          step === "preview" ? "flex" : "hidden"
        )}
      >
        {/* Mobile: back to the builder */}
        <button
          type="button"
          onClick={() => setStep("build")}
          className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
          Edit audience
        </button>

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute right-10 top-10 size-96 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-10 left-10 size-64 rounded-full bg-primary blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 p-4 md:p-8 lg:overflow-y-auto">
          <PredictorPanel
            prediction={prediction}
            sampleLeads={sampleLeads}
            onRefreshSample={refreshSample}
          />
        </div>

        {/* Footer Action Bar — sticky to the viewport bottom on mobile */}
        <footer className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-card px-4 py-3 md:px-8 md:py-4 lg:static">
          <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Live estimate</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="outline" className="font-bold">
              Save as Draft
            </Button>
            <Button
              className="gap-2 font-bold shadow-lg shadow-primary/30"
              onClick={handleCreateCampaign}
            >
              Create Campaign
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
