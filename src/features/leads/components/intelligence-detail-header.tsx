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
    <div className="border-b border-border bg-card p-4 md:p-8">
      {/* Identity + quick actions — stays on one row even on mobile */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            initials={prospect.companyInitial}
            size="lg"
            shape="xl"
            className={cn(
              "shrink-0 border-4 border-muted text-white",
              prospect.avatarColor
            )}
          />
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-2xl font-bold md:text-3xl">
              {prospect.companyName}
            </h1>
            <BadgeCheck className="size-5 shrink-0 text-primary" />
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
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

      {/* Company details — separate section so the row above never overflows */}
      <div className="mb-6 space-y-2">
        <p className="font-medium text-muted-foreground">
          {prospect.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="h-11 w-full gap-2 font-bold shadow-lg shadow-primary/20 sm:h-9 sm:flex-1">
          <Mail className="size-4" />
          Send Personalized Email
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full gap-2 font-bold sm:h-9 sm:flex-1"
        >
          <Calendar className="size-4" />
          Book Meeting
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full gap-2 font-bold sm:h-9 sm:flex-1"
          onClick={() => setSyncedId(prospect.id)}
        >
          {isSynced ? (
            <>
              <Check className="size-4 text-emerald-500" />
              Synced to CRM
            </>
          ) : (
            <>
              <RefreshCw className="size-4" />
              Sync to CRM
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
