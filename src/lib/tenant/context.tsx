"use client";

import { createContext, useContext } from "react";
import type { TenantContextValue } from "./types";

const TenantContext = createContext<TenantContextValue | null>(null);

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
}

interface TenantProviderProps {
  tenantId: string;
  children: React.ReactNode;
}

export function TenantProvider({ tenantId, children }: TenantProviderProps) {
  return (
    <TenantContext.Provider value={{ tenantId }}>
      {children}
    </TenantContext.Provider>
  );
}
