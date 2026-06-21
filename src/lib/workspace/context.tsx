"use client";

import { createContext, useContext } from "react";
import type { WorkspaceContextValue } from "./types";

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return ctx;
}

interface WorkspaceProviderProps {
  slug: string;
  children: React.ReactNode;
}

export function WorkspaceProvider({ slug, children }: WorkspaceProviderProps) {
  return (
    <WorkspaceContext.Provider value={{ slug }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
