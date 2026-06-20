import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Prospect } from "../types";

const INTENT_TONES: Record<Prospect["intentLabel"], BadgeTone> = {
  High: "high",
  Medium: "medium",
  Low: "neutral",
};

interface ProspectCardProps {
  prospect: Prospect;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ProspectCard({
  prospect,
  isSelected,
  onSelect,
}: ProspectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(prospect.id)}
      className={cn(
        "relative block w-full border-b border-border p-4 text-left transition-colors",
        isSelected ? "bg-primary/5" : "hover:bg-muted/50"
      )}
    >
      {isSelected && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
      )}

      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            initials={prospect.companyInitial}
            size="md"
            shape="rounded"
            className={cn("text-white", prospect.avatarColor)}
          />
          <div>
            <h4 className="text-sm font-bold">{prospect.companyName}</h4>
            <p className="text-xs text-muted-foreground">
              {prospect.industry} &bull; {prospect.employeeRange}
            </p>
          </div>
        </div>
        <Badge tone={INTENT_TONES[prospect.intentLabel]} uppercase>
          {prospect.intentLabel === "High" ? "High Intent" : prospect.intentLabel}
        </Badge>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {prospect.signalSummary}
      </p>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
        <span>Signals: {prospect.signalCount} active</span>
        <span>{prospect.timestamp}</span>
      </div>
    </button>
  );
}
