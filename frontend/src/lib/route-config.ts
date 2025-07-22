import { User } from '@/services/auth.service';

// Define all available routes and their access permissions
export interface RoutePermission {
  path: string;
  allowedRoles: User['role'][];
  requireAuth: boolean;
  isExact?: boolean; // If true, only exact path matches
}

// Route configuration - Define what roles can access which pages
export const routePermissions: RoutePermission[] = [
  // Public routes (no auth required)
  {
    path: '/',
    allowedRoles: ['admin', 'site_manager', 'worker', 'client'],
    requireAuth: false,
  },
  {
    path: '/login',
    allowedRoles: ['admin', 'site_manager', 'worker', 'client'],
    requireAuth: false,
  },
  {
    path: '/signup',
    allowedRoles: ['admin', 'site_manager', 'worker', 'client'],
    requireAuth: false,
  },


  // Admin routes - Full system access
  {
    path: '/admin',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/users',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/sites',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/companies',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/reports',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/analytics',
    allowedRoles: ['admin'],
    requireAuth: true,
  },
  {
    path: '/admin/settings',
    allowedRoles: ['admin'],
    requireAuth: true,
  },

  // Site Manager routes - Site management access
  {
    path: '/site-manager',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/sites',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/workers',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/reports',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/weekly-reports',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/whs-reports',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/tools',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/site-manager/deliveries',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },

  // Worker routes - Limited access
  {
    path: '/worker',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/worker/daily-reports',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/worker/my-sites',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/worker/photos',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/worker/leave',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/worker/profile',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },

  // Client routes - View-only access
  {
    path: '/client',
    allowedRoles: ['admin', 'client'],
    requireAuth: true,
  },
  {
    path: '/client/projects',
    allowedRoles: ['admin', 'client'],
    requireAuth: true,
  },
  {
    path: '/client/reports',
    allowedRoles: ['admin', 'client'],
    requireAuth: true,
  },
  {
    path: '/client/progress',
    allowedRoles: ['admin', 'client'],
    requireAuth: true,
  },
  {
    path: '/client/photos',
    allowedRoles: ['admin', 'client'],
    requireAuth: true,
  },

  // Shared routes - Accessible by multiple roles
  {
    path: '/sites',
    allowedRoles: ['admin', 'site_manager', 'worker'],
    requireAuth: true,
  },
  {
    path: '/reports',
    allowedRoles: ['admin', 'site_manager'],
    requireAuth: true,
  },
  {
    path: '/profile',
    allowedRoles: ['admin', 'site_manager', 'worker', 'client'],
    requireAuth: true,
  },
  {
    path: '/settings',
    allowedRoles: ['admin', 'site_manager', 'worker', 'client'],
    requireAuth: true,
  },
];

// Helper function to get default dashboard for each role
export const getDefaultDashboard = (role: User['role']): string => {
  const dashboards: Record<User['role'], string> = {
    admin: '/admin',
    site_manager: '/site-manager', 
    worker: '/worker',
    client: '/client',
  };
  return dashboards[role];
};

// Helper function to check if a user can access a specific path
export const canAccessPath = (
  path: string, 
  userRole?: User['role'], 
  isAuthenticated: boolean = false
): boolean => {
  // Find the most specific route match
  const matchingRoute = findMatchingRoute(path);
  
  if (!matchingRoute) {
    // No specific route found, default to requiring auth and admin access
    return false;
  }

  // Check authentication requirement
  if (matchingRoute.requireAuth && !isAuthenticated) {
    return false;
  }

  // If no auth required, allow access
  if (!matchingRoute.requireAuth) {
    return true;
  }

  // Check role permissions
  if (!userRole) {
    return false;
  }

  return matchingRoute.allowedRoles.includes(userRole);
};

// Find the most specific matching route for a given path
export const findMatchingRoute = (path: string): RoutePermission | undefined => {
  // First, try to find an exact match
  const exactMatch = routePermissions.find(
    route => route.isExact && route.path === path
  );
  
  if (exactMatch) {
    return exactMatch;
  }

  // Then, find the longest matching prefix
  const prefixMatches = routePermissions
    .filter(route => !route.isExact && path.startsWith(route.path))
    .sort((a, b) => b.path.length - a.path.length); // Sort by length descending

  return prefixMatches[0];
};

// Get all accessible routes for a user role
export const getAccessibleRoutes = (
  userRole: User['role'], 
  isAuthenticated: boolean = true
): RoutePermission[] => {
  return routePermissions.filter(route => 
    canAccessPath(route.path, userRole, isAuthenticated)
  );
};

// Check if path is a public route
export const isPublicRoute = (path: string): boolean => {
  const matchingRoute = findMatchingRoute(path);
  return matchingRoute ? !matchingRoute.requireAuth : false;
};

// Get redirect path for unauthorized access
export const getRedirectPath = (
  path: string,
  userRole?: User['role'],
  isAuthenticated: boolean = false
): string => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return '/login';
  }

  // If authenticated but no role, something is wrong - go to login
  if (!userRole) {
    return '/login';
  }

  // If trying to access login/signup while authenticated, go to dashboard
  if ((path === '/login' || path === '/signup') && isAuthenticated) {
    return getDefaultDashboard(userRole);
  }

  // If role doesn't have access, redirect to their dashboard
  return getDefaultDashboard(userRole);
};