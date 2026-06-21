import { Mail, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SENDING_PROFILE } from "../utils/mock-data";

export function SendingSection() {
  const verified = SENDING_PROFILE.domainStatus === "verified";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Mail className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">{SENDING_PROFILE.mailbox}</p>
            <p className="text-sm text-muted-foreground">Sending mailbox</p>
          </div>
        </div>
        <Badge tone={verified ? "success" : "warning"} shape="pill">
          {verified ? "Domain verified" : "Unverified"}
        </Badge>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Gauge className="size-5" />
          </span>
          <div>
            <p className="text-sm font-bold">Daily send cap</p>
            <p className="text-sm text-muted-foreground">
              Protects your sending-domain reputation.
            </p>
          </div>
        </div>
        <span className="text-lg font-bold">{SENDING_PROFILE.dailyCap}/day</span>
      </div>

      <Button variant="outline" className="font-bold">
        Manage sending
      </Button>
    </div>
  );
}
