import type { ComponentType, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  icon?: ComponentType<{ className?: string }>;
  /** Native `<details>` open state on first render. */
  defaultOpen?: boolean;
  children: ReactNode;
  /** Applied to the content wrapper (e.g. spacing between rows). */
  contentClassName?: string;
}

// Uses the native <details>/<summary> elements, which are keyboard- and
// screen-reader-accessible out of the box.
export function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  contentClassName,
}: CollapsibleSectionProps) {
  return (
    <details
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer items-center justify-between bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="size-5 text-primary" />}
          <span className="text-sm font-bold">{title}</span>
        </div>
        <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
      </summary>
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </details>
  );
}
