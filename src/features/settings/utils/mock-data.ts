import type {
  Integration,
  SeatUsage,
  SendingProfile,
  TeamMember,
} from "../types";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex@nitrogan.com",
    role: "Admin",
    avatarInitial: "AR",
  },
  {
    id: "u2",
    name: "Sarah Chen",
    email: "sarah@nitrogan.com",
    role: "Member",
    avatarInitial: "SC",
  },
  {
    id: "u3",
    name: "Marcus Aurel",
    email: "marcus@nitrogan.com",
    role: "Member",
    avatarInitial: "MA",
  },
];

export const SEAT_USAGE: SeatUsage = { used: 3, total: 5 };

export const INTEGRATIONS: Integration[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync prospects and activity to your CRM.",
    status: "not_connected",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Push leads and meetings into HubSpot.",
    status: "connected",
  },
  {
    id: "outreach",
    name: "Outreach",
    description: "Hand off sequences to your Outreach workspace.",
    status: "not_connected",
  },
];

export const SENDING_PROFILE: SendingProfile = {
  mailbox: "alex@nitrogan.com",
  domainStatus: "verified",
  dailyCap: 120,
};
