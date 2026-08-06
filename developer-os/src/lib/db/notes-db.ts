/**
 * IndexedDB Storage Layer for Notes
 *
 * Uses the `idb` library (lightweight, promise-based wrapper).
 * Provides ~50-100MB+ storage vs localStorage's ~5MB limit.
 * Data persists across browser sessions and doesn't hit quota errors.
 *
 * Install: npm install idb
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb";

// ─── Types ───────────────────────────────────────────────────────────
export interface NoteAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: "pdf" | "document" | "markdown" | "image" | "other";
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  subject: string;
  chapter: string;
  updatedAt: string;
  createdAt: string;
  pinned: boolean;
  starred: boolean;
  archived: boolean;
  attachments: NoteAttachment[];
  color: number;
  wordCount: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: string[];
}

// ─── Database Schema ─────────────────────────────────────────────────
interface DeveloperOSDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      "by-subject": string;
      "by-updated": string;
      "by-pinned": boolean;
      "by-archived": boolean;
    };
  };
  subjects: {
    key: string;
    value: Subject;
  };
  meta: {
    key: string;
    value: { key: string; value: string };
  };
}

// ─── Constants ───────────────────────────────────────────────────────
const DB_NAME = "developer-os";
const DB_VERSION = 1;
const LS_NOTES_KEY = "developer-os-notes-v2";
const LS_SUBJECTS_KEY = "developer-os-subjects";

// ─── Default Subjects ────────────────────────────────────────────────
export const defaultSubjects: Subject[] = [
  { id: "dsa", name: "DSA", icon: "🧮", color: "blue", chapters: ["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Sorting & Searching"] },
  { id: "frontend", name: "Frontend", icon: "🎨", color: "purple", chapters: ["HTML & CSS", "JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"] },
  { id: "backend", name: "Backend", icon: "⚙️", color: "green", chapters: ["Node.js", "Express", "Databases", "APIs", "Authentication", "Deployment"] },
  { id: "ml", name: "Machine Learning", icon: "🤖", color: "amber", chapters: ["Python Basics", "Math & Stats", "Supervised Learning", "Unsupervised Learning", "Deep Learning", "NLP", "Computer Vision"] },
  { id: "devops", name: "DevOps", icon: "🚀", color: "red", chapters: ["Git", "Docker", "CI/CD", "Linux", "Cloud", "Monitoring"] },
  { id: "college", name: "College", icon: "🎓", color: "cyan", chapters: ["Semester Notes", "Assignments", "Lab Work", "Exam Prep", "Projects"] },
];

// ─── Database Instance ───────────────────────────────────────────────
let dbPromise: Promise<IDBPDatabase<DeveloperOSDB>> | null = null;

function getDB(): Promise<IDBPDatabase<DeveloperOSDB>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on the server"));
  }
  if (!dbPromise) {
    dbPromise = openDB<DeveloperOSDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Notes store
        const noteStore = db.createObjectStore("notes", { keyPath: "id" });
        noteStore.createIndex("by-subject", "subject");
        noteStore.createIndex("by-updated", "updatedAt");
        noteStore.createIndex("by-pinned", "pinned");
        noteStore.createIndex("by-archived", "archived");

        // Subjects store
        db.createObjectStore("subjects", { keyPath: "id" });

        // Meta store (for migration flags, etc.)
        db.createObjectStore("meta", { keyPath: "key" });
      },
    });
  }
  return dbPromise;
}

// ─── Migration from localStorage ─────────────────────────────────────
async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const db = await getDB();

    // Check if migration already happened
    const migrated = await db.get("meta", "migrated-from-ls");
    if (migrated) return;

    console.log("[NotesDB] Migrating from localStorage to IndexedDB...");

    // Migrate notes
    try {
      const stored = localStorage.getItem(LS_NOTES_KEY);
      if (stored) {
        const notes: Note[] = JSON.parse(stored);
        const tx = db.transaction("notes", "readwrite");
        for (const note of notes) {
          await tx.store.put(note);
        }
        await tx.done;
        console.log(`[NotesDB] Migrated ${notes.length} notes`);
        localStorage.removeItem(LS_NOTES_KEY);
      }
    } catch (e) {
      console.warn("[NotesDB] Failed to migrate notes:", e);
    }

    // Migrate subjects
    try {
      const stored = localStorage.getItem(LS_SUBJECTS_KEY);
      if (stored) {
        const subjects: Subject[] = JSON.parse(stored);
        const tx = db.transaction("subjects", "readwrite");
        for (const subject of subjects) {
          await tx.store.put(subject);
        }
        await tx.done;
        console.log(`[NotesDB] Migrated ${subjects.length} subjects`);
        localStorage.removeItem(LS_SUBJECTS_KEY);
      }
    } catch (e) {
      console.warn("[NotesDB] Failed to migrate subjects:", e);
    }

    // Mark migration complete
    await db.put("meta", { key: "migrated-from-ls", value: new Date().toISOString() });
    console.log("[NotesDB] Migration complete");
  } catch (e) {
    console.warn("[NotesDB] Migration failed, will use defaults:", e);
  }
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Initialize the database and run migration.
 * Call this once on app mount.
 */
