import type {
  Campaign,
  CampaignDetail,
  NetworkStats,
  PendingMessage,
  SequenceStep,
} from "../types";

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "bot-8293",
    botNumber: "#8293",
    name: "Enterprise Fintech Bot",
    status: "active",
    icp: "Fintech | 11-50 employees | Series A+",
    metrics: { sent: "1.2k", replies: "84", meetings: "12" },
    assignee: { name: "Alex Rivera", avatarInitial: "AR" },
    approvalMode: "manual",
    pendingApproval: 7,
  },
  {
    id: "bot-4412",
    botNumber: "#4412",
    name: "SaaS Growth Engine",
    status: "draft",
    icp: "SaaS | 51-200 employees | Seed - B",
    metrics: { sent: "0", replies: "0", meetings: "0" },
    assignee: { name: "Sarah Chen", avatarInitial: "SC" },
    approvalMode: "manual",
    pendingApproval: 0,
  },
  {
    id: "bot-2187",
    botNumber: "#2187",
    name: "HealthTech Outreach",
    status: "active",
    icp: "Healthcare | 10-50 employees | North America",
    metrics: { sent: "821", replies: "42", meetings: "5" },
    assignee: { name: "Marcus Aurel", avatarInitial: "MA" },
    approvalMode: "manual",
    pendingApproval: 3,
  },
  {
    id: "bot-5502",
    botNumber: "#5502",
    name: "Crypto Compliance",
    status: "paused",
    icp: "Finance | 201-500 employees | Compliance focus",
    metrics: { sent: "2.4k", replies: "108", meetings: "34" },
    assignee: { name: "David Kim", avatarInitial: "DK" },
    approvalMode: "manual",
    pendingApproval: 0,
  },
];

export const MOCK_NETWORK_STATS: NetworkStats = {
  activeLeads: "4,812",
  responseRate: "18.4%",
  pipelineMultiplier: "4.2x",
};

// A representative 3-step sequence reused across detail mocks.
const SAMPLE_SEQUENCE: SequenceStep[] = [
  {
    id: "step-1",
    order: 1,
    channel: "email",
    delayLabel: "Day 1",
    subject: "Quick question about {{company}}'s data stack",
    body: "Hi {{firstName}} — noticed {{company}} {{signal}}. Teams hitting that inflection usually struggle with X. Worth a quick chat?",
  },
  {
    id: "step-2",
    order: 2,
    channel: "linkedin",
    delayLabel: "Day 3 (if no reply)",
    body: "Connecting after my note — happy to share how similar {{industry}} teams handled this. Open to a 15-min call next week?",
  },
  {
    id: "step-3",
    order: 3,
    channel: "email",
    delayLabel: "Day 6 (if no reply)",
    subject: "Re: Quick question about {{company}}'s data stack",
    body: "Following up once more, {{firstName}}. If timing's off, just say the word and I'll close the loop.",
  },
];

const PENDING_BY_CAMPAIGN: Record<string, PendingMessage[]> = {
  "bot-8293": [
    {
      id: "pm-1",
      prospectName: "Jordan Blake",
      prospectCompany: "Acme Corp",
      stepOrder: 1,
      channel: "email",
      subject: "Quick question about Acme Corp's data stack",
      preview:
        "Hi Jordan — noticed Acme just raised a $40M Series B. Teams scaling that fast usually hit data-pipeline pain. Worth a quick chat?",
    },
    {
      id: "pm-2",
      prospectName: "Priya Nair",
      prospectCompany: "Northwind",
      stepOrder: 1,
      channel: "email",
      subject: "Quick question about Northwind's data stack",
      preview:
        "Hi Priya — saw Northwind is hiring 4 data engineers this quarter. Usually a sign the current stack is straining...",
    },
    {
      id: "pm-3",
      prospectName: "Tom Vega",
      prospectCompany: "Lumen Labs",
      stepOrder: 2,
      channel: "linkedin",
      preview:
        "Connecting after my note — happy to share how similar fintech teams handled this. Open to a 15-min call next week?",
    },
  ],
  "bot-2187": [
    {
      id: "pm-4",
      prospectName: "Dr. Lena Ortiz",
      prospectCompany: "Vitalis Health",
      stepOrder: 1,
      channel: "email",
      subject: "Quick question about Vitalis Health's data stack",
      preview:
        "Hi Lena — noticed Vitalis just opened a new North America region. Worth a quick chat on patient-data scaling?",
    },
  ],
};

export function getCampaignDetail(id: string): CampaignDetail | undefined {
  const base = MOCK_CAMPAIGNS.find((c) => c.id === id);
  if (!base) return undefined;
  return {
    ...base,
    sequence: SAMPLE_SEQUENCE,
    pendingMessages: PENDING_BY_CAMPAIGN[id] ?? [],
  };
}

// A fresh draft seeded from the Discover step's ICP. Starts with the default
// sequence so the user can review and launch instead of building from scratch.
export function buildDraftCampaign(icp: string): CampaignDetail {
  return {
    id: "new",
    botNumber: "#NEW",
    name: "Untitled campaign",
    status: "draft",
    icp: icp || "Audience not set",
    metrics: { sent: "0", replies: "0", meetings: "0" },
    assignee: { name: "Alex Rivera", avatarInitial: "AR" },
    approvalMode: "manual",
    pendingApproval: 0,
    sequence: SAMPLE_SEQUENCE,
    pendingMessages: [],
  };
}
