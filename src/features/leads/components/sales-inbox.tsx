"use client";

import { useState } from "react";
import type { ProspectStatus } from "../types";
import { MOCK_PROSPECTS } from "../utils/mock-data";
import { ProspectListPane } from "./prospect-list-pane";
import { IntelligenceDetailPanel } from "./intelligence-detail-panel";

export function SalesInbox() {
  const [activeTab, setActiveTab] = useState<ProspectStatus>("new");
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(
    MOCK_PROSPECTS[0]?.id ?? null
  );

  const selectedProspect =
    MOCK_PROSPECTS.find((p) => p.id === selectedProspectId) ?? null;

  return (
    <div className="flex h-full overflow-hidden">
      <ProspectListPane
        prospects={MOCK_PROSPECTS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedId={selectedProspectId}
        onSelect={setSelectedProspectId}
      />
      <IntelligenceDetailPanel prospect={selectedProspect} />
    </div>
  );
}
