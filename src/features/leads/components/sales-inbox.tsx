"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useWorkspace } from "@/lib/workspace/context";
import type { LeadFeedback, ProspectStatus } from "../types";
import {
  useProspect,
  useProspects,
  useProspectFeedback,
  useSetProspectStatus,
} from "../hooks";
import { setProspectStatus } from "../api";
import { toFullProspect, toListProspect } from "../utils/map-prospect";
import { ProspectListPane } from "./prospect-list-pane";
import { IntelligenceDetailPanel } from "./intelligence-detail-panel";

// One generous page — a discovery run materializes at most a couple hundred, and
// the list pane filters/sorts/searches client-side over the full set.
const PAGE_SIZE = 200;

export function SalesInbox() {
  const { slug } = useWorkspace();
  const qc = useQueryClient();

  const prospectsQuery = useProspects(slug, { pageSize: PAGE_SIZE });
  const listItems = (prospectsQuery.data?.items ?? []).map(toListProspect);

  const [activeTab, setActiveTab] = useState<ProspectStatus>("new");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  const statusMutation = useSetProspectStatus(slug);
  const feedbackMutation = useProspectFeedback(slug);

  // Full detail (signals/personas/firmographics/feedback) is lazy-loaded for the
  // selected prospect; fall back to the list-level record while it loads.
  const detailQuery = useProspect(slug, selectedId);
  const selectedProspect = detailQuery.data
    ? toFullProspect(detailQuery.data)
    : (listItems.find((p) => p.id === selectedId) ?? null);

  // Default the selection to the first prospect in the active tab.
  useEffect(() => {
    if (selectedId) return;
    const first = listItems.find((p) => p.status === activeTab);
    if (first) setSelectedId(first.id);
  }, [listItems, activeTab, selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView("detail");
  };

  const handleStatusChange = (prospectId: string, newStatus: ProspectStatus) => {
    statusMutation.mutate({ id: prospectId, status: newStatus });
    // Advance selection when the open prospect leaves the current tab.
    if (selectedId === prospectId && newStatus !== activeTab) {
      const next = listItems.find(
        (p) => p.status === activeTab && p.id !== prospectId,
      );
      setSelectedId(next?.id ?? null);
    }
  };

  const handleBulkStatusChange = async (
    ids: string[],
    newStatus: ProspectStatus,
  ) => {
    try {
      await Promise.all(
        ids.map((id) =>
          setProspectStatus(slug, id, newStatus, { skipToast: true }),
        ),
      );
      toast.success(`${ids.length} prospect${ids.length === 1 ? "" : "s"} moved`);
    } finally {
      void qc.invalidateQueries({ queryKey: ["org", slug, "prospects"] });
    }
  };

  const handleRateLead = (prospectId: string, feedback: LeadFeedback) => {
    feedbackMutation.mutate({ id: prospectId, verdict: feedback });
  };

  if (prospectsQuery.isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-primary" />
        Loading prospects…
      </div>
    );
  }

  if (prospectsQuery.isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-sm">
        <p className="text-destructive">
          {prospectsQuery.error?.message ?? "Couldn’t load prospects."}
        </p>
        <Button variant="outline" onClick={() => prospectsQuery.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (listItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <EmptyState>
          No prospects yet. Build an ICP in Discovery and run it to populate your
          inbox.
          <div className="mt-4">
            <Link href={`/org/${slug}/strategy`}>
              <Button className="font-bold">Go to Discovery</Button>
            </Link>
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn(
          "h-full w-full shrink-0 lg:w-[400px]",
          mobileView === "detail" && "hidden lg:block",
        )}
      >
        <ProspectListPane
          prospects={listItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedId={selectedId}
          onSelect={handleSelect}
          onBulkStatusChange={handleBulkStatusChange}
        />
      </div>

      <div
        className={cn(
          "h-full min-w-0 flex-1",
          mobileView === "list" && "hidden lg:block",
        )}
      >
        <IntelligenceDetailPanel
          prospect={selectedProspect}
          onStatusChange={handleStatusChange}
          onRateLead={handleRateLead}
          onBack={() => setMobileView("list")}
        />
      </div>
    </div>
  );
}
