import { UserPlus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEAT_USAGE, TEAM_MEMBERS } from "../utils/mock-data";

export function TeamSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
        <div>
          <p className="text-sm font-bold">Seats</p>
          <p className="text-sm text-muted-foreground">
            {SEAT_USAGE.used} of {SEAT_USAGE.total} seats used
          </p>
        </div>
        <Button className="gap-2 font-bold">
          <UserPlus className="size-4" />
          Invite member
        </Button>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-4">
            <Avatar
              initials={member.avatarInitial}
              size="md"
              shape="circle"
              className="bg-muted text-muted-foreground"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
            <Badge
              tone={member.role === "Admin" ? "info" : "neutral"}
              shape="pill"
            >
              {member.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
