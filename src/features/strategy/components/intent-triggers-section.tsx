import { Sparkles, Banknote, UserPlus, Globe } from "lucide-react";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { IntentTrigger } from "../types";

interface IntentTriggersSectionProps {
  triggers: IntentTrigger[];
  selectedTriggerIds: Record<string, boolean>;
  onToggleTrigger: (triggerId: string) => void;
}

const TRIGGER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "recent-funding": Banknote,
  "hiring-spikes": UserPlus,
  "market-expansion": Globe,
};

export function IntentTriggersSection({
  triggers,
  selectedTriggerIds,
  onToggleTrigger,
}: IntentTriggersSectionProps) {
  return (
    <CollapsibleSection
      title="Intent Triggers"
      icon={Sparkles}
      defaultOpen
      contentClassName="space-y-3"
    >
      {triggers.map((trigger) => {
          const Icon = TRIGGER_ICONS[trigger.id] ?? Sparkles;
          const isChecked = selectedTriggerIds[trigger.id] ?? false;

          return (
            <label
              key={trigger.id}
              className="group/item flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-5 text-muted-foreground group-hover/item:text-primary" />
                <div>
                  <p className="text-sm font-medium">{trigger.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {trigger.description}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleTrigger(trigger.id)}
                className="size-5 rounded border-border bg-transparent accent-primary"
              />
            </label>
          );
        })}
    </CollapsibleSection>
  );
}
