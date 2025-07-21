"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client on the client side to avoid serialization issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time - how long data stays fresh
            staleTime: 1000 * 60 * 5, // 5 minutes
            // Cache time - how long data stays in cache after being unused
            gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
            // Retry configuration
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors except 401 (token expired)
              if (error && typeof error === 'object' && 'status' in error && 
                  typeof error.status === 'number' && error.status >= 400 && 
                  error.status < 500 && error.status !== 401) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            // Refetch on window focus for important data
            refetchOnWindowFocus: false,
            // Background refetch interval
            refetchInterval: false,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}