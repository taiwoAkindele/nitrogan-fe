import {
  MapPin,
  Link as LinkIcon,
  Users,
  BadgeCheck,
  Mail,
  Calendar,
  RefreshCw,
  Bookmark,
  MoreHorizontal,
  CirclePlay,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProspectDetail, ProspectStatus } from "../types";
import { SignalList } from "./signal-list";
import { PersonaList } from "./persona-list";

interface IntelligenceDetailPanelProps {
  prospect: ProspectDetail | null;
  onStatusChange: (prospectId: string, newStatus: ProspectStatus) => void;
}

export function IntelligenceDetailPanel({
  prospect,
  onStatusChange,
}: IntelligenceDetailPanelProps) {
  if (!prospect) {
    return (
      <section className="flex flex-1 items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">
          Select a prospect to view details
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col overflow-y-auto bg-muted/30">
      {/* Company Header */}
      <div className="border-b border-border bg-card p-8">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex gap-6">
            <div
              className={`flex size-20 items-center justify-center rounded-xl border-4 border-muted text-3xl font-bold text-white ${prospect.avatarColor}`}
            >
              {prospect.companyInitial}
            </div>
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
                className={`size-4 ${prospect.status === "saved" ? "fill-current" : ""}`}
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
          <Button variant="outline" className="flex-1 gap-2 font-bold">
            <RefreshCw className="size-5" />
            Sync to CRM
          </Button>
        </div>
      </div>

      {/* Intelligence Content */}
      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Left Column */}
        <div className="col-span-8 space-y-6">
          {/* Intent Score Placeholder */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Intent Score Over Time
              </h3>
              <span className="text-sm font-bold text-primary">
                {prospect.intentScore}/100 &bull; Critical
              </span>
            </div>
            <div className="flex h-48 w-full items-end gap-2 rounded-lg bg-muted/50 p-4">
              {[25, 33, 40, 50, 60, 100, 80].map((height, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${
                    height >= 80
                      ? "bg-primary"
                      : height >= 50
                        ? "bg-primary/40"
                        : "bg-primary/20"
                  }`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          {/* Signals */}
          <SignalList signals={prospect.signals} />
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          <PersonaList personas={prospect.personas} />

          {/* Firmographics */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Firmographics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {prospect.firmographics.map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    {item.label}
                  </p>
                  <p
                    className={`text-sm font-bold ${item.highlight ? "text-green-500" : ""}`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
