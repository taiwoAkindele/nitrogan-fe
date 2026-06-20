"use client";

import { useState } from "react";
import {
  MapPin,
  Link as LinkIcon,
  Users,
  BadgeCheck,
  Mail,
  Calendar,
  RefreshCw,
  Check,
  Bookmark,
  MoreHorizontal,
  CirclePlay,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ProspectDetail, ProspectStatus } from "../types";

interface IntelligenceDetailHeaderProps {
  prospect: ProspectDetail;
  onStatusChange: (prospectId: string, newStatus: ProspectStatus) => void;
}

export function IntelligenceDetailHeader({
  prospect,
  onStatusChange,
}: IntelligenceDetailHeaderProps) {
  // Tracks which prospect was last synced, so switching prospects resets the
  // button without an effect. TODO: server call to the connected CRM.
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const isSynced = syncedId === prospect.id;

  return (
    <div className="border-b border-border bg-card p-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex gap-6">
          <Avatar
            initials={prospect.companyInitial}
            size="lg"
            shape="xl"
            className={cn("border-4 border-muted text-white", prospect.avatarColor)}
          />
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-3xl font-bold">{prospect.companyName}</h1>
              <BadgeCheck className="size-5 text-primary" />
            </div>
            <p className="font-medium text-muted-foreground">
              {prospect.description}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {prospect.location}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <LinkIcon className="size-4" />
                {prospect.websiteUrl}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="size-4" />
                {prospect.employeeCount.toLocaleString()} Employees
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 font-bold"
            onClick={() => onStatusChange(prospect.id, "saved")}
          >
            <Bookmark
              className={cn("size-4", prospect.status === "saved" && "fill-current")}
            />
            {prospect.status === "saved" ? "Saved" : "Save"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {prospect.status !== "active" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(prospect.id, "active")}
                >
                  <CirclePlay className="mr-2 size-4" />
                  Move to Active
                </DropdownMenuItem>
              )}
              {prospect.status !== "archive" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(prospect.id, "archive")}
                >
                  <Archive className="mr-2 size-4" />
                  Move to Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="flex-1 gap-2 font-bold shadow-lg shadow-primary/20">
          <Mail className="size-5" />
          Send Personalized Email
        </Button>
        <Button variant="outline" className="flex-1 gap-2 font-bold">
          <Calendar className="size-5" />
          Book Meeting
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 font-bold"
          onClick={() => setSyncedId(prospect.id)}
        >
          {isSynced ? (
            <>
              <Check className="size-5 text-emerald-500" />
              Synced to CRM
            </>
          ) : (
            <>
              <RefreshCw className="size-5" />
              Sync to CRM
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
