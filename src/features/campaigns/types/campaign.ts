// `draft` = built but never launched; `active`/`paused` = launched.
export type CampaignStatus = "draft" | "active" | "paused";

// The safety knob. `manual` (default) routes every generated message through a
// human approval queue before it can send. `auto` sends without review.
export type ApprovalMode = "manual" | "auto";

export type SequenceChannel = "email" | "linkedin";

export interface CampaignMetrics {
  sent: string;
  replies: string;
  meetings: string;
}

export interface CampaignAssignee {
  name: string;
  avatarInitial: string;
}

export interface Campaign {
  id: string;
  botNumber: string;
  name: string;
  status: CampaignStatus;
  icp: string;
  metrics: CampaignMetrics;
  assignee: CampaignAssignee;
  approvalMode: ApprovalMode;
  /** Messages waiting on human review. Always 0 when approvalMode is `auto`. */
  pendingApproval: number;
}

export interface SequenceStep {
  id: string;
  order: number;
  channel: SequenceChannel;
  /** Human-readable timing, e.g. "Day 1", "Day 4 (if no reply)". */
  delayLabel: string;
  subject?: string;
  body: string;
}

export interface PendingMessage {
  id: string;
  prospectName: string;
  prospectCompany: string;
  stepOrder: number;
  channel: SequenceChannel;
  subject?: string;
  preview: string;
}

export interface CampaignDetail extends Campaign {
  sequence: SequenceStep[];
  /** Concrete messages currently sitting in the approval queue. */
  pendingMessages: PendingMessage[];
}

export interface NetworkStats {
  activeLeads: string;
  responseRate: string;
  pipelineMultiplier: string;
}
