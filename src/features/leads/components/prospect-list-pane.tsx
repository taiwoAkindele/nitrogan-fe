import { TabBar, type TabItem } from "@/components/ui/tab-bar";
import { EmptyState } from "@/components/ui/empty-state";
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

  const tabs: TabItem<ProspectStatus>[] = TABS.map(({ label, value }) => ({
    value,
    label,
    count: prospects.filter((p) => p.status === value).length,
  }));

  return (
    <section className="flex w-[400px] flex-col border-r border-border bg-card">
      <TabBar
        variant="segmented"
        tabs={tabs}
        value={activeTab}
        onChange={onTabChange}
      />

      {/* Prospect List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState>No prospects in this tab</EmptyState>
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
