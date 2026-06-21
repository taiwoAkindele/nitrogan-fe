"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { ApiError } from "@/lib/api/errors";
import {
  deactivateMember,
  getSeats,
  inviteMember,
  listMembers,
  updateMemberRole,
  type InviteMemberInput,
  type SeatUsageView,
  type TeamMemberView,
} from "./api";

export function useMembers(slug: string) {
  return useQuery<TeamMemberView[], ApiError>({
    queryKey: queryKeys.members.all(slug),
    queryFn: () => listMembers(slug),
    enabled: Boolean(slug),
  });
}

export function useSeats(slug: string) {
  return useQuery<SeatUsageView, ApiError>({
    queryKey: queryKeys.members.seats(slug),
    queryFn: () => getSeats(slug),
    enabled: Boolean(slug),
  });
}

/** Invalidate the member list + seat usage after any mutation. */
function useInvalidateMembers(slug: string) {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.members.all(slug) });
    void qc.invalidateQueries({ queryKey: queryKeys.members.seats(slug) });
  };
}

export function useInviteMember(slug: string) {
  const invalidate = useInvalidateMembers(slug);
  return useMutation<TeamMemberView, ApiError, InviteMemberInput>({
    mutationFn: (input) => inviteMember(slug, input),
    onSuccess: invalidate,
  });
}

export function useUpdateMemberRole(slug: string) {
  const invalidate = useInvalidateMembers(slug);
  return useMutation<
    TeamMemberView,
    ApiError,
    { membershipId: string; role: "Admin" | "Member" }
  >({
    mutationFn: ({ membershipId, role }) =>
      updateMemberRole(slug, membershipId, role),
    onSuccess: invalidate,
  });
}

export function useDeactivateMember(slug: string) {
  const invalidate = useInvalidateMembers(slug);
  return useMutation<void, ApiError, string>({
    mutationFn: (membershipId) => deactivateMember(slug, membershipId),
    onSuccess: invalidate,
  });
}
