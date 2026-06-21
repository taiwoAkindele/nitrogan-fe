import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LeadFeedback } from "../types";

interface LeadQualityCardProps {
  score: number;
  feedback?: LeadFeedback;
  onRate: (feedback: LeadFeedback) => void;
}

// Pairs the model's output (the intent score) with the control that corrects
// it. Clicking the active rating again clears it.
export function LeadQualityCard({
  score,
  feedback,
  onRate,
}: LeadQualityCardProps) {
  const rated = feedback !== undefined;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold">Was this a good lead?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We scored it{" "}
            <span className="font-bold text-foreground">{score}/100</span>. Your
            rating tunes the intent model.
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <RateButton
            active={feedback === "good"}
            tone="good"
            icon={ThumbsUp}
            label="Good fit"
            onClick={() => onRate("good")}
          />
          <RateButton
            active={feedback === "bad"}
            tone="bad"
            icon={ThumbsDown}
            label="Not a fit"
            onClick={() => onRate("bad")}
          />
        </div>
      </div>

      {rated && (
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Thanks — this helps improve scoring for future prospects.
        </div>
      )}
    </div>
  );
}

function RateButton({
  active,
  tone,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  tone: "good" | "bad";
  icon: typeof ThumbsUp;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors",
        active && tone === "good" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
        active && tone === "bad" && "border-destructive/30 bg-destructive/10 text-destructive",
        !active && "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
