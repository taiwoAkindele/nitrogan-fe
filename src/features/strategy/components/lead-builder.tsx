"use client";

import { Shield, Clock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AVAILABLE_INDUSTRIES,
  AVAILABLE_GEOGRAPHIES,
  TECH_CATALOG,
  INTENT_TRIGGER_OPTIONS,
  MOCK_SAMPLE_LEADS,
  MOCK_PREDICTION,
} from "../utils/mock-data";
import { useLeadBuilderState } from "../hooks/use-lead-builder-state";
import { BuilderConfigPane } from "./builder-config-pane";
import { PredictorPanel } from "./predictor-panel";

export function LeadBuilder() {
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

  return (
    <div className="flex h-full">
      {/* Left Column: Configuration */}
      <aside className="flex w-[420px] shrink-0 flex-col border-r border-border">
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
      </aside>

      {/* Right Column: Results & Predictor */}
      <section className="relative flex flex-1 flex-col overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute right-10 top-10 size-96 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-10 left-10 size-64 rounded-full bg-primary blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto p-8">
          <PredictorPanel
            prediction={MOCK_PREDICTION}
            sampleLeads={MOCK_SAMPLE_LEADS}
            onRefreshSample={refreshSample}
          />
        </div>

        {/* Footer Action Bar */}
        <footer className="relative z-10 flex items-center justify-between border-t border-border bg-card px-8 py-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>Updated 2m ago</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="font-bold">
              Save as Draft
            </Button>
            <Button className="gap-2 font-bold shadow-lg shadow-primary/30">
              Launch Campaign
              <Rocket className="size-4" />
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
