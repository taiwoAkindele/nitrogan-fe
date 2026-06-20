import { MoreVertical } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Metric } from "@/components/ui/metric";
import { cn } from "@/lib/utils";
import type { Campaign } from "../types";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const isActive = campaign.status === "active";

  const metrics = [
    {
      label: "Sent",
      value: campaign.metrics.sent,
      valueClassName: "text-sm text-foreground",
    },
    {
      label: "Replies",
      value: campaign.metrics.replies,
      valueClassName: "text-sm text-foreground",
    },
    {
      label: "Meetings",
      value: campaign.metrics.meetings,
      valueClassName: "text-sm text-primary",
    },
  ];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50">
      <div className="flex h-full flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Bot {campaign.botNumber}
            </span>
            <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
              {campaign.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <Badge tone="success" shape="pill" dot>
                ACTIVE
              </Badge>
            ) : (
              <Badge tone="neutral" shape="pill">
                PAUSED
              </Badge>
            )}
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="size-5" />
            </button>
          </div>
        </div>

        {/* ICP */}
        <div className="mb-6 flex flex-grow flex-col gap-4">
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-tighter text-muted-foreground">
              Ideal Customer Profile
            </p>
            <p className="text-sm font-medium text-foreground/80">
              {campaign.icp}
            </p>
          </div>

          {/* Metrics */}
          <div
            className={cn("grid grid-cols-3 gap-2", !isActive && "opacity-60")}
          >
            {metrics.map((metric) => (
              <Metric
                key={metric.label}
                label={metric.label}
                value={metric.value}
                className="rounded-lg bg-muted/30 p-2 text-center"
                labelClassName="mb-0.5"
                valueClassName={metric.valueClassName}
              />
            ))}
          </div>
        </div>

        {/* Assignee Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Avatar
              initials={campaign.assignee.avatarInitial}
              size="sm"
              shape="circle"
              className="border-2 border-card bg-muted text-muted-foreground shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-medium leading-none text-muted-foreground">
                Assignee
              </span>
              <span className="text-xs font-bold text-foreground">
                {campaign.assignee.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg bg-muted px-4 py-2 text-xs font-bold text-foreground/70 transition-all hover:bg-primary hover:text-white"
          >
            View Leads
          </button>
        </div>
      </div>
    </div>
  );
}
