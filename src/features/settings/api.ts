import { api, API_VERSION } from "@/lib/api/client";

/** Mirrors the backend `TeamMemberView` / `SeatUsageView` (src/shared/org.schema.ts). */
export interface TeamMemberView {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  avatarInitial: string;
  status: "active" | "invited" | "deactivated";
}

export interface SeatUsageView {
  used: number;
  total: number;
}

export interface InviteMemberInput {
  email: string;
  role?: "Admin" | "Member";
}

const base = (slug: string) => `/${API_VERSION}/org/${slug}/members`;

export async function listMembers(slug: string): Promise<TeamMemberView[]> {
  const { data } = await api.get<TeamMemberView[]>(base(slug));
  return data;
}

export async function getSeats(slug: string): Promise<SeatUsageView> {
  const { data } = await api.get<SeatUsageView>(`${base(slug)}/seats`);
  return data;
}

export async function inviteMember(
  slug: string,
  input: InviteMemberInput,
): Promise<TeamMemberView> {
  const { data } = await api.post<TeamMemberView>(
    `${base(slug)}/invite`,
    input,
  );
  return data;
}

export async function updateMemberRole(
  slug: string,
  membershipId: string,
  role: "Admin" | "Member",
): Promise<TeamMemberView> {
  const { data } = await api.patch<TeamMemberView>(
    `${base(slug)}/${membershipId}/role`,
    { role },
  );
  return data;
}

export async function deactivateMember(
  slug: string,
  membershipId: string,
): Promise<void> {
  await api.delete(`${base(slug)}/${membershipId}`);
}
