import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  canAccessPath,
  getRedirectPath,
  isPublicRoute,
} from "@/lib/route-config";
import { User } from "@/services/auth.service";

// Define protected routes that should be checked by middleware
const protectedRoutes = [
  "/admin",
  "/site-manager", 
  "/worker",
  "/client",
  "/sites",
  "/reports",
  "/profile",
  "/settings",
];

// Define public routes that don't need authentication
const publicRoutes = ["/", "/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublic = publicRoutes.includes(pathname) || isPublicRoute(pathname);

  // Get tokens from cookies and localStorage (we'll use a workaround for localStorage)
  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  let user: User | null = null;
  let isAuthenticated = false;

  // Verify JWT token if present
  if (accessToken) {
    try {
      const jwtSecret =
        process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production";
      const secret = new TextEncoder().encode(jwtSecret);

      const { payload } = await jwtVerify(accessToken, secret);

      user = {
        userId: payload.userId as string,
        email: payload.email as string,
        role: payload.role as User["role"],
        companyId: payload.companyId as string,
        firstName: "",
        lastName: "",
        companyName: "",
        isActive: true,
      };

      isAuthenticated = true;
    } catch (error) {
      // Token is invalid or expired
      console.log("Token verification failed:", error);
      isAuthenticated = false;
    }
  }

  // Handle public routes
  if (isPublic) {
    // If user is authenticated and trying to access login/signup, redirect to dashboard
    if (
      isAuthenticated &&
      user &&
      (pathname === "/login" || pathname === "/signup")
    ) {
      const dashboardUrl = new URL(
        getRedirectPath(pathname, user.role, isAuthenticated),
        request.url
      );
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    // Check if user is authenticated
    console.log("isauthenticated", isAuthenticated);
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      // Add redirect parameter to go back to original page after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has permission to access this route
    if (!canAccessPath(pathname, user?.role, isAuthenticated)) {
      const redirectUrl = new URL(
        getRedirectPath(pathname, user?.role, isAuthenticated),
        request.url
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Add user info to headers for use in components
  if (isAuthenticated && user) {
    const response = NextResponse.next();
    response.headers.set("x-user-role", user.role);
    response.headers.set("x-user-id", user.userId);
    response.headers.set("x-company-id", user.companyId);
    return response;
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
