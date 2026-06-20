import { cn } from "@/lib/utils";

// Placeholder trend until real intent-score history is wired up.
const SAMPLE_TREND = [25, 33, 40, 50, 60, 100, 80];

interface IntentScoreChartProps {
  score: number;
}

export function IntentScoreChart({ score }: IntentScoreChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Intent Score Over Time
        </h3>
        <span className="text-sm font-bold text-primary">
          {score}/100 &bull; Critical
        </span>
      </div>
      <div className="flex h-48 w-full items-end gap-2 rounded-lg bg-muted/50 p-4">
        {SAMPLE_TREND.map((height, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-t-sm",
              height >= 80
                ? "bg-primary"
                : height >= 50
                  ? "bg-primary/40"
                  : "bg-primary/20"
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
