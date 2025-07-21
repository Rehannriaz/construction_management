'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/api/use-auth';
import { canAccessPath, getRedirectPath, findMatchingRoute } from '@/lib/route-config';
import { Building2, ShieldAlert, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showUnauthorized?: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  fallback,
  showUnauthorized = true
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current route requires authentication and user has access
  const routeConfig = findMatchingRoute(pathname);
  const hasAccess = canAccessPath(pathname, user?.role, isAuthenticated);
  const requiresAuth = routeConfig?.requireAuth ?? true;

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;

    // If route requires auth but user is not authenticated
    if (requiresAuth && !isAuthenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // If user doesn't have access to this route
    if (!hasAccess && isAuthenticated && user) {
      const redirectPath = getRedirectPath(pathname, user.role, isAuthenticated);
      router.push(redirectPath);
      return;
    }
  }, [isLoading, isAuthenticated, user, pathname, hasAccess, requiresAuth, router]);

  // Show loading while checking auth
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/30">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Building2 className="h-12 w-12 text-primary" />
            <Loader2 className="absolute -top-1 -right-1 h-4 w-4 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">Loading Site Tasker</h3>
            <p className="text-sm text-muted-foreground">Verifying your access...</p>
          </div>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render (will redirect)
  if (requiresAuth && !isAuthenticated) {
    return null;
  }

  // If user doesn't have access, show unauthorized message or redirect
  if (!hasAccess) {
    if (!showUnauthorized) {
      return null;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/20 to-secondary/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription>
              You don&apos;t have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                This page is restricted to {routeConfig?.allowedRoles.join(', ')} users.
                {user ? ` Your current role is: ${user.role}` : ''}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => {
                  if (user) {
                    const dashboardPath = getRedirectPath('', user.role, true);
                    router.push(dashboardPath);
                  } else {
                    router.push('/login');
                  }
                }}
                className="flex-1"
              >
                {user ? 'Go to Dashboard' : 'Sign In'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};