export async function initNotesDB(): Promise<void> {
  if (typeof window === "undefined") return;
  await getDB();
  await migrateFromLocalStorage();
}

// ─── Notes CRUD ──────────────────────────────────────────────────────

export async function loadNotes(): Promise<Note[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await getDB();
    return await db.getAll("notes");
  } catch (e) {
    console.warn("[NotesDB] Failed to load notes:", e);
    return [];
  }
}

export async function saveAllNotes(notes: Note[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    const tx = db.transaction("notes", "readwrite");
    await tx.store.clear();
    for (const note of notes) {
      await tx.store.put(note);
    }
    await tx.done;
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to save notes:", e);
    return false;
  }
}

export async function upsertNote(note: Note): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    await db.put("notes", note);
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to upsert note:", e);
    return false;
  }
}

export async function deleteNoteById(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    await db.delete("notes", id);
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to delete note:", e);
    return false;
  }
}

export async function getNotesBySubject(subject: string): Promise<Note[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await getDB();
    return await db.getAllFromIndex("notes", "by-subject", subject);
  } catch (e) {
    console.warn("[NotesDB] Failed to get notes by subject:", e);
    return [];
  }
}

// ─── Subjects CRUD ───────────────────────────────────────────────────

export async function loadSubjects(): Promise<Subject[]> {
  if (typeof window === "undefined") return defaultSubjects;
  try {
    const db = await getDB();
    const subjects = await db.getAll("subjects");
    return subjects.length > 0 ? subjects : defaultSubjects;
  } catch (e) {
    console.warn("[NotesDB] Failed to load subjects:", e);
    return defaultSubjects;
  }
}

export async function saveAllSubjects(subjects: Subject[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    const tx = db.transaction("subjects", "readwrite");
    await tx.store.clear();
    for (const subject of subjects) {
      await tx.store.put(subject);
    }
    await tx.done;
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to save subjects:", e);
    return false;
  }
}

export async function upsertSubject(subject: Subject): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    await db.put("subjects", subject);
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to upsert subject:", e);
    return false;
  }
}

export async function deleteSubjectById(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const db = await getDB();
    await db.delete("subjects", id);
    return true;
  } catch (e) {
    console.warn("[NotesDB] Failed to delete subject:", e);
    return false;
  }
}

// ─── Utility: Check IndexedDB support ────────────────────────────────

export function isIndexedDBSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "indexedDB" in window;
}

// ─── Utility: Get storage stats ──────────────────────────────────────

export async function getStorageStats(): Promise<{ notesCount: number; subjectsCount: number }> {
  if (typeof window === "undefined") return { notesCount: 0, subjectsCount: 0 };
  try {
    const db = await getDB();
    const notesCount = await db.count("notes");
    const subjectsCount = await db.count("subjects");
    return { notesCount, subjectsCount };
  } catch {
    return { notesCount: 0, subjectsCount: 0 };
  }
}
