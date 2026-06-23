"use client";

import { useState } from "react";

import type { BuilderState } from "../types";
import { DEFAULT_BUILDER_STATE } from "../utils/mock-data";

/** Owns the ICP builder state and the immutable updates for each control. */
export function useLeadBuilderState(initial: BuilderState = DEFAULT_BUILDER_STATE) {
  const [state, setState] = useState<BuilderState>(initial);

  const addIndustry = (industry: string) =>
    setState((prev) => ({
      ...prev,
      industries: [...prev.industries, industry],
    }));

  const removeIndustry = (industry: string) =>
    setState((prev) => ({
      ...prev,
      industries: prev.industries.filter((i) => i !== industry),
    }));

  const addGeography = (geo: string) =>
    setState((prev) => ({
      ...prev,
      geographies: [...prev.geographies, geo],
    }));

  const removeGeography = (geo: string) =>
    setState((prev) => ({
      ...prev,
      geographies: prev.geographies.filter((g) => g !== geo),
    }));

  const setCompanySize = (value: number) =>
    setState((prev) => ({
      ...prev,
      companySizeRange: [prev.companySizeRange[0], value],
    }));

  const toggleTech = (techId: string) =>
    setState((prev) => ({
      ...prev,
      selectedTechIds: prev.selectedTechIds.includes(techId)
        ? prev.selectedTechIds.filter((id) => id !== techId)
        : [...prev.selectedTechIds, techId],
    }));

  const toggleTrigger = (triggerId: string) =>
    setState((prev) => ({
      ...prev,
      intentTriggers: {
        ...prev.intentTriggers,
        [triggerId]: !prev.intentTriggers[triggerId],
      },
    }));

  const refreshSample = () => {
    // TODO: fetch fresh sample from server
  };

  return {
    state,
    addIndustry,
    removeIndustry,
    addGeography,
    removeGeography,
    setCompanySize,
    toggleTech,
    toggleTrigger,
    refreshSample,
  };
}
