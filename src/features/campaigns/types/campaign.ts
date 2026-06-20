export type CampaignStatus = "active" | "paused";

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
}

export interface NetworkStats {
  activeLeads: string;
  responseRate: string;
  pipelineMultiplier: string;
}
