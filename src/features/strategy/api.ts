import { api, API_VERSION } from "@/lib/api/client";
import type {
  DiscoveryOptions,
  PreviewInput,
  PreviewResult,
  RunResult,
  Segment,
  SegmentInput,
} from "./types/discovery";

const orgBase = (slug: string) => `/${API_VERSION}/org/${slug}`;

// ── Discovery ─────────────────────────────────────────

export async function getDiscoveryOptions(
  slug: string,
): Promise<DiscoveryOptions> {
  const { data } = await api.get<DiscoveryOptions>(
    `${orgBase(slug)}/discovery/options`,
  );
  return data;
}

export async function previewDiscovery(
  slug: string,
  input: PreviewInput,
): Promise<PreviewResult> {
  // Live builder preview — no toast (it's a passive recompute, not an action).
  const { data } = await api.post<PreviewResult>(
    `${orgBase(slug)}/discovery/preview`,
    input,
    { skipToast: true },
  );
  return data;
}

export async function runDiscovery(
  slug: string,
  segmentId: string,
): Promise<RunResult> {
  // skipToast: the caller shows a richer toast with the count of prospects added.
  const { data } = await api.post<RunResult>(
    `${orgBase(slug)}/discovery/run`,
    { segmentId },
    { skipToast: true },
  );
  return data;
}

// ── Segments ──────────────────────────────────────────

export async function listSegments(slug: string): Promise<Segment[]> {
  const { data } = await api.get<Segment[]>(`${orgBase(slug)}/segments`);
  return data;
}

export async function getLatestSegment(slug: string): Promise<Segment | null> {
  const { data } = await api.get<Segment | null>(
    `${orgBase(slug)}/segments/latest`,
  );
  return data;
}

export async function createSegment(
  slug: string,
  input: SegmentInput,
): Promise<Segment> {
  const { data } = await api.post<Segment>(`${orgBase(slug)}/segments`, input);
  return data;
}

export async function updateSegment(
  slug: string,
  id: string,
  input: Partial<SegmentInput>,
): Promise<Segment> {
  const { data } = await api.patch<Segment>(
    `${orgBase(slug)}/segments/${id}`,
    input,
  );
  return data;
}

export async function deleteSegment(
  slug: string,
  id: string,
): Promise<{ ok: boolean }> {
  const { data } = await api.delete<{ ok: boolean }>(
    `${orgBase(slug)}/segments/${id}`,
  );
  return data;
}
