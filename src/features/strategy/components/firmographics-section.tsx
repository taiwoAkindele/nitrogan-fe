import { Building2, X } from "lucide-react";
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
  const unselectedIndustries = availableIndustries.filter(
    (i) => !industries.includes(i)
  );
  const unselectedGeographies = availableGeographies.filter(
    (g) => !geographies.includes(g)
  );

  return (
    <CollapsibleSection
      title="Firmographics"
      icon={Building2}
      defaultOpen
      contentClassName="space-y-5"
    >
      {/* Industry */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Industry
          </label>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <span
                key={industry}
                className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {industry}
                <button
                  type="button"
                  onClick={() => onRemoveIndustry(industry)}
                  className="text-primary hover:text-primary/70"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            {unselectedIndustries.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">
                  + Add
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {unselectedIndustries.map((industry) => (
                    <DropdownMenuItem
                      key={industry}
                      onClick={() => onAddIndustry(industry)}
                    >
                      {industry}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Geography */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Geography
          </label>
          <div className="flex flex-wrap gap-2">
            {geographies.map((geo) => (
              <span
                key={geo}
                className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {geo}
                <button
                  type="button"
                  onClick={() => onRemoveGeography(geo)}
                  className="text-primary hover:text-primary/70"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
            {unselectedGeographies.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/80">
                  + Add
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {unselectedGeographies.map((geo) => (
                    <DropdownMenuItem
                      key={geo}
                      onClick={() => onAddGeography(geo)}
                    >
                      {geo}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

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
