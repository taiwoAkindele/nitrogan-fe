"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, ListOrdered, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/lib/tenant/context";
import type { ApprovalMode, CampaignDetail, PendingMessage } from "../types";
import { ApprovalModeCard } from "./approval-mode-card";
import { PendingReviewList } from "./pending-review-list";
import { SequenceSteps } from "./sequence-steps";
import { ComplianceGuardrails } from "./compliance-guardrails";

interface CampaignDetailViewProps {
  campaign: CampaignDetail;
}

const STATUS_TONE = {
  active: "success",
  paused: "neutral",
  draft: "warning",
} as const;

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const { tenantId } = useTenant();
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>(
    campaign.approvalMode
  );
  const [pending, setPending] = useState<PendingMessage[]>(
    campaign.pendingMessages
  );

  // Approving or skipping just clears the item from the local queue for now.
  // TODO: server call — POST /campaigns/{id}/messages/{messageId}/{approve|skip}
  const handleApprove = (id: string) =>
    setPending((prev) => prev.filter((m) => m.id !== id));
  const handleSkip = (id: string) =>
    setPending((prev) => prev.filter((m) => m.id !== id));

  const isLaunched = campaign.status !== "draft";

  return (
    <div className="mx-auto w-full max-w-5xl p-6 md:p-10">
      {/* Back link */}
      <Link
        href={`/org/${tenantId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Campaigns
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Campaign {campaign.botNumber}
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {campaign.name}
            </h1>
            <Badge tone={STATUS_TONE[campaign.status]} shape="pill" uppercase>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{campaign.icp}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold">
            {isLaunched ? "Pause" : "Edit"}
          </Button>
          <Button className="font-bold shadow-lg shadow-primary/20">
            {isLaunched ? "Open Leads" : "Launch Campaign"}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Sending mode — the safety control, front and center */}
        <section>
          <SectionHeading
            icon={Sparkles}
            title="Sending mode"
            subtitle="Choose how messages leave the building."
          />
          <ApprovalModeCard mode={approvalMode} onChange={setApprovalMode} />
        </section>

        {/* Approval queue — only relevant in manual mode */}
        {approvalMode === "manual" && (
          <section>
            <SectionHeading
              icon={Inbox}
              title={`Pending review${pending.length ? ` (${pending.length})` : ""}`}
              subtitle="Nothing sends until you approve it."
            />
            <PendingReviewList
              messages={pending}
              onApprove={handleApprove}
              onSkip={handleSkip}
            />
          </section>
        )}

        {/* Sequence */}
        <section>
          <SectionHeading
            icon={ListOrdered}
            title="Sequence"
            subtitle="The steps every prospect moves through."
          />
          <SequenceSteps steps={campaign.sequence} />
        </section>

        {/* Compliance guardrails */}
        <section>
          <SectionHeading
            icon={ShieldCheck}
            title="Safety & compliance"
            subtitle="Applied to every send, automatically."
          />
          <ComplianceGuardrails />
        </section>
      </div>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Inbox;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="text-lg font-bold leading-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
