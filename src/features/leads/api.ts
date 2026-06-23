import { api, API_VERSION } from "@/lib/api/client";
import type {
  PaginatedProspects,
  ProspectDetail,
  ProspectListItem,
  ProspectListParams,
  ProspectStatus,
} from "./types/api";

const base = (slug: string) => `/${API_VERSION}/org/${slug}/prospects`;

export async function listProspects(
  slug: string,
  params: ProspectListParams,
): Promise<PaginatedProspects> {
  const { data } = await api.get<PaginatedProspects>(base(slug), { params });
  return data;
}

export async function getProspect(
  slug: string,
  id: string,
): Promise<ProspectDetail> {
  const { data } = await api.get<ProspectDetail>(`${base(slug)}/${id}`);
  return data;
}

export async function setProspectStatus(
  slug: string,
  id: string,
  status: ProspectStatus,
  opts?: { skipToast?: boolean },
): Promise<ProspectListItem> {
  // Bulk callers pass skipToast and show a single summary instead of N toasts.
  const { data } = await api.patch<ProspectListItem>(
    `${base(slug)}/${id}/status`,
    { status },
    { skipToast: opts?.skipToast },
  );
  return data;
}

export async function sendProspectFeedback(
  slug: string,
  id: string,
  verdict: "good" | "bad",
): Promise<{ ok: boolean }> {
  const { data } = await api.post<{ ok: boolean }>(
    `${base(slug)}/${id}/feedback`,
    { verdict },
  );
  return data;
}
