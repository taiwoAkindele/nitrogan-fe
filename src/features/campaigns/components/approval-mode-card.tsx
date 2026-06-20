import { UserCheck, Zap, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ApprovalMode } from "../types";

interface ApprovalModeCardProps {
  mode: ApprovalMode;
  onChange: (mode: ApprovalMode) => void;
}

const OPTIONS: {
  value: ApprovalMode;
  icon: typeof UserCheck;
  title: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    value: "manual",
    icon: UserCheck,
    title: "Review before send",
    description: "Every message waits in your approval queue. Nothing goes out without a human sign-off.",
    recommended: true,
  },
  {
    value: "auto",
    icon: Zap,
    title: "Auto-send",
    description: "Messages send on schedule without review. Faster, but no safety net on tone or targeting.",
  },
];

// The core safety control. Defaults to `manual` everywhere it's instantiated.
export function ApprovalModeCard({ mode, onChange }: ApprovalModeCardProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value, icon: Icon, title, description, recommended }) => {
          const selected = mode === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className={cn(
                    "size-5",
                    selected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {recommended && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-foreground">{title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </button>
          );
        })}
      </div>

      {mode === "auto" && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-600">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs leading-relaxed">
            Auto-send skips human review. Messages will be delivered to real
            prospects on schedule — double-check your sequence and targeting first.
          </p>
        </div>
      )}
    </div>
  );
}
