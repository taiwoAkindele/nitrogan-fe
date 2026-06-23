"use client";

import { useState } from "react";
import { Building2, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

interface FirmographicsSectionProps {
  industries: string[];
  availableIndustries: string[];
  onAddIndustry: (industry: string) => void;
  onRemoveIndustry: (industry: string) => void;
  geographies: string[];
  availableGeographies: string[];
  onAddGeography: (geo: string) => void;
  onRemoveGeography: (geo: string) => void;
  companySizeRange: [number, number];
  onCompanySizeChange: (value: number) => void;
}

const MAX_RESULTS = 60;

/**
 * Chips for the selected values + a searchable "+ Add" dropdown. The lists are
 * now the real PDL taxonomy (~300 industries / many countries), so the picker
 * filters and caps results rather than rendering everything.
 */
function SearchablePicker({
  label,
  selected,
  available,
  onAdd,
  onRemove,
}: {
  label: string;
  selected: string[];
  available: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const unselected = available.filter((v) => !selected.includes(v));
  const filtered = (
    query
      ? unselected.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
      : unselected
  ).slice(0, MAX_RESULTS);

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {selected.map((value) => (
          <span
            key={value}
            className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize"
          >
            {value}
            <button
              type="button"
              onClick={() => onRemove(value)}
              className="text-primary hover:text-primary/70"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {unselected.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">
              + Add
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 w-64 overflow-y-auto">
              <div className="sticky top-0 bg-popover p-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  {/* stopPropagation so the menu's typeahead doesn't hijack typing */}
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    placeholder={`Search ${label.toLowerCase()}…`}
                    className="h-8 w-full rounded-md border border-border bg-background pl-7 pr-2 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>
              {filtered.length === 0 ? (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  No matches
                </p>
              ) : (
                filtered.map((value) => (
                  <DropdownMenuItem
                    key={value}
                    className="capitalize"
                    onClick={() => {
                      onAdd(value);
                      setQuery("");
                    }}
                  >
                    {value}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export function FirmographicsSection({
  industries,
  availableIndustries,
  onAddIndustry,
  onRemoveIndustry,
  geographies,
  availableGeographies,
  onAddGeography,
  onRemoveGeography,
  companySizeRange,
  onCompanySizeChange,
}: FirmographicsSectionProps) {
  return (
    <CollapsibleSection
      title="Firmographics"
      icon={Building2}
      defaultOpen
      contentClassName="space-y-5"
    >
      <SearchablePicker
        label="Industry"
        selected={industries}
        available={availableIndustries}
        onAdd={onAddIndustry}
        onRemove={onRemoveIndustry}
      />

      <SearchablePicker
        label="Geography"
        selected={geographies}
        available={availableGeographies}
        onAdd={onAddGeography}
        onRemove={onRemoveGeography}
      />

      {/* Company Size */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Company Size
          </label>
          <span className="font-mono text-xs text-primary">
            {companySizeRange[0]} - {companySizeRange[1]} employees
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={1000}
          value={companySizeRange[1]}
          onChange={(e) => onCompanySizeChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
        />
        <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
          <span>Solo</span>
          <span>Enterprise 500+</span>
        </div>
      </div>
    </CollapsibleSection>
  );
}
