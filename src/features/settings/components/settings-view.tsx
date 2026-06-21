"use client";

import { useState } from "react";

import { TabBar, type TabItem } from "@/components/ui/tab-bar";
import { TeamSection } from "./team-section";
import { IntegrationsSection } from "./integrations-section";
import { SendingSection } from "./sending-section";

type SettingsTab = "team" | "integrations" | "sending";

export function SettingsView() {
  const [tab, setTab] = useState<SettingsTab>("team");

  const tabs: TabItem<SettingsTab>[] = [
    { value: "team", label: "Team & Seats" },
    { value: "integrations", label: "Integrations" },
    { value: "sending", label: "Sending" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your team, integrations, and outreach configuration.
        </p>
      </header>

      <TabBar tabs={tabs} value={tab} onChange={setTab} className="mb-8" />

      {tab === "team" && <TeamSection />}
      {tab === "integrations" && <IntegrationsSection />}
      {tab === "sending" && <SendingSection />}
    </div>
  );
}
