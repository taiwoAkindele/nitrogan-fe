import type { ProspectDetail, ProspectStatus } from "../types";
import { IntelligenceDetailHeader } from "./intelligence-detail-header";
import { IntentScoreChart } from "./intent-score-chart";
import { FirmographicsCard } from "./firmographics-card";
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
      <IntelligenceDetailHeader
        prospect={prospect}
        onStatusChange={onStatusChange}
      />

      <div className="grid grid-cols-12 gap-6 p-8">
        {/* Left Column */}
        <div className="col-span-8 space-y-6">
          <IntentScoreChart score={prospect.intentScore} />
          <SignalList signals={prospect.signals} />
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          <PersonaList personas={prospect.personas} />
          <FirmographicsCard firmographics={prospect.firmographics} />
        </div>
      </div>
    </section>
  );
}
