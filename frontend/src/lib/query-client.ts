import { QueryClient } from '@tanstack/react-query';

// Create a query client with default options
export const queryClient = new QueryClient({
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
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth keys
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  // Users keys
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.users.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
  // Sites keys
  sites: {
    all: ['sites'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.sites.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.sites.all, 'detail', id] as const,
  },
  // Reports keys
  reports: {
    all: ['reports'] as const,
    daily: (filters?: Record<string, unknown>) => 
      [...queryKeys.reports.all, 'daily', filters] as const,
    weekly: (filters?: Record<string, unknown>) => 
      [...queryKeys.reports.all, 'weekly', filters] as const,
  },
} as const;