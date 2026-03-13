"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 300_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof Error && "status" in error) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(getQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
