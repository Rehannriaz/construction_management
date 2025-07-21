// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "site_manager" | "worker" | "client";
  companyId: string;
  companyName: string;
  isActive: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  phone?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Generic API client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get access token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: "include", // Include cookies for refresh token
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 - Token expired, try to refresh
      if (response.status === 401 && accessToken) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success && refreshResult.data?.accessToken) {
          // Retry original request with new token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${refreshResult.data.accessToken}`,
            },
          };

          const retryResponse = await fetch(url, retryConfig);
          return await retryResponse.json();
        } else {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          throw new Error("Authentication failed");
        }
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signOut(): Promise<ApiResponse> {
    return this.request("/auth/signout", {
      method: "POST",
    });
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return this.request<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
    });
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>("/auth/me");
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request("/health");
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Helper function to handle API errors
export const handleApiError = (response: ApiResponse): string => {
  if (response.errors && response.errors.length > 0) {
    return response.errors.map((error) => error.message).join(", ");
  }
  return response.message || "An unexpected error occurred";
};
