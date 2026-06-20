import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { SampleLead } from "../types";

const MAX_MATCH_SCORE = 10;

const TRIGGER_TONES: Record<string, BadgeTone> = {
  FUNDING: "success",
  EXPANSION: "info",
  HIRING: "warning",
};

interface SamplePreviewTableProps {
  leads: SampleLead[];
  onRefresh: () => void;
}

export function SamplePreviewTable({
  leads,
  onRefresh,
}: SamplePreviewTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Live Sample Preview</h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-sm font-bold text-primary"
          onClick={onRefresh}
        >
          Refresh Data
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground">
              <th className="px-6 py-3 font-bold">Company</th>
              <th className="px-6 py-3 font-bold">Triggers</th>
              <th className="px-6 py-3 font-bold">Match Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={lead.companyInitial}
                      size="sm"
                      shape="square"
                      className="border border-border bg-muted text-muted-foreground"
                    />
                    <span className="font-medium">{lead.company}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge tone={TRIGGER_TONES[lead.trigger] ?? "neutral"}>
                    {lead.trigger}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(lead.matchScore / MAX_MATCH_SCORE) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs">{lead.matchScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
