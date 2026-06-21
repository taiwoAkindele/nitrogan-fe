import { TrendingUp } from "lucide-react";

import { Metric } from "@/components/ui/metric";
import type { NetworkStats } from "../types";

interface NetworkStatsBannerProps {
  stats: NetworkStats;
}

export function NetworkStatsBanner({ stats }: NetworkStatsBannerProps) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
          <TrendingUp className="size-6" />
        </div>
        <div>
          <h4 className="font-bold text-foreground">Network Performance</h4>
          <p className="text-sm text-muted-foreground">
            Your bots are currently generating {stats.pipelineMultiplier} more
            pipeline than last month.
          </p>
        </div>
      </div>
      <div className="flex gap-8">
        <Metric
          label="Active Leads"
          value={stats.activeLeads}
          className="flex flex-col"
          labelClassName="font-bold uppercase tracking-widest"
          valueClassName="text-2xl text-foreground"
        />
        <Metric
          label="Response Rate"
          value={stats.responseRate}
          className="flex flex-col border-l border-primary/20 pl-8"
          labelClassName="font-bold uppercase tracking-widest"
          valueClassName="text-2xl text-foreground"
        />
      </div>
    </div>
  );
}
