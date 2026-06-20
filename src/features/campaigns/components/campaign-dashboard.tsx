"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TabBar, type TabItem } from "@/components/ui/tab-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { useTenant } from "@/lib/tenant/context";

import type { CampaignStatus } from "../types";
import { MOCK_CAMPAIGNS, MOCK_NETWORK_STATS } from "../utils/mock-data";
import { CampaignCard } from "./campaign-card";
import { NetworkStatsBanner } from "./network-stats-banner";

type TabFilter = "all" | CampaignStatus;

export function CampaignDashboard() {
  const { tenantId } = useTenant();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const campaigns = MOCK_CAMPAIGNS;
  const countByStatus = (status: CampaignStatus) =>
    campaigns.filter((c) => c.status === status).length;

  const tabs: TabItem<TabFilter>[] = [
    { value: "all", label: "All Bots", count: campaigns.length },
    { value: "active", label: "Active", count: countByStatus("active") },
    { value: "draft", label: "Draft", count: countByStatus("draft") },
    { value: "paused", label: "Paused", count: countByStatus("paused") },
  ];

  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === activeTab);

  return (
    <div className="mx-auto w-full max-w-7xl p-6 md:p-10">
      {/* Page Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground">
            Campaign Management
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Deploy and monitor high-velocity B2B lead generation sequences at
            scale.
          </p>
        </div>
        {/* A campaign needs an audience first — start in Discovery. */}
        <Button
          size="lg"
          className="gap-2 font-bold tracking-wide shadow-lg shadow-primary/20"
          render={<Link href={`/org/${tenantId}/strategy`} />}
        >
          <PlusCircle className="size-5" />
          Create New Bot
        </Button>
      </div>

      {/* Filter Tabs */}
      <TabBar
        variant="underline"
        className="mb-8"
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3">
            <EmptyState className="h-auto rounded-xl border border-dashed border-border py-12">
              {activeTab === "all"
                ? "No campaigns yet — create your first below."
                : `No ${activeTab} campaigns.`}
            </EmptyState>
          </div>
        )}
        {filteredCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            href={`/org/${tenantId}/campaigns/${campaign.id}`}
          />
        ))}

        {/* New Automation Card */}
        <Link
          href={`/org/${tenantId}/strategy`}
          className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:bg-muted/40"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
            <Plus className="size-7" />
          </div>
          <p className="font-bold text-foreground">New Automation</p>
          <p className="text-sm text-muted-foreground">
            Scale your outreach by creating a new AI bot.
          </p>
        </Link>
      </div>

      {/* Network Stats Banner */}
      <NetworkStatsBanner stats={MOCK_NETWORK_STATS} />
    </div>
  );
}
