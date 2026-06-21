import type { BuilderState, TechItem, IntentTrigger } from "../types";
import { FirmographicsSection } from "./firmographics-section";
import { TechnographicsSection } from "./technographics-section";
import { IntentTriggersSection } from "./intent-triggers-section";

interface BuilderConfigPaneProps {
  state: BuilderState;
  availableIndustries: string[];
  availableGeographies: string[];
  techCatalog: TechItem[];
  intentTriggers: IntentTrigger[];
  onAddIndustry: (industry: string) => void;
  onRemoveIndustry: (industry: string) => void;
  onAddGeography: (geo: string) => void;
  onRemoveGeography: (geo: string) => void;
  onCompanySizeChange: (value: number) => void;
  onToggleTech: (techId: string) => void;
  onToggleTrigger: (triggerId: string) => void;
}

export function BuilderConfigPane({
  state,
  availableIndustries,
  availableGeographies,
  techCatalog,
  intentTriggers,
  onAddIndustry,
  onRemoveIndustry,
  onAddGeography,
  onRemoveGeography,
  onCompanySizeChange,
  onToggleTech,
  onToggleTrigger,
}: BuilderConfigPaneProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border p-6">
        <h1 className="text-xl font-bold">Lead Builder</h1>
        <p className="text-sm text-muted-foreground">
          Define your ideal customer profile (ICP)
        </p>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-4 overflow-y-auto p-4">
        <FirmographicsSection
          industries={state.industries}
          availableIndustries={availableIndustries}
          onAddIndustry={onAddIndustry}
          onRemoveIndustry={onRemoveIndustry}
          geographies={state.geographies}
          availableGeographies={availableGeographies}
          onAddGeography={onAddGeography}
          onRemoveGeography={onRemoveGeography}
          companySizeRange={state.companySizeRange}
          onCompanySizeChange={onCompanySizeChange}
        />

        <TechnographicsSection
          techCatalog={techCatalog}
          selectedTechIds={state.selectedTechIds}
          onToggleTech={onToggleTech}
        />

        <IntentTriggersSection
          triggers={intentTriggers}
          selectedTriggerIds={state.intentTriggers}
          onToggleTrigger={onToggleTrigger}
        />
      </div>
    </div>
  );
}
