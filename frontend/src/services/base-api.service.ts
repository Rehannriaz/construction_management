// Base API service with improved error handling and token management
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  public status: number;
  public response: ApiResponse;

  constructor(status: number, response: ApiResponse) {
    super(response.message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

class BaseApiService {
  private baseUrl: string;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  }

  protected setAccessToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
  }

  protected clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include refresh token cookie
      });

      const data: ApiResponse<{ accessToken: string }> = await response.json();

      if (response.ok && data.success && data.data?.accessToken) {
        this.setAccessToken(data.data.accessToken);
        return data.data.accessToken;
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      // Clear tokens and redirect to login
      this.clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    }
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const accessToken = this.getAccessToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      let response = await fetch(url, config);
      let data = await response.json();

      // Handle 401 - Token expired, try to refresh
      if (response.status === 401 && accessToken) {
        try {
          const newToken = await this.refreshAccessToken();

          // Retry request with new token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          };

          response = await fetch(url, retryConfig);
          data = await response.json();
        } catch {
          throw new ApiError(401, {
            success: false,
            message: "Authentication failed",
          });
        }
      }

      if (!response.ok) {
        throw new ApiError(response.status, data);
      }

      return data.data || data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(0, {
        success: false,
        message:
          error instanceof Error ? error.message : "Network error occurred",
      });
    }
  }

  // HTTP Methods
  protected async get<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(endpoint + url.search);
  }

  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      ...options,
    });
  }
}

export { BaseApiService };
