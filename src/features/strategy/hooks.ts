"use client";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import type { ApiError } from "@/lib/api/errors";
import {
  createSegment,
  deleteSegment,
  getDiscoveryOptions,
  getLatestSegment,
  listSegments,
  previewDiscovery,
  runDiscovery,
  updateSegment,
} from "./api";
import type {
  DiscoveryOptions,
  PreviewInput,
  PreviewResult,
  RunResult,
  Segment,
  SegmentInput,
} from "./types/discovery";

/** Debounce any fast-changing value (used to throttle live preview requests). */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function useDiscoveryOptions(slug: string) {
  return useQuery<DiscoveryOptions, ApiError>({
    queryKey: queryKeys.discovery.options(slug),
    queryFn: () => getDiscoveryOptions(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 60_000, // reference data; rarely changes
  });
}

/**
 * Live audience preview. Debounces the ICP so dragging sliders / toggling chips
 * doesn't spam the server; disabled until there is an audience.
 */
export function useDiscoveryPreview(
  slug: string,
  input: PreviewInput,
  enabled: boolean,
) {
  const debounced = useDebouncedValue(input, 400);
  return useQuery<PreviewResult, ApiError>({
    queryKey: queryKeys.discovery.preview(slug, debounced),
    queryFn: () => previewDiscovery(slug, debounced),
    enabled: Boolean(slug) && enabled,
    placeholderData: (prev) => prev, // keep last numbers visible while refetching
  });
}

export function useSegments(slug: string) {
  return useQuery<Segment[], ApiError>({
    queryKey: queryKeys.segments.all(slug),
    queryFn: () => listSegments(slug),
    enabled: Boolean(slug),
  });
}

export function useLatestSegment(slug: string) {
  return useQuery<Segment | null, ApiError>({
    queryKey: queryKeys.segments.latest(slug),
    queryFn: () => getLatestSegment(slug),
    enabled: Boolean(slug),
  });
}

/** Create a new segment, or update the existing one when an id is supplied. */
export function useSaveSegment(slug: string) {
  const qc = useQueryClient();
  return useMutation<
    Segment,
    ApiError,
    { id?: string; input: SegmentInput }
  >({
    mutationFn: ({ id, input }) =>
      id ? updateSegment(slug, id, input) : createSegment(slug, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.segments.all(slug) });
      void qc.invalidateQueries({ queryKey: queryKeys.segments.latest(slug) });
    },
  });
}

export function useDeleteSegment(slug: string) {
  const qc = useQueryClient();
  return useMutation<{ ok: boolean }, ApiError, string>({
    mutationFn: (id) => deleteSegment(slug, id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.segments.all(slug) });
      void qc.invalidateQueries({ queryKey: queryKeys.segments.latest(slug) });
    },
  });
}

export function useRunDiscovery(slug: string) {
  const qc = useQueryClient();
  return useMutation<RunResult, ApiError, string>({
    mutationFn: (segmentId) => runDiscovery(slug, segmentId),
    onSuccess: () => {
      // New prospects landed in the inbox — invalidate any cached prospect lists.
      void qc.invalidateQueries({ queryKey: ["org", slug, "prospects"] });
    },
  });
}
