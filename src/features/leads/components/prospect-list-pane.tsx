import type { ProspectDetail, ProspectStatus } from "../types";
import { ProspectCard } from "./prospect-card";

const TABS: { label: string; value: ProspectStatus }[] = [
  { label: "NEW", value: "new" },
  { label: "SAVED", value: "saved" },
  { label: "ACTIVE", value: "active" },
  { label: "ARCHIVE", value: "archive" },
];

interface ProspectListPaneProps {
  prospects: ProspectDetail[];
  activeTab: ProspectStatus;
  onTabChange: (tab: ProspectStatus) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ProspectListPane({
  prospects,
  activeTab,
  onTabChange,
  selectedId,
  onSelect,
}: ProspectListPaneProps) {
  const filtered = prospects.filter((p) => p.status === activeTab);

  return (
    <section className="flex w-[400px] flex-col border-r border-border bg-card">
      {/* Tab Bar */}
      <div className="flex border-b border-border">
        {TABS.map(({ label, value }) => {
          const count = prospects.filter((p) => p.status === value).length;
          const isActive = activeTab === value;
          return (
            <button
              key={value}
              onClick={() => onTabChange(value)}
              className={`flex-1 py-4 text-xs font-bold transition-colors ${
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Prospect List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No prospects in this tab
          </div>
        ) : (
          filtered.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              isSelected={selectedId === prospect.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  );
}
