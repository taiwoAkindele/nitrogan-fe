import { TrendingUp, Brain, Zap, DollarSign } from "lucide-react";
import type { Signal } from "../types";

const SIGNAL_ICON_MAP: Record<
  Signal["type"],
  { icon: typeof TrendingUp; color: string }
> = {
  expansion: { icon: TrendingUp, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30" },
  executive: { icon: Brain, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30" },
  technographic: { icon: Zap, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30" },
  funding: { icon: DollarSign, color: "bg-green-100 text-green-600 dark:bg-green-900/30" },
};

interface SignalListProps {
  signals: Signal[];
}

export function SignalList({ signals }: SignalListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted/50 p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Recent Signals
        </h3>
      </div>
      <div className="divide-y divide-border">
        {signals.map((signal) => {
          const { icon: Icon, color } = SIGNAL_ICON_MAP[signal.type];
          return (
            <div key={signal.id} className="flex gap-4 p-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${color}`}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{signal.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {signal.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
