"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ListOrdered,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabBar, type TabItem } from "@/components/ui/tab-bar";
import { useTenant } from "@/lib/tenant/context";
import type { ApprovalMode, CampaignDetail, CampaignStatus } from "../types";
import { ApprovalModeCard } from "./approval-mode-card";
import { PendingReviewList } from "./pending-review-list";
import { SequenceSteps } from "./sequence-steps";
import { ComplianceGuardrails } from "./compliance-guardrails";

interface CampaignDetailViewProps {
  campaign: CampaignDetail;
}

type DetailTab = "review" | "setup";

const STATUS_TONE = {
  active: "success",
  paused: "neutral",
  draft: "warning",
} as const;

// Tracks the most recent approve/skip so the user can undo it — approving
// sends a real message, so the action needs a safety net rather than a
// blocking confirm dialog on every click.
interface UndoState {
  label: string;
  ids: string[];
}

export function CampaignDetailView({ campaign }: CampaignDetailViewProps) {
  const { tenantId } = useTenant();
  const [tab, setTab] = useState<DetailTab>("review");
  const [status, setStatus] = useState<CampaignStatus>(campaign.status);
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>(
    campaign.approvalMode
  );
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [undo, setUndo] = useState<UndoState | null>(null);

  // Derived from the original list + removed set, so order is always preserved
  // (including after an undo). TODO: server call to persist approve/skip.
  const pending = useMemo(
    () => campaign.pendingMessages.filter((m) => !removedIds.has(m.id)),
    [campaign.pendingMessages, removedIds]
  );

  const remove = (ids: string[], label: string) => {
    setRemovedIds((prev) => new Set([...prev, ...ids]));
    setUndo({ ids, label });
  };

  const handleApprove = (id: string) => {
    const msg = pending.find((m) => m.id === id);
    remove([id], `Approved message to ${msg?.prospectName ?? "prospect"}`);
  };
  const handleSkip = (id: string) => {
    const msg = pending.find((m) => m.id === id);
    remove([id], `Skipped message to ${msg?.prospectName ?? "prospect"}`);
  };
  const handleApproveAll = () => {
    if (pending.length === 0) return;
    remove(
      pending.map((m) => m.id),
      `Approved ${pending.length} message${pending.length > 1 ? "s" : ""}`
    );
  };
  const handleUndo = () => {
    if (!undo) return;
    setRemovedIds((prev) => {
      const next = new Set(prev);
      undo.ids.forEach((id) => next.delete(id));
      return next;
    });
    setUndo(null);
  };

  const isManual = approvalMode === "manual";

  const tabs: TabItem<DetailTab>[] = [
    {
      value: "review",
      label: "Review",
      count: isManual ? pending.length : undefined,
    },
    { value: "setup", label: "Setup" },
  ];

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

      {/* Header — campaign identity + lifecycle state only; per-tab actions
          live inside their tabs. */}
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Campaign {campaign.botNumber}
        </span>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {campaign.name}
          </h1>
          <Badge tone={STATUS_TONE[status]} shape="pill" uppercase>
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{campaign.icp}</p>
      </div>

      <TabBar tabs={tabs} value={tab} onChange={setTab} className="mb-8" />

      {tab === "review" ? (
        <ReviewTab
          isManual={isManual}
          pendingCount={pending.length}
          undo={undo}
          onUndo={handleUndo}
          onApproveAll={handleApproveAll}
          onSwitchToSetup={() => setTab("setup")}
        >
          <PendingReviewList
            messages={pending}
            onApprove={handleApprove}
            onSkip={handleSkip}
          />
        </ReviewTab>
      ) : (
        <SetupTab
          campaign={campaign}
          status={status}
          onStatusChange={setStatus}
          approvalMode={approvalMode}
          onApprovalModeChange={setApprovalMode}
        />
      )}
    </div>
  );
}

function ReviewTab({
  isManual,
  pendingCount,
  undo,
  onUndo,
  onApproveAll,
  onSwitchToSetup,
  children,
}: {
  isManual: boolean;
  pendingCount: number;
  undo: UndoState | null;
  onUndo: () => void;
  onApproveAll: () => void;
  onSwitchToSetup: () => void;
  children: React.ReactNode;
}) {
  // In auto-send mode there is no queue to work — explain why and point to the
  // switch, instead of showing an empty list that looks broken.
  if (!isManual) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/30 p-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
          <Zap className="size-5" />
        </span>
        <p className="text-sm font-bold text-foreground">Auto-send is on</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Messages send on schedule without review, so nothing collects here.
          Switch to “Review before send” in Setup to approve messages yourself.
        </p>
        <Button variant="outline" className="font-bold" onClick={onSwitchToSetup}>
          Go to Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold leading-tight text-foreground">
            Pending review
          </h2>
          <p className="text-sm text-muted-foreground">
            Nothing sends until you approve it.
          </p>
        </div>
        {pendingCount > 0 && (
          <Button className="font-bold" onClick={onApproveAll}>
            Approve all ({pendingCount})
          </Button>
        )}
      </div>

      {undo && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm">
          <span className="text-sm text-muted-foreground">{undo.label}</span>
          <button
            type="button"
            onClick={onUndo}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            <RotateCcw className="size-3.5" />
            Undo
          </button>
        </div>
      )}

      {children}
    </div>
  );
}

// The lifecycle action that fits the current status. Launching/pausing is a
// campaign-level decision, so it lives where you configure the campaign.
const LIFECYCLE_ACTION: Record<
  CampaignStatus,
  { label: string; next: CampaignStatus; variant: "default" | "outline" }
> = {
  draft: { label: "Launch campaign", next: "active", variant: "default" },
  active: { label: "Pause campaign", next: "paused", variant: "outline" },
  paused: { label: "Resume campaign", next: "active", variant: "default" },
};

function SetupTab({
  campaign,
  status,
  onStatusChange,
  approvalMode,
  onApprovalModeChange,
}: {
  campaign: CampaignDetail;
  status: CampaignStatus;
  onStatusChange: (status: CampaignStatus) => void;
  approvalMode: ApprovalMode;
  onApprovalModeChange: (mode: ApprovalMode) => void;
}) {
  const action = LIFECYCLE_ACTION[status];

  return (
    <div className="space-y-8">
      {/* Lifecycle action — the one thing you do to the campaign itself */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
        <div>
          <p className="text-sm font-bold text-foreground">
            {status === "draft"
              ? "Ready to go live?"
              : status === "active"
                ? "Campaign is live"
                : "Campaign is paused"}
          </p>
          <p className="text-sm text-muted-foreground">
            {status === "active"
              ? "Pausing stops new sends; in-flight replies still arrive."
              : "Prospects only receive messages while the campaign is active."}
          </p>
        </div>
        <Button
          variant={action.variant}
          className="font-bold"
          onClick={() => onStatusChange(action.next)}
        >
          {action.label}
        </Button>
      </div>

      {/* Sending — the risky control and the guardrails that contain it, together */}
      <section>
        <SectionHeading
          icon={Sparkles}
          title="Sending mode"
          subtitle="Choose how messages leave the building."
        />
        <ApprovalModeCard mode={approvalMode} onChange={onApprovalModeChange} />
        <div className="mt-4">
          <ComplianceGuardrails />
        </div>
      </section>

      {/* Sequence — the template behind every pending message */}
      <section>
        <SectionHeading
          icon={ListOrdered}
          title="Sequence"
          subtitle="The steps every prospect moves through."
        />
        <SequenceSteps steps={campaign.sequence} />
      </section>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof ListOrdered;
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
