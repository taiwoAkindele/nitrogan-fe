import { ArrowLeft } from "lucide-react";

import type { LeadFeedback, ProspectDetail, ProspectStatus } from "../types";
import { IntelligenceDetailHeader } from "./intelligence-detail-header";
import { IntentScoreChart } from "./intent-score-chart";
import { WhyThisLeadCard } from "./why-this-lead-card";
import { LeadQualityCard } from "./lead-quality-card";
import { FirmographicsCard } from "./firmographics-card";
import { SignalList } from "./signal-list";
import { PersonaList } from "./persona-list";

interface IntelligenceDetailPanelProps {
  prospect: ProspectDetail | null;
  onStatusChange: (prospectId: string, newStatus: ProspectStatus) => void;
  onRateLead: (prospectId: string, feedback: LeadFeedback) => void;
  /** Returns to the list on small/tablet (single-view) screens. */
  onBack: () => void;
}

export function IntelligenceDetailPanel({
  prospect,
  onStatusChange,
  onRateLead,
  onBack,
}: IntelligenceDetailPanelProps) {
  if (!prospect) {
    return (
      <section className="flex h-full w-full items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">
          Select a prospect to view details
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full w-full flex-col overflow-y-auto bg-muted/30">
      {/* Back to inbox — single-view screens only */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 border-b border-border bg-card px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:hidden"
      >
        <ArrowLeft className="size-4" />
        Back to inbox
      </button>

      <IntelligenceDetailHeader
        prospect={prospect}
        onStatusChange={onStatusChange}
      />

      <div className="grid grid-cols-12 gap-6 p-4 md:p-8">
        {/* Left Column — single column until xl; the sidebar collapses to a
            rail on the inbox, so xl+ has room for the two-column split. */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
          <IntentScoreChart score={prospect.intentScore} />
          <WhyThisLeadCard
            score={prospect.intentScore}
            signals={prospect.signals}
          />
          <LeadQualityCard
            score={prospect.intentScore}
            feedback={prospect.feedback}
            onRate={(feedback) => onRateLead(prospect.id, feedback)}
          />
          <SignalList signals={prospect.signals} />
        </div>

        {/* Right Column */}
        <div className="col-span-12 space-y-6 xl:col-span-4">
          <PersonaList personas={prospect.personas} />
          <FirmographicsCard firmographics={prospect.firmographics} />
        </div>
      </div>
    </section>
  );
}
