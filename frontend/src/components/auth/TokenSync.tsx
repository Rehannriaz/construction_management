'use client';

import { useEffect } from 'react';
import { tokenUtils } from '@/utils/token';

/**
 * Component that handles token synchronization between cookies and localStorage
 * This ensures middleware and client-side code both have access to tokens
 */
export const TokenSync: React.FC = () => {
  useEffect(() => {
    // Sync token from cookie to localStorage on app startup
    // This is useful when the user has a valid token in cookies but not in localStorage
    tokenUtils.syncFromCookie();

    // Set up token expiration checking
    const checkTokenExpiration = () => {
      if (tokenUtils.isTokenExpired()) {
        console.log('Token expired, clearing tokens');
        tokenUtils.clearToken();
        // Optionally redirect to login or refresh token here
        // For now, just clear the expired token
      }
    };

    // Check token expiration every 30 seconds
    const interval = setInterval(checkTokenExpiration, 30000);

    // Also check when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTokenExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
};