/**
 * Token management utilities for handling both localStorage and cookie storage
 */

export const tokenUtils = {
  /**
   * Set access token in both localStorage and cookie
   */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    
    // Store in localStorage for client-side access
    localStorage.setItem("accessToken", token);
    
    // Store in cookie for middleware access
    document.cookie = `accessToken=${token}; path=/; secure; samesite=strict; max-age=3600`;
  },

  /**
   * Get access token from localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },

  /**
   * Clear access token from both localStorage and cookie
   */
  clearToken(): void {
    if (typeof window === "undefined") return;
    
    // Clear from localStorage
    localStorage.removeItem("accessToken");
    
    // Clear cookie
    document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },

  /**
   * Check if token exists
   */
  hasToken(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if token is expired (basic check without validation)
   * Returns true if token appears to be expired based on JWT structure
   */
  isTokenExpired(token?: string): boolean {
    const accessToken = token || this.getToken();
    if (!accessToken) return true;

    try {
      // Parse JWT payload (this is just for expiration check, not security validation)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true; // If we can't parse it, consider it expired
    }
  },

  /**
   * Get time until token expires (in seconds)
   */
  getTokenTimeToExpiry(token?: string): number {
    const accessToken = token || this.getToken();
    if (!accessToken) return 0;

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch {
      return 0;
    }
  },

  /**
   * Sync token from cookie to localStorage (useful on app startup)
   */
  syncFromCookie(): void {
    if (typeof window === "undefined") return;

    // Get token from cookie
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );

    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      if (token && token !== '') {
        localStorage.setItem("accessToken", token);
      }
    }
  }
};