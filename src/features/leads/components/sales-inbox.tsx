"use client";

import { useState } from "react";
import type { ProspectDetail, ProspectStatus } from "../types";
import { MOCK_PROSPECTS } from "../utils/mock-data";
import { ProspectListPane } from "./prospect-list-pane";
import { IntelligenceDetailPanel } from "./intelligence-detail-panel";

export function SalesInbox() {
  const [prospects, setProspects] = useState<ProspectDetail[]>(MOCK_PROSPECTS);
  const [activeTab, setActiveTab] = useState<ProspectStatus>("new");
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(
    MOCK_PROSPECTS[0]?.id ?? null
  );

  const selectedProspect =
    prospects.find((p) => p.id === selectedProspectId) ?? null;

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

  return (
    <div className="flex h-full overflow-hidden">
      <ProspectListPane
        prospects={prospects}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedId={selectedProspectId}
        onSelect={setSelectedProspectId}
      />
      <IntelligenceDetailPanel
        prospect={selectedProspect}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
