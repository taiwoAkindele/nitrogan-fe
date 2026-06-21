"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LeadFeedback, ProspectDetail, ProspectStatus } from "../types";
import { MOCK_PROSPECTS } from "../utils/mock-data";
import { ProspectListPane } from "./prospect-list-pane";
import { IntelligenceDetailPanel } from "./intelligence-detail-panel";

export function SalesInbox() {
  const [prospects, setProspects] = useState<ProspectDetail[]>(MOCK_PROSPECTS);
  const [activeTab, setActiveTab] = useState<ProspectStatus>("new");
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(
    MOCK_PROSPECTS[0]?.id ?? null
  );
  // Below lg the list and detail are shown one at a time; this tracks which.
  // At lg+ both panes are always visible, so this is ignored.
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  const selectedProspect =
    prospects.find((p) => p.id === selectedProspectId) ?? null;

  // Selecting a lead reveals the detail pane on small/tablet screens.
  const handleSelect = (id: string) => {
    setSelectedProspectId(id);
    setMobileView("detail");
  };

  const handleStatusChange = async (
    prospectId: string,
    newStatus: ProspectStatus
  ) => {
    // Optimistic update
    const updated = prospects.map((p) =>
      p.id === prospectId ? { ...p, status: newStatus } : p
    );
    setProspects(updated);

    // If the moved prospect was selected, select the next one in the current tab
    if (selectedProspectId === prospectId && newStatus !== activeTab) {
      const remaining = updated.filter(
        (p) => p.status === activeTab && p.id !== prospectId
      );
      setSelectedProspectId(remaining[0]?.id ?? null);
    }

    // TODO: server call — e.g. api(`/prospects/${prospectId}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) })
  };

  const handleBulkStatusChange = (
    ids: string[],
    newStatus: ProspectStatus
  ) => {
    const idSet = new Set(ids);
    setProspects((prev) =>
      prev.map((p) => (idSet.has(p.id) ? { ...p, status: newStatus } : p))
    );

    // TODO: server call — bulk PATCH /prospects/status
  };

  const handleRateLead = (prospectId: string, feedback: LeadFeedback) => {
    // Clicking the active rating again clears it.
    setProspects((prev) =>
      prev.map((p) =>
        p.id === prospectId
          ? { ...p, feedback: p.feedback === feedback ? undefined : feedback }
          : p
      )
    );

    // TODO: server call — feeds the intent-scoring model.
    // api(`/prospects/${prospectId}/feedback`, { method: "PATCH", body: JSON.stringify({ feedback }) })
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* List: full width below lg, fixed 400px at lg. Hidden when viewing a lead. */}
      <div
        className={cn(
          "h-full w-full shrink-0 lg:w-[400px]",
          mobileView === "detail" && "hidden lg:block"
        )}
      >
        <ProspectListPane
          prospects={prospects}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedId={selectedProspectId}
          onSelect={handleSelect}
          onBulkStatusChange={handleBulkStatusChange}
        />
      </div>

      {/* Detail: hidden below lg until a lead is opened. */}
      <div
        className={cn(
          "h-full min-w-0 flex-1",
          mobileView === "list" && "hidden lg:block"
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
