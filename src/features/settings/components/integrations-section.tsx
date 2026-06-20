"use client";

import { useState } from "react";
import { Plug } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Integration } from "../types";
import { INTEGRATIONS } from "../utils/mock-data";

export function IntegrationsSection() {
  const [integrations, setIntegrations] =
    useState<Integration[]>(INTEGRATIONS);

  // Mock connect/disconnect. TODO: real OAuth flow + server call.
  const toggleConnection = (id: string) =>
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === "connected" ? "not_connected" : "connected",
            }
          : i
      )
    );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {integrations.map((integration) => {
        const connected = integration.status === "connected";
        return (
          <div
            key={integration.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Plug className="size-5" />
              </div>
              <Badge tone={connected ? "success" : "neutral"} shape="pill" dot={connected}>
                {connected ? "Connected" : "Not connected"}
              </Badge>
            </div>
            <div>
              <p className="font-bold">{integration.name}</p>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </div>
            <Button
              variant={connected ? "outline" : "default"}
              className="font-bold"
              onClick={() => toggleConnection(integration.id)}
            >
              {connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
