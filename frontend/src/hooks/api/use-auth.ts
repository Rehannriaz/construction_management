import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  authService, 
  type SignInRequest, 
  type SignUpRequest, 
  type CreateUserRequest
} from '@/services/auth.service';
import { queryKeys } from '@/lib/query-client';
import { getDefaultDashboard } from '@/lib/route-config';

// Get current user query
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors (token expired/invalid)
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Sign in mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInRequest) => authService.signIn(data),
    onSuccess: (data) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      
      // Show success message
      toast.success('Welcome back! Redirecting to your dashboard...');
      
      // Redirect to appropriate dashboard
      const dashboardRoute = getDefaultDashboard(data.user.role);
      router.push(dashboardRoute);
    },
    onError: (error: unknown) => {
      const message = (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'message' in error.response && typeof error.response.message === 'string') 
        ? error.response.message 
        : (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') 
          ? error.message 
          : 'Sign in failed';
      toast.error(message);
    },
  });
};

// Sign up mutation
export const useSignUp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpRequest) => authService.signUp(data),
    onSuccess: (data) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      
      // Show success message
      toast.success('Account created successfully! Welcome to Site Tasker.');
      
      // Redirect to admin dashboard (signup creates admin user)
      router.push('/admin/dashboard');
    },
    onError: (error: unknown) => {
      // Handle ApiError - check for both validation errors and general messages
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { errors?: Array<{ field: string; message: string }>; message?: string } };
        
        // If there are validation errors, show them in toast
        if (apiError.response.errors && apiError.response.errors.length > 0) {
          const errorMessages = apiError.response.errors.map(err => err.message);
          toast.error(errorMessages.join(', '));
          return;
        }
        
        // If there's a general error message, show it
        if (apiError.response.message) {
          toast.error(apiError.response.message);
          return;
        }
      }
      
      // Fallback for other error types
      const message = (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') 
        ? error.message 
        : 'Registration failed';
      toast.error(message);
    },
  });
};

// Sign out mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Show success message
      toast.success('You have been signed out successfully');
      
      // Redirect to login
      router.push('/login');
    },
    onError: (error: unknown) => {
      // Even if the API call fails, we should still sign out locally
      queryClient.clear();
      router.push('/login');
      
      const message = (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'message' in error.response && typeof error.response.message === 'string') 
        ? error.response.message 
        : 'Sign out completed';
      toast.success(message);
    },
  });
};

// Sign out all devices mutation
export const useSignOutAll = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authService.signOutAll(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Show success message
      toast.success('Signed out from all devices successfully');
      
      // Redirect to login
      router.push('/login');
    },
    onError: (error: unknown) => {
      // Even if the API call fails, we should still sign out locally
      queryClient.clear();
      router.push('/login');
      
      const message = (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'message' in error.response && typeof error.response.message === 'string') 
        ? error.response.message 
        : 'Signed out from all devices';
      toast.success(message);
    },
  });
};

// Create user mutation (Admin only)
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => authService.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      
      // Show success message
      toast.success('User created successfully');
    },
    onError: (error: unknown) => {
      const message = (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'message' in error.response && typeof error.response.message === 'string') 
        ? error.response.message 
        : (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') 
          ? error.message 
          : 'Failed to create user';
      toast.error(message);
    },
  });
};

// Custom hook for auth state management
export const useAuth = () => {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const signOutMutation = useSignOut();

  return {
    // User data
    user: user || null,
    isLoading,
    isAuthenticated: !!user && authService.isAuthenticated(),
    error,
    
    // Auth actions
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    refreshUser: refetch,
    
    // Loading states
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    
    // Error states
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
    
    // Validation errors helper
    getSignUpValidationErrors: () => {
      const error = signUpMutation.error;
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { errors?: Array<{ field: string; message: string }> } };
        return apiError.response.errors || [];
      }
      return [];
    },
    
    // General error message helper
    getSignUpErrorMessage: () => {
      const error = signUpMutation.error;
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { errors?: Array<{ field: string; message: string }>; message?: string } };
        
        // If there are validation errors, don't show general message (field errors take priority)
        if (apiError.response.errors && apiError.response.errors.length > 0) {
          return null;
        }
        
        // Return general error message
        return apiError.response.message || null;
      }
      return null;
    },
  };
};

// Hook to check user permissions
export const usePermissions = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isSiteManager: user?.role === 'site_manager',
    isWorker: user?.role === 'worker',
    isClient: user?.role === 'client',
    canManageUsers: user?.role === 'admin',
    canManageSites: user?.role === 'admin' || user?.role === 'site_manager',
    canViewReports: user?.role === 'admin' || user?.role === 'site_manager',
    canCreateReports: user?.role === 'admin' || user?.role === 'site_manager' || user?.role === 'worker',
  };
};