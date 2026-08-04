"use client";

import { useState, useEffect } from "react";

/**
 * A hydration-safe media query hook that returns false on server
 * and updates to the correct value after client mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value on client mount
    setMatches(media.matches);
    
    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
