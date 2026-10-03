'use client';

import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const SMALL_SCREEN_SIZE = 768;

  useEffect(() => {
    // Check if window is defined (browser environment)
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < SMALL_SCREEN_SIZE);
      };

      // Initial check
      checkIfMobile();

      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile);

      // Clean up event listener
      return () => window.removeEventListener('resize', checkIfMobile);
    }
  }, []);

  return isMobile;
}
