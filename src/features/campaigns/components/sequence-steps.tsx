import { Mail, Linkedin, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SequenceChannel, SequenceStep } from "../types";

const CHANNEL_META: Record<
  SequenceChannel,
  { icon: typeof Mail; label: string }
> = {
  email: { icon: Mail, label: "Email" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
};

interface SequenceStepsProps {
  steps: SequenceStep[];
}

export function SequenceSteps({ steps }: SequenceStepsProps) {
  return (
    <ol className="space-y-4">
      {steps.map((step) => {
        const { icon: Icon, label } = CHANNEL_META[step.channel];
        return (
          <li
            key={step.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {step.order}
                </span>
                <Badge tone="info" shape="pill">
                  <Icon className="size-3" />
                  {label}
                </Badge>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {step.delayLabel}
              </span>
            </div>
            {step.subject && (
              <p className="mb-1 text-sm font-bold text-foreground">
                {step.subject}
              </p>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
