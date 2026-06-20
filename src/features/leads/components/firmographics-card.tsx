import { cn } from "@/lib/utils";
import type { Firmographic } from "../types";

interface FirmographicsCardProps {
  firmographics: Firmographic[];
}

export function FirmographicsCard({ firmographics }: FirmographicsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Firmographics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {firmographics.map((item) => (
          <div key={item.label} className="rounded-lg bg-muted/50 p-3">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">
              {item.label}
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                item.highlight && "text-green-500"
              )}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
