import { TrendingUp } from "lucide-react";
import { Metric } from "@/components/ui/metric";
import type { PredictionStats, SampleLead } from "../types";
import { SamplePreviewTable } from "./sample-preview-table";

interface PredictorPanelProps {
  prediction: PredictionStats;
  sampleLeads: SampleLead[];
  onRefreshSample: () => void;
}

export function PredictorPanel({
  prediction,
  sampleLeads,
  onRefreshSample,
}: PredictorPanelProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Predictor Card */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Real-time Prediction
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-bold leading-tight">
              Reach{" "}
              <span className="italic text-primary">
                ~{prediction.leadsPerWeek} high-intent
              </span>{" "}
              leads per week
            </h2>

            {/* Description */}
            <p className="text-lg leading-relaxed text-muted-foreground">
              Based on your firmographics and selected intent triggers, we&apos;ve
              identified a concentrated cluster of prospects ready for outreach.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Confidence", value: `${prediction.confidence}%` },
                { label: "Velocity", value: prediction.velocity },
                { label: "Reach", value: `~${prediction.reachPerMonth}/mo` },
              ].map((stat) => (
                <Metric
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  className="rounded-xl border border-border bg-muted/50 p-4"
                  labelClassName="font-bold uppercase"
                  valueClassName="text-xl"
                />
              ))}
            </div>
          </div>

          {/* Optimization Indicator */}
          <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-primary p-6 text-white shadow-lg shadow-primary/20 md:w-64">
            <div className="relative flex size-24 items-center justify-center rounded-full border-4 border-white/20">
              <TrendingUp className="size-12" />
              <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-4 border-primary bg-emerald-400">
                <TrendingUp className="size-3.5 text-emerald-900" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-white/70">
                Optimization Level
              </p>
              <p className="text-2xl font-bold">{prediction.optimizationLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Preview */}
      <SamplePreviewTable leads={sampleLeads} onRefresh={onRefreshSample} />
    </div>
  );
}
