"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Shield, Clock, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace/context";
import { buildIcpSummary } from "../utils/icp-summary";
import { computePrediction } from "../utils/prediction";
import {
  hasAudience,
  previewToStats,
  samplesToLeads,
  toBuilderState,
  toPreviewInput,
  toSegmentInput,
} from "../utils/segment-mappers";
import {
  useDiscoveryOptions,
  useDiscoveryPreview,
  useLatestSegment,
  useRunDiscovery,
  useSaveSegment,
} from "../hooks";
import { useLeadBuilderState } from "../hooks/use-lead-builder-state";
import type { BuilderState } from "../types";
import type { DiscoveryOptions } from "../types/discovery";
import { BuilderConfigPane } from "./builder-config-pane";
import { PredictorPanel } from "./predictor-panel";

// A new org with no saved segment starts from a real, matchable ICP (these are
// guaranteed-present PDL values) so the first screen shows a live prediction.
const DEFAULT_ICP: BuilderState = {
  industries: ["financial services"],
  geographies: ["nigeria", "kenya"],
  companySizeRange: [50, 500],
  selectedTechIds: [],
  intentTriggers: {},
};

function CenteredState({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Loads builder options + the latest saved segment, then mounts the builder. */
export function LeadBuilder() {
  const { slug } = useWorkspace();
  const optionsQuery = useDiscoveryOptions(slug);
  const latestQuery = useLatestSegment(slug);

  if (optionsQuery.isLoading || latestQuery.isLoading) {
    return (
      <CenteredState>
        <Loader2 className="size-6 animate-spin text-primary" />
        Loading lead builder…
      </CenteredState>
    );
  }

  if (optionsQuery.isError || !optionsQuery.data) {
    return (
      <CenteredState>
        <p className="text-destructive">
          {optionsQuery.error?.message ?? "Couldn’t load discovery options."}
        </p>
        <Button variant="outline" onClick={() => optionsQuery.refetch()}>
          Retry
        </Button>
      </CenteredState>
    );
  }

  // latest may be null (no saved segment) or have errored (treat as none).
  const initialState = latestQuery.data
    ? toBuilderState(latestQuery.data)
    : DEFAULT_ICP;

  return (
    <LeadBuilderInner
      slug={slug}
      options={optionsQuery.data}
      initialState={initialState}
      initialSegmentId={latestQuery.data?.id ?? null}
    />
  );
}

interface InnerProps {
  slug: string;
  options: DiscoveryOptions;
  initialState: BuilderState;
  initialSegmentId: string | null;
}

function LeadBuilderInner({
  slug,
  options,
  initialState,
  initialSegmentId,
}: InnerProps) {
  const router = useRouter();
  // Mobile only (<lg): build the ICP first, then step to the prediction + actions.
  const [step, setStep] = useState<"build" | "preview">("build");
  // Tracks the saved segment so Save updates rather than duplicating.
  const [segmentId, setSegmentId] = useState<string | null>(initialSegmentId);

  const {
    state,
    addIndustry,
    removeIndustry,
    addGeography,
    removeGeography,
    setCompanySize,
    toggleTech,
    toggleTrigger,
  } = useLeadBuilderState(initialState);

  const audience = hasAudience(state);
  const preview = useDiscoveryPreview(slug, toPreviewInput(state), audience);
  const save = useSaveSegment(slug);
  const run = useRunDiscovery(slug);

  // Real numbers when the server preview is in; computePrediction is the instant
  // optimistic estimate shown while the debounced request resolves.
  const prediction = preview.data
    ? previewToStats(preview.data)
    : computePrediction(state);
  const sampleLeads =
    audience && preview.data ? samplesToLeads(preview.data.sample) : [];

  const persist = () => {
    const name = buildIcpSummary(state, options.techCatalog);
    return save.mutateAsync({
      id: segmentId ?? undefined,
      input: toSegmentInput(state, name),
    });
  };

  const handleSave = () => {
    void persist().then((seg) => setSegmentId(seg.id));
  };

  const handleRunDiscovery = async () => {
    try {
      const seg = await persist();
      setSegmentId(seg.id);
      const res = await run.mutateAsync(seg.id);
      toast.success(
        `${res.added} prospect${res.added === 1 ? "" : "s"} added to your inbox`,
      );
      router.push(`/org/${slug}/leads`);
    } catch {
      // The axios client already surfaced the error toast.
    }
  };

  const busy = save.isPending || run.isPending;

  return (
    <div className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {/* Step 1 (Build) */}
      <aside
        className={cn(
          "w-full flex-col border-b border-border lg:flex lg:w-[420px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0",
          step === "build" ? "flex" : "hidden",
        )}
      >
        <BuilderConfigPane
          state={state}
          availableIndustries={options.industries.map((f) => f.value)}
          availableGeographies={options.geographies.map((f) => f.value)}
          techCatalog={options.techCatalog}
          intentTriggers={options.intentTriggers}
          onAddIndustry={addIndustry}
          onRemoveIndustry={removeIndustry}
          onAddGeography={addGeography}
          onRemoveGeography={removeGeography}
          onCompanySizeChange={setCompanySize}
          onToggleTech={toggleTech}
          onToggleTrigger={toggleTrigger}
        />

        {/* Mobile: proceed to the prediction */}
        <div className="sticky bottom-0 z-10 border-t border-border bg-card p-4 lg:hidden">
          <Button
            className="h-11 w-full gap-2 font-bold"
            onClick={() => setStep("preview")}
          >
            Next: Preview
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </aside>

      {/* Step 2 (Preview) */}
      <section
        className={cn(
          "relative flex-1 flex-col lg:flex lg:overflow-hidden",
          step === "preview" ? "flex" : "hidden",
        )}
      >
        <button
          type="button"
          onClick={() => setStep("build")}
          className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <ArrowLeft className="size-4" />
          Edit audience
        </button>

        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div className="absolute right-10 top-10 size-96 rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-10 left-10 size-64 rounded-full bg-primary blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 p-4 md:p-8 lg:overflow-y-auto">
          {!audience ? (
            <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
              Pick at least one industry and geography to see your live audience.
            </div>
          ) : (
            <PredictorPanel
              prediction={prediction}
              sampleLeads={sampleLeads}
              onRefreshSample={() => void preview.refetch()}
            />
          )}
        </div>

        {/* Footer Action Bar */}
        <footer className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border bg-card px-4 py-3 md:px-8 md:py-4 lg:static">
          <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <div className="flex items-center gap-2">
              <Shield className="size-4" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{preview.isFetching ? "Updating…" : "Live estimate"}</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button
              variant="outline"
              className="font-bold"
              onClick={handleSave}
              disabled={busy}
            >
              {save.isPending && !run.isPending ? "Saving…" : "Save as Draft"}
            </Button>
            <Button
              className="gap-2 font-bold shadow-lg shadow-primary/30"
              onClick={handleRunDiscovery}
              disabled={busy || !audience}
            >
              {run.isPending ? "Running…" : "Run Discovery"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
