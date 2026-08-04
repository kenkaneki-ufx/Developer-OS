"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeeklySchedule } from "../types";
import { defaultWeeklySchedule, exampleWeeklySchedule } from "../data/mock-schedule";

const STORAGE_KEY = "developer-os-weekly-schedule";

function getStoredSchedule(): WeeklySchedule {
  if (typeof window === "undefined") return defaultWeeklySchedule;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // If parsing fails, return default
  }
  
  // For first-time users, return empty schedule
  return defaultWeeklySchedule;
}

export function useSchedule() {
  const [schedule, setSchedule] = useState<WeeklySchedule>(defaultWeeklySchedule);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setSchedule(getStoredSchedule());
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever schedule changes
  const saveSchedule = useCallback((newSchedule: WeeklySchedule) => {
    const updatedSchedule = {
      ...newSchedule,
      updatedAt: new Date().toISOString(),
    };
    setSchedule(updatedSchedule);
    
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSchedule));
    }
  }, []);

  // Reset to default (for new users or logout)
  const resetSchedule = useCallback(() => {
    const defaultSchedule = {
      ...defaultWeeklySchedule,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSchedule(defaultSchedule);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    schedule,
    isLoaded,
    saveSchedule,
    resetSchedule,
  };
}
