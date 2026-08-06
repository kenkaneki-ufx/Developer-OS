"use client";

import { useState, useEffect, useCallback } from "react";
import type { CollegeData, Subject, TimetableSlot, Exam, SyllabusTopic, CollegeDetails } from "../types";
import { defaultCollegeData } from "../data/mock-college";

const STORAGE_KEY = "developer-os-college-data";

function getStoredData(): CollegeData {
  if (typeof window === "undefined") return defaultCollegeData;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // If parsing fails, return default
  }
  
  // For first-time users, return empty college data
  return defaultCollegeData;
}

export function useCollege() {
  const [data, setData] = useState<CollegeData>(defaultCollegeData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setData(getStoredData());
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes. Returns true on success, false on failure.
  const saveData = useCallback((newData: CollegeData): boolean => {
    setData(newData);
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        return true;
      } catch (e) {
        console.warn("Failed to save college data to localStorage:", e);
        return false;
      }
    }
    return true;
  }, []);

  // Syllabus Topics
  const updateSyllabusTopics = useCallback((subjectId: string, topics: SyllabusTopic[]) => {
    saveData({
      ...data,
      subjects: data.subjects.map(s =>
        s.id === subjectId ? { ...s, syllabusTopics: topics } : s
      ),
    });
  }, [data, saveData]);

  // Subject CRUD
  const addSubject = useCallback((subject: Subject) => {
    saveData({
      ...data,
      subjects: [...data.subjects, subject],
    });
  }, [data, saveData]);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    saveData({
      ...data,
      subjects: data.subjects.map(s => s.id === id ? { ...s, ...updates } : s),
    });
  }, [data, saveData]);

  const deleteSubject = useCallback((id: string) => {
    saveData({
      ...data,
      subjects: data.subjects.filter(s => s.id !== id),
      timetable: data.timetable.filter(t => t.subjectId !== id),
      exams: data.exams.filter(e => e.subjectId !== id),
    });
  }, [data, saveData]);

  // Timetable CRUD
  const addTimetableSlot = useCallback((slot: TimetableSlot) => {
    saveData({
      ...data,
      timetable: [...data.timetable, slot],
    });
  }, [data, saveData]);

  const updateTimetableSlot = useCallback((id: string, updates: Partial<TimetableSlot>) => {
    saveData({
      ...data,
      timetable: data.timetable.map(t => t.id === id ? { ...t, ...updates } : t),
    });
  }, [data, saveData]);

  const deleteTimetableSlot = useCallback((id: string) => {
    saveData({
      ...data,
      timetable: data.timetable.filter(t => t.id !== id),
    });
  }, [data, saveData]);

  // Exam CRUD
  const addExam = useCallback((exam: Exam) => {
    saveData({
      ...data,
      exams: [...data.exams, exam],
    });
  }, [data, saveData]);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    saveData({
      ...data,
      exams: data.exams.map(e => e.id === id ? { ...e, ...updates } : e),
    });
  }, [data, saveData]);

  const deleteExam = useCallback((id: string) => {
    saveData({
      ...data,
      exams: data.exams.filter(e => e.id !== id),
    });
  }, [data, saveData]);

  // Get today's classes
  const getTodayClasses = useCallback(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    return data.timetable
      .filter(slot => slot.day === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [data.timetable]);

  // Get subject by ID
  const getSubject = useCallback((id: string) => {
    return data.subjects.find(s => s.id === id);
  }, [data.subjects]);

  // Get overall attendance percentage
  const getOverallAttendance = useCallback(() => {
    const subjectsWithClasses = data.subjects.filter(s => s.totalClasses > 0);
    if (subjectsWithClasses.length === 0) return 0;
    
    const totalClasses = subjectsWithClasses.reduce((acc, s) => acc + s.totalClasses, 0);
    const attendedClasses = subjectsWithClasses.reduce((acc, s) => acc + s.attendedClasses, 0);
    
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  }, [data.subjects]);

  // Reset to default
  const resetData = useCallback(() => {
    const defaultData = {
      ...defaultCollegeData,
    };
    setData(defaultData);
    
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Update college details
  const updateCollegeDetails = useCallback((details: CollegeDetails) => {
    saveData({
      ...data,
      collegeDetails: details,
      semester: `${details.year}${details.year === 1 ? "st" : details.year === 2 ? "nd" : details.year === 3 ? "rd" : "th"} Semester`,
    });
  }, [data, saveData]);

  // Batch add subjects from syllabus
  const addSubjectsFromSyllabus = useCallback((subjects: Subject[]) => {
    saveData({
      ...data,
      subjects: [...data.subjects, ...subjects],
    });
  }, [data, saveData]);

  return {
    data,
    isLoaded,
    // College Details
    updateCollegeDetails,
    addSubjectsFromSyllabus,
    // Subjects
    addSubject,
    updateSubject,
    deleteSubject,
    updateSyllabusTopics,
    // Timetable
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    // Exams
    addExam,
    updateExam,
    deleteExam,
    // Helpers
    getTodayClasses,
    getSubject,
    getOverallAttendance,
    // Reset
    resetData,
  };
}
