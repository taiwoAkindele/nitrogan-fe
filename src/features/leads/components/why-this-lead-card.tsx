import { Lightbulb, MessageSquareQuote } from "lucide-react";

import type { Signal } from "../types";

interface WhyThisLeadCardProps {
  score: number;
  signals: Signal[];
}

// Attributes the intent score to the signals that drove it, then bridges to
// outreach with the top signal's suggested angle.
export function WhyThisLeadCard({ score, signals }: WhyThisLeadCardProps) {
  const drivers = [...signals].sort(
    (a, b) => b.scoreContribution - a.scoreContribution
  );
  const top = drivers[0];

  if (!top) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="size-4 text-primary" />
        <h3 className="text-sm font-bold">Why this scored {score}/100</h3>
      </div>

      <ul className="space-y-3">
        {drivers.map((signal) => (
          <li key={signal.id}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-medium">
                {signal.title}
              </span>
              <span className="shrink-0 text-xs font-bold text-primary">
                +{signal.scoreContribution} intent
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(100, (signal.scoreContribution / score) * 100)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Bridge to outreach — the top driver becomes a ready-to-use opener. */}
      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <MessageSquareQuote className="size-3.5" />
          Suggested outreach angle
        </div>
        <p className="text-sm text-foreground">{top.outreachAngle}</p>
      </div>
    </div>
  );
}
