import { useState } from "react";
import { Terminal, Search, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import type { TechItem } from "../types";

interface TechnographicsSectionProps {
  techCatalog: TechItem[];
  selectedTechIds: string[];
  onToggleTech: (techId: string) => void;
}

export function TechnographicsSection({
  techCatalog,
  selectedTechIds,
  onToggleTech,
}: TechnographicsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTech = techCatalog.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CollapsibleSection
      title="Technographics"
      icon={Terminal}
      defaultOpen
      contentClassName="space-y-4"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search software library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-60 space-y-2 overflow-y-auto">
          {filteredTech.map((item) => {
            const isSelected = selectedTechIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleTech(item.id)}
                className={`flex w-full items-center justify-between rounded-lg border p-2 transition-all ${
                  isSelected
                    ? "border-primary/20 bg-primary/5"
                    : "border-transparent hover:border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={item.name}
                    size="sm"
                    shape="square"
                    className="border border-border bg-card p-1.5 text-muted-foreground"
                  />
                  <div className="text-left">
                    <p
                      className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`text-[10px] ${isSelected ? "text-primary/70" : "text-muted-foreground"}`}
                    >
                      {item.category}
                    </p>
                  </div>
                </div>
                {isSelected ? (
                  <Check className="size-5 text-primary" />
                ) : (
                  <Plus className="size-5 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
    </CollapsibleSection>
  );
}
