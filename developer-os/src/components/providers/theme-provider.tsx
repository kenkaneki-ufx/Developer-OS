"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  compact: boolean;
  setCompact: (compact: boolean) => void;
}

const ThemeProviderContext = createContext<ThemeProviderContextValue | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  compactStorageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "developer-os-theme",
  compactStorageKey = "developer-os-compact",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [compact, setCompactState] = useState<boolean>(false);

  // Hydration-safe: Load from localStorage only after mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const storedCompact = localStorage.getItem(compactStorageKey);
    setCompactState(storedCompact === "true");
  }, [storageKey, compactStorageKey]);

  const setCompact = useCallback((value: boolean) => {
    setCompactState(value);
    localStorage.setItem(compactStorageKey, value ? "true" : "false");
  }, [compactStorageKey]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("compact", compact);
  }, [compact]);

  const value = {
    theme,
    setTheme,
    compact,
    setCompact,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
