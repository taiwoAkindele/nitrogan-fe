import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

/** A labeled stat (label over value). Container/typography vary via className. */
export function Metric({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: MetricProps) {
  return (
    <div className={className}>
      <p className={cn("text-[10px] text-muted-foreground", labelClassName)}>
        {label}
      </p>
      <p className={cn("font-bold", valueClassName)}>{value}</p>
    </div>
  );
}
