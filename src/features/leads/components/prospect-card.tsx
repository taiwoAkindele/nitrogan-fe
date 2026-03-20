import type { Prospect } from "../types";

const INTENT_STYLES: Record<string, string> = {
  High: "bg-green-500/10 text-green-500",
  Medium: "bg-yellow-500/10 text-yellow-600",
  Low: "bg-muted text-muted-foreground",
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
    <div
      onClick={() => onSelect(prospect.id)}
      className={`relative cursor-pointer border-b border-border p-4 transition-colors ${
        isSelected
          ? "bg-primary/5"
          : "hover:bg-muted/50"
      }`}
    >
      {isSelected && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
      )}

      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-lg text-sm font-bold text-white ${prospect.avatarColor}`}
          >
            {prospect.companyInitial}
          </div>
          <div>
            <h4 className="text-sm font-bold">{prospect.companyName}</h4>
            <p className="text-xs text-muted-foreground">
              {prospect.industry} &bull; {prospect.employeeRange}
            </p>
          </div>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${INTENT_STYLES[prospect.intentLabel]}`}
        >
          {prospect.intentLabel === "High" ? "High Intent" : prospect.intentLabel}
        </span>
      </div>

      <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
        {prospect.signalSummary}
      </p>

      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
        <span>Signals: {prospect.signalCount} active</span>
        <span>{prospect.timestamp}</span>
      </div>
    </div>
  );
}
