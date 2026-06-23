"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { ApiError } from "@/lib/api/errors";
import {
  getProspect,
  listProspects,
  sendProspectFeedback,
  setProspectStatus,
} from "./api";
import type {
  PaginatedProspects,
  ProspectDetail,
  ProspectListItem,
  ProspectListParams,
  ProspectStatus,
} from "./types/api";

export function useProspects(slug: string, params: ProspectListParams) {
  return useQuery<PaginatedProspects, ApiError>({
    queryKey: queryKeys.prospects.list(slug, params),
    queryFn: () => listProspects(slug, params),
    enabled: Boolean(slug),
    placeholderData: (prev) => prev, // smooth pagination / filter changes
  });
}

export function useProspect(slug: string, id: string | null) {
  return useQuery<ProspectDetail, ApiError>({
    queryKey: queryKeys.prospects.detail(slug, id ?? ""),
    queryFn: () => getProspect(slug, id as string),
    enabled: Boolean(slug) && Boolean(id),
  });
}

export function useSetProspectStatus(slug: string) {
  const qc = useQueryClient();
  return useMutation<
    ProspectListItem,
    ApiError,
    { id: string; status: ProspectStatus }
  >({
    mutationFn: ({ id, status }) => setProspectStatus(slug, id, status),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({ queryKey: ["org", slug, "prospects"] });
      void qc.invalidateQueries({
        queryKey: queryKeys.prospects.detail(slug, id),
      });
    },
  });
}

export function useProspectFeedback(slug: string) {
  const qc = useQueryClient();
  return useMutation<
    { ok: boolean },
    ApiError,
    { id: string; verdict: "good" | "bad" }
  >({
    mutationFn: ({ id, verdict }) => sendProspectFeedback(slug, id, verdict),
    onSuccess: (_data, { id }) => {
      void qc.invalidateQueries({
        queryKey: queryKeys.prospects.detail(slug, id),
      });
    },
  });
}
