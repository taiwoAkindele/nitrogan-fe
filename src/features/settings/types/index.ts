export type IntegrationStatus = "connected" | "not_connected";

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  avatarInitial: string;
}

export interface SeatUsage {
  used: number;
  total: number;
}

export interface SendingProfile {
  mailbox: string;
  domainStatus: "verified" | "unverified";
  dailyCap: number;
}
