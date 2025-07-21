import { BaseApiService, ApiResponse } from './base-api.service';

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'site_manager' | 'worker' | 'client';
  companyId: string;
  companyName: string;
  isActive: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
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

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'site_manager' | 'worker' | 'client';
  phone?: string;
  employeeId?: string;
}

class AuthService extends BaseApiService {
  /**
   * Sign up a new company with admin user
   */
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/signup', data);
    
    // Store access token
    if (response.accessToken) {
      this.setAccessToken(response.accessToken);
    }
    
    return response;
  }

  /**
   * Sign in user
   */
  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/signin', data);
    
    // Store access token
    if (response.accessToken) {
      this.setAccessToken(response.accessToken);
    }
    
    return response;
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await this.post('/auth/signout');
    } finally {
      // Always clear tokens locally regardless of API response
      this.clearTokens();
    }
  }

  /**
   * Sign out from all devices
   */
  async signOutAll(): Promise<void> {
    try {
      await this.post('/auth/signout-all');
    } finally {
      this.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.get<{ user: User }>('/auth/me');
    return response.user;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await this.post<{ accessToken: string }>('/auth/refresh');
    
    if (response.accessToken) {
      this.setAccessToken(response.accessToken);
    }
    
    return response;
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await this.post<User>('/auth/create-user', data);
    return response;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  }

}

// Export singleton instance
export const authService = new AuthService();