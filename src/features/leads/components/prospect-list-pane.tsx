import { useMemo, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

import { TabBar, type TabItem } from "@/components/ui/tab-bar";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type {
  IntentLabel,
  ProspectDetail,
  ProspectStatus,
} from "../types";
import { ProspectCard } from "./prospect-card";

const TABS: { label: string; value: ProspectStatus }[] = [
  { label: "NEW", value: "new" },
  { label: "SAVED", value: "saved" },
  { label: "ACTIVE", value: "active" },
  { label: "ARCHIVE", value: "archive" },
];

type SortKey = "intent" | "signals" | "company";

const SORTERS: Record<
  SortKey,
  (a: ProspectDetail, b: ProspectDetail) => number
> = {
  intent: (a, b) => b.intentScore - a.intentScore,
  signals: (a, b) => b.signalCount - a.signalCount,
  company: (a, b) => a.companyName.localeCompare(b.companyName),
};

const SORT_LABELS: Record<SortKey, string> = {
  intent: "Highest intent",
  signals: "Most signals",
  company: "Company A–Z",
};

const INTENT_FILTERS: ("all" | IntentLabel)[] = ["all", "High", "Medium", "Low"];

// Bulk destinations exclude the obvious no-ops; "new" isn't a manual move target.
const BULK_ACTIONS: { label: string; status: ProspectStatus }[] = [
  { label: "Save", status: "saved" },
  { label: "Active", status: "active" },
  { label: "Archive", status: "archive" },
];

interface ProspectListPaneProps {
  prospects: ProspectDetail[];
  activeTab: ProspectStatus;
  onTabChange: (tab: ProspectStatus) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBulkStatusChange: (ids: string[], status: ProspectStatus) => void;
}

export function ProspectListPane({
  prospects,
  activeTab,
  onTabChange,
  selectedId,
  onSelect,
  onBulkStatusChange,
}: ProspectListPaneProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("intent");
  const [intentFilter, setIntentFilter] = useState<"all" | IntentLabel>("all");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const tabs: TabItem<ProspectStatus>[] = TABS.map(({ label, value }) => ({
    value,
    label,
    count: prospects.filter((p) => p.status === value).length,
  }));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prospects
      .filter((p) => p.status === activeTab)
      .filter((p) => (intentFilter === "all" ? true : p.intentLabel === intentFilter))
      .filter(
        (p) =>
          !q ||
          p.companyName.toLowerCase().includes(q) ||
          p.industry.toLowerCase().includes(q)
      )
      .sort(SORTERS[sortKey]);
  }, [prospects, activeTab, intentFilter, query, sortKey]);

  // Switching tabs starts a fresh selection — bulk-moving across tabs is confusing.
  const handleTabChange = (tab: ProspectStatus) => {
    setCheckedIds(new Set());
    onTabChange(tab);
  };

  const toggleChecked = (id: string) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const allVisibleChecked =
    visible.length > 0 && visible.every((p) => checkedIds.has(p.id));

  const toggleSelectAll = () =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleChecked) {
        visible.forEach((p) => next.delete(p.id));
      } else {
        visible.forEach((p) => next.add(p.id));
      }
      return next;
    });

  const runBulk = (status: ProspectStatus) => {
    onBulkStatusChange([...checkedIds], status);
    setCheckedIds(new Set());
  };

  return (
    <section className="flex h-full w-full flex-col border-r border-border bg-card">
      <TabBar
        variant="segmented"
        tabs={tabs}
        value={activeTab}
        onChange={handleTabChange}
      />

      {/* Search + sort + filter */}
      <div className="space-y-2 border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company or industry…"
            className="h-9 pl-8"
          />
        </div>
        <div className="flex gap-2">
          <ToolbarSelect
            label="Sort by"
            value={sortKey}
            onChange={(v) => setSortKey(v as SortKey)}
            options={(Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({
              value: k,
              label: SORT_LABELS[k],
            }))}
          />
          <ToolbarSelect
            label="Intent"
            value={intentFilter}
            onChange={(v) => setIntentFilter(v as "all" | IntentLabel)}
            options={INTENT_FILTERS.map((f) => ({
              value: f,
              label: f === "all" ? "All intent" : `${f} intent`,
            }))}
          />
        </div>
      </div>

      {/* Selection / bulk bar */}
      {checkedIds.size > 0 ? (
        <div className="flex items-center gap-2 border-b border-border bg-primary/5 px-3 py-2">
          <span className="text-xs font-bold">{checkedIds.size} selected</span>
          <div className="ml-auto flex items-center gap-1">
            {BULK_ACTIONS.map((action) => (
              <button
                key={action.status}
                type="button"
                onClick={() => runBulk(action.status)}
                className="rounded-md px-2 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
              >
                {action.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCheckedIds(new Set())}
              aria-label="Clear selection"
              className="ml-1 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        visible.length > 0 && (
          <label className="flex cursor-pointer items-center justify-between border-b border-border px-3 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allVisibleChecked}
                onChange={toggleSelectAll}
                className="size-4 accent-primary"
              />
              Select all
            </span>
            <span>{visible.length} shown</span>
          </label>
        )
      )}

      {/* Prospect list */}
      <div className="flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <EmptyState>
            {query || intentFilter !== "all"
              ? "No prospects match your filters"
              : "No prospects in this tab"}
          </EmptyState>
        ) : (
          visible.map((prospect) => (
            <div key={prospect.id} className="flex items-stretch">
              <label className="flex cursor-pointer items-center border-b border-border pl-3 pr-1">
                <input
                  type="checkbox"
                  checked={checkedIds.has(prospect.id)}
                  onChange={() => toggleChecked(prospect.id)}
                  aria-label={`Select ${prospect.companyName}`}
                  className="size-4 accent-primary"
                />
              </label>
              <div className="min-w-0 flex-1">
                <ProspectCard
                  prospect={prospect}
                  isSelected={selectedId === prospect.id}
                  onSelect={onSelect}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Themed dropdown instead of a native <select> — native option lists can't be
// styled and render unreadable against the app's popover theme.
function ToolbarSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        className="flex h-9 flex-1 items-center justify-between gap-1 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="truncate">{current}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
