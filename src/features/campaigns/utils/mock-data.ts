import type { Campaign, NetworkStats } from "../types";

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "bot-8293",
    botNumber: "#8293",
    name: "Enterprise Fintech Bot",
    status: "active",
    icp: "Fintech | 11-50 employees | Series A+",
    metrics: { sent: "1.2k", replies: "84", meetings: "12" },
    assignee: { name: "Alex Rivera", avatarInitial: "AR" },
  },
  {
    id: "bot-4412",
    botNumber: "#4412",
    name: "SaaS Growth Engine",
    status: "paused",
    icp: "SaaS | 51-200 employees | Seed - B",
    metrics: { sent: "450", replies: "12", meetings: "0" },
    assignee: { name: "Sarah Chen", avatarInitial: "SC" },
  },
  {
    id: "bot-2187",
    botNumber: "#2187",
    name: "HealthTech Outreach",
    status: "active",
    icp: "Healthcare | 10-50 employees | North America",
    metrics: { sent: "821", replies: "42", meetings: "5" },
    assignee: { name: "Marcus Aurel", avatarInitial: "MA" },
  },
  {
    id: "bot-5502",
    botNumber: "#5502",
    name: "Crypto Compliance",
    status: "active",
    icp: "Finance | 201-500 employees | Compliance focus",
    metrics: { sent: "2.4k", replies: "108", meetings: "34" },
    assignee: { name: "David Kim", avatarInitial: "DK" },
  },
];

export const MOCK_NETWORK_STATS: NetworkStats = {
  activeLeads: "4,812",
  responseRate: "18.4%",
  pipelineMultiplier: "4.2x",
};
