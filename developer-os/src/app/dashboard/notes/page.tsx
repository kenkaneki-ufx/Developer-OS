"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Edit3,
  Clock,
  Hash,
  Pin,
  Star,
  X,
  Save,
  Upload,
  Eye,
  File,
  FileImage,
  Tag,
  FolderOpen,
  ChevronDown,
  Download,
  ExternalLink,
  Paperclip,
  BookOpen,
  Layers,
  Copy,
  SortAsc,
  SortDesc,
  Archive,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  PenLine,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { useToast } from "@/components/ui/toast";
import {
  initNotesDB,
  loadNotes as dbLoadNotes,
  saveAllNotes as dbSaveAllNotes,
  loadSubjects as dbLoadSubjects,
  saveAllSubjects as dbSaveAllSubjects,
  isIndexedDBSupported,
  type Note as DBNote,
  type Subject as DBSubject,
} from "@/lib/db/notes-db";

// ─── Types ───────────────────────────────────────────────────────────
interface NoteAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: "pdf" | "document" | "markdown" | "image" | "other";
}

interface Note {
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

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: string[];
}

// ─── Constants ───────────────────────────────────────────────────────
const STORAGE_KEY = "developer-os-notes-v2"; // Legacy, for migration only
const SUBJECTS_KEY = "developer-os-subjects"; // Legacy, for migration only

const defaultSubjects: Subject[] = [
  { id: "dsa", name: "DSA", icon: "🧮", color: "blue", chapters: ["Arrays", "Strings", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Dynamic Programming", "Sorting & Searching"] },
  { id: "frontend", name: "Frontend", icon: "🎨", color: "purple", chapters: ["HTML & CSS", "JavaScript", "React", "TypeScript", "Next.js", "Tailwind CSS"] },
  { id: "backend", name: "Backend", icon: "⚙️", color: "green", chapters: ["Node.js", "Express", "Databases", "APIs", "Authentication", "Deployment"] },
  { id: "ml", name: "Machine Learning", icon: "🤖", color: "amber", chapters: ["Python Basics", "Math & Stats", "Supervised Learning", "Unsupervised Learning", "Deep Learning", "NLP", "Computer Vision"] },
  { id: "devops", name: "DevOps", icon: "🚀", color: "red", chapters: ["Git", "Docker", "CI/CD", "Linux", "Cloud", "Monitoring"] },
  { id: "college", name: "College", icon: "🎓", color: "cyan", chapters: ["Semester Notes", "Assignments", "Lab Work", "Exam Prep", "Projects"] },
];

const noteColors = [
  "from-amber-500/8 to-amber-500/3 border-amber-500/15",
  "from-emerald-500/8 to-emerald-500/3 border-emerald-500/15",
  "from-blue-500/8 to-blue-500/3 border-blue-500/15",
  "from-purple-500/8 to-purple-500/3 border-purple-500/15",
  "from-rose-500/8 to-rose-500/3 border-rose-500/15",
  "from-cyan-500/8 to-cyan-500/3 border-cyan-500/15",
  "from-orange-500/8 to-orange-500/3 border-orange-500/15",
];

const subjectColorMap: Record<string, { bg: string; text: string; border: string; hover: string; dot: string }> = {
  blue:   { bg: "bg-blue-500/8",   text: "text-blue-600 dark:text-blue-400",   border: "border-blue-500/20",   hover: "hover:bg-blue-500/12",   dot: "bg-blue-500" },
  purple: { bg: "bg-purple-500/8", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20", hover: "hover:bg-purple-500/12", dot: "bg-purple-500" },
  green:  { bg: "bg-emerald-500/8", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", hover: "hover:bg-emerald-500/12", dot: "bg-emerald-500" },
  amber:  { bg: "bg-amber-500/8",  text: "text-amber-600 dark:text-amber-400",  border: "border-amber-500/20",  hover: "hover:bg-amber-500/12",  dot: "bg-amber-500" },
  red:    { bg: "bg-red-500/8",    text: "text-red-600 dark:text-red-400",       border: "border-red-500/20",    hover: "hover:bg-red-500/12",    dot: "bg-red-500" },
  cyan:   { bg: "bg-cyan-500/8",   text: "text-cyan-600 dark:text-cyan-400",     border: "border-cyan-500/20",   hover: "hover:bg-cyan-500/12",   dot: "bg-cyan-500" },
};

// ─── Framer Motion Variants ─────────────────────────────────────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.95, y: -8,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.96, y: 16,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};



// ─── Utilities ───────────────────────────────────────────────────────
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(words: number): string {
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min`;
}

function getAttachmentCategory(mimeType: string, fileName: string): NoteAttachment["category"] {
  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "text/markdown" || fileName.endsWith(".md") || fileName.endsWith(".markdown")) return "markdown";
  if (mimeType.includes("document") || mimeType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "document";
  return "other";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderMarkdown(text: string): string {
  const html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-xl bg-muted/50 border border-border p-4 my-3 overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-foreground mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 py-1 my-2 text-muted-foreground italic">$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-muted-foreground">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
}

// ─── Markdown Toolbar Helper ──────────────────────────────────────
function insertMarkdown(
  textarea: HTMLTextAreaElement | null,
  content: string,
  setContent: (val: string) => void,
  syntax: string,
  placeholder?: string
): void {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.substring(start, end);
  const before = content.substring(0, start);
  const after = content.substring(end);

  let insertion = "";
  let cursorOffset = 0;

  if (syntax === "heading1") {
    insertion = `# ${selected || placeholder || "Heading 1"}`;
    cursorOffset = selected ? insertion.length : 2;
  } else if (syntax === "heading2") {
    insertion = `## ${selected || placeholder || "Heading 2"}`;
    cursorOffset = selected ? insertion.length : 3;
  } else if (syntax === "heading3") {
    insertion = `### ${selected || placeholder || "Heading 3"}`;
    cursorOffset = selected ? insertion.length : 4;
  } else if (syntax === "bold") {
    insertion = `**${selected || placeholder || "bold text"}**`;
    cursorOffset = selected ? insertion.length : 2;
  } else if (syntax === "italic") {
    insertion = `*${selected || placeholder || "italic text"}*`;
    cursorOffset = selected ? insertion.length : 1;
  } else if (syntax === "code") {
    insertion = "`" + (selected || placeholder || "code") + "`";
    cursorOffset = selected ? insertion.length : 1;
  } else if (syntax === "codeblock") {
    insertion = "```\n" + (selected || placeholder || "code here") + "\n```";
    cursorOffset = selected ? insertion.length : 4;
  } else if (syntax === "list") {
    insertion = "- " + (selected || placeholder || "list item");
    cursorOffset = selected ? insertion.length : 2;
  } else if (syntax === "ordered") {
    insertion = "1. " + (selected || placeholder || "list item");
    cursorOffset = selected ? insertion.length : 3;
  } else if (syntax === "quote") {
    insertion = "> " + (selected || placeholder || "quote");
    cursorOffset = selected ? insertion.length : 2;
  } else if (syntax === "link") {
    insertion = `[${selected || placeholder || "link text"}](url)`;
    cursorOffset = selected ? insertion.length - 4 : 1;
  } else if (syntax === "hr") {
    insertion = "\n---\n";
    cursorOffset = insertion.length;
  } else {
    insertion = selected;
    cursorOffset = 0;
  }

  const newContent = before + insertion + after;
  setContent(newContent);

  // Restore cursor position after React re-render
  setTimeout(() => {
    if (textarea) {
      const pos = start + cursorOffset;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    }
  }, 0);
}

// ─── Storage ─────────────────────────────────────────────────────────
const useIDB = typeof window !== "undefined" && isIndexedDBSupported();

async function loadNotesStorage(): Promise<Note[]> {
  if (useIDB) {
    try { return await dbLoadNotes(); } catch { /* fallthrough */ }
  }
  // Fallback to localStorage (legacy)
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.length < 500000) return JSON.parse(stored);
  } catch {}
  return [];
}

async function saveNotesStorage(notes: Note[]): Promise<boolean> {
  if (useIDB) {
    try { return await dbSaveAllNotes(notes as DBNote[]); } catch { /* fallthrough */ }
  }
  // Fallback to localStorage (legacy)
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (e) {
    console.warn("Failed to save notes:", e);
    return false;
  }
}

async function loadSubjectsStorage(): Promise<Subject[]> {
  if (useIDB) {
    try { return await dbLoadSubjects(); } catch { /* fallthrough */ }
  }
  if (typeof window === "undefined") return defaultSubjects;
  try {
    const stored = localStorage.getItem(SUBJECTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultSubjects;
}

async function saveSubjectsStorage(subjects: Subject[]): Promise<boolean> {
  if (useIDB) {
    try { return await dbSaveAllSubjects(subjects as DBSubject[]); } catch { /* fallthrough */ }
  }
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    return true;
  } catch (e) {
    console.warn("Failed to save subjects:", e);
    return false;
  }
}

// ─── Main Component ──────────────────────────────────────────────────
export default function NotesPage() {
  const { addToast } = useToast();

  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showArchived, setShowArchived] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorSubject, setEditorSubject] = useState("");
  const [editorChapter, setEditorChapter] = useState("");
  const [editorPinned, setEditorPinned] = useState(false);
  const [editorStarred, setEditorStarred] = useState(false);
  const [editorAttachments, setEditorAttachments] = useState<NoteAttachment[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);

  // Preview
  const [showPreview, setShowPreview] = useState<Note | null>(null);
  const [editorPreview, setEditorPreview] = useState(false);
  const [editorFullscreen, setEditorFullscreen] = useState(false);
  const [editorSaveStatus, setEditorSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const editorContentRef = useRef<HTMLTextAreaElement>(null);

  // Subject management
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectIcon, setNewSubjectIcon] = useState("📚");
  const [newChapterName, setNewChapterName] = useState("");
  const [editingSubject, setEditingSubject] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoadedRef = useRef(false);
  const notesRef = useRef<Note[]>([]);
  const subjectsRef = useRef<Subject[]>([]);

  // Keep refs in sync with state
  notesRef.current = notes;
  subjectsRef.current = subjects;

  // Initialize IndexedDB and load data on mount
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try { await initNotesDB(); } catch { /* continue with defaults */ }
      const [loadedNotes, loadedSubjects] = await Promise.all([
        loadNotesStorage(),
        loadSubjectsStorage(),
      ]);
      if (!cancelled) {
        setNotes(loadedNotes);
        setSubjects(loadedSubjects);
        isLoadedRef.current = true;
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  // Retry function for notes save failures
  const retrySaveNotes = useCallback(async () => {
    const ok = await saveNotesStorage(notesRef.current);
    if (ok) {
      addToast("Notes saved successfully", "success");
    } else {
      addToast("Failed to save notes — please try again", "error", {
        label: "Retry",
        onClick: () => retrySaveNotes(),
      });
    }
  }, [addToast]);

  // Retry function for subjects save failures
  const retrySaveSubjects = useCallback(async () => {
    const ok = await saveSubjectsStorage(subjectsRef.current);
    if (ok) {
      addToast("Subjects saved successfully", "success");
    } else {
      addToast("Failed to save subjects — please try again", "error", {
        label: "Retry",
        onClick: () => retrySaveSubjects(),
      });
    }
  }, [addToast]);

  // Auto-save notes (debounced, only after initial load)
  useEffect(() => {
    if (!isLoadedRef.current) return;
    setEditorSaveStatus("saving");
    const timer = setTimeout(async () => {
      const ok = await saveNotesStorage(notes);
      if (ok) {
        setEditorSaveStatus("saved");
        setTimeout(() => setEditorSaveStatus("idle"), 2000);
      } else {
        setEditorSaveStatus("idle");
        addToast("Failed to save notes — storage may be full", "error", {
          label: "Retry",
          onClick: () => retrySaveNotes(),
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [notes, addToast, retrySaveNotes]);

  // Auto-save subjects (debounced, only after initial load)
  useEffect(() => {
    if (!isLoadedRef.current) return;
    const timer = setTimeout(async () => {
      const ok = await saveSubjectsStorage(subjects);
      if (!ok) {
        addToast("Failed to save subjects — storage may be full", "error", {
          label: "Retry",
          onClick: () => retrySaveSubjects(),
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [subjects, addToast, retrySaveSubjects]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking inside a dropdown menu item
      if (target.closest("[data-dropdown-item]")) return;
      if (!target.closest("[data-subject-dd]")) setShowSubjectDropdown(false);
      if (!target.closest("[data-chapter-dd]")) setShowChapterDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Derived Data ────────────────────────────────────────────────
  const currentSubject = subjects.find((s) => s.id === selectedSubject);
  const chapters = currentSubject?.chapters ?? [];

  const filtered = useMemo(() => notes
    .filter((n) => {
      if (showArchived ? !n.archived : n.archived) return false;
      if (selectedSubject !== "all" && n.subject !== selectedSubject) return false;
      if (selectedChapter !== "all" && n.chapter !== selectedChapter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.subject.toLowerCase().includes(q) ||
          n.chapter.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sortBy === "title") {
        return sortDir === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      }
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortDir === "asc" ? da - db : db - da;
    }), [notes, showArchived, selectedSubject, selectedChapter, search, sortBy, sortDir]);

  const pinnedNotes = filtered.filter((n) => n.pinned);
  const unpinnedNotes = filtered.filter((n) => !n.pinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];

  const totalWords = notes.reduce((sum, n) => sum + n.wordCount, 0);
  const noteCount = notes.filter((n) => !n.archived).length;

  // ─── Note Actions ────────────────────────────────────────────────
  const openEditor = useCallback((note?: Note) => {
    if (note) {
      setEditingNote(note);
      setEditorTitle(note.title);
      setEditorContent(note.content);
      setEditorTags([...note.tags]);
      setEditorSubject(note.subject);
      setEditorChapter(note.chapter);
      setEditorPinned(note.pinned);
      setEditorStarred(note.starred);
      setEditorAttachments([...note.attachments]);
    } else {
      setEditingNote(null);
      setEditorTitle("");
      setEditorContent("");
      setEditorTags([]);
      setEditorSubject(selectedSubject !== "all" ? selectedSubject : subjects[0]?.id ?? "");
      setEditorChapter("all");
      setEditorPinned(false);
      setEditorStarred(false);
      setEditorAttachments([]);
    }
    setShowEditor(true);
  }, [selectedSubject, subjects]);

  const saveNote = useCallback(() => {
    if (!editorTitle.trim()) {
      addToast("Please enter a note title", "warning");
      return;
    }
    const now = new Date().toISOString();
    const wc = countWords(editorContent);

    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, title: editorTitle, content: editorContent, tags: editorTags, subject: editorSubject, chapter: editorChapter === "all" ? "" : editorChapter, pinned: editorPinned, starred: editorStarred, attachments: editorAttachments, updatedAt: now, wordCount: wc }
            : n
        )
      );
      addToast("Note updated", "success");
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: editorTitle,
        content: editorContent,
        tags: editorTags,
        subject: editorSubject,
        chapter: editorChapter === "all" ? "" : editorChapter,
        updatedAt: now,
        createdAt: now,
        pinned: editorPinned,
        starred: editorStarred,
        archived: false,
        attachments: editorAttachments,
        color: Math.floor(Math.random() * noteColors.length),
        wordCount: wc,
      };
      setNotes((prev) => [newNote, ...prev]);
      addToast("Note created", "success");
    }
    setShowEditor(false);
  }, [editorTitle, editorContent, editorTags, editorSubject, editorChapter, editorPinned, editorStarred, editorAttachments, editingNote, addToast]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (showPreview?.id === id) setShowPreview(null);
    setDeleteConfirm(null);
    addToast("Note deleted", "info");
  }, [showPreview, addToast]);

  const archiveNote = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n)));
    addToast("Note archived", "info");
  }, [addToast]);

  const duplicateNote = useCallback((note: Note) => {
    const now = new Date().toISOString();
    const dup: Note = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${note.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      starred: false,
      archived: false,
    };
    setNotes((prev) => [dup, ...prev]);
    addToast("Note duplicated", "success");
  }, [addToast]);

  // ─── Keyboard Shortcuts ─────────────────────────────────────────
  const saveNoteRef = useRef(saveNote);
  const editorContentValRef = useRef(editorContent);
  saveNoteRef.current = saveNote;
  editorContentValRef.current = editorContent;
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!showEditor) return;
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === "b") {
        e.preventDefault();
        insertMarkdown(editorContentRef.current, editorContentValRef.current, setEditorContent, "bold", "bold text");
      } else if (isMod && e.key === "i") {
        e.preventDefault();
        insertMarkdown(editorContentRef.current, editorContentValRef.current, setEditorContent, "italic", "italic text");
      } else if (isMod && e.key === "k") {
        e.preventDefault();
        insertMarkdown(editorContentRef.current, editorContentValRef.current, setEditorContent, "link", "link text");
      } else if (isMod && e.key === "s") {
        e.preventDefault();
        saveNoteRef.current();
      } else if (isMod && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setEditorPreview((p) => !p);
      } else if (isMod && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setEditorFullscreen((f) => !f);
      } else if (e.key === "Escape" && editorFullscreen) {
        e.preventDefault();
        setEditorFullscreen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showEditor, editorFullscreen, setEditorContent]);

  // ─── Backup / Restore ────────────────────────────────────────────
  const exportNotes = useCallback(() => {
    const data = JSON.stringify({ notes, subjects, exportedAt: new Date().toISOString(), version: "1.0" }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `developer-os-notes-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast(`Exported ${notes.length} notes`, "success");
  }, [notes, subjects, addToast]);

  const importNotes = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.notes && Array.isArray(data.notes)) {
            const merged = [...notes];
            let added = 0;
            for (const note of data.notes) {
              if (!merged.find((n) => n.id === note.id)) {
                merged.push(note);
                added++;
              }
            }
            setNotes(merged);
            if (data.subjects && Array.isArray(data.subjects)) {
              const mergedSubjects = [...subjects];
              for (const s of data.subjects) {
                if (!mergedSubjects.find((ms) => ms.id === s.id)) mergedSubjects.push(s);
              }
              setSubjects(mergedSubjects);
            }
            addToast(`Imported ${added} new notes`, "success");
          } else {
            addToast("Invalid backup file format", "error");
          }
        } catch {
          addToast("Failed to parse backup file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [notes, subjects, addToast]);

  // ─── Tag Handling ────────────────────────────────────────────────
  const addTag = useCallback(() => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editorTags.includes(tag)) {
      setEditorTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  }, [tagInput, editorTags]);

  // ─── File Upload ─────────────────────────────────────────────────
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const att: NoteAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: event.target?.result as string,
          category: getAttachmentCategory(file.type, file.name),
        };
        setEditorAttachments((prev) => [...prev, att]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ─── Subject Management ──────────────────────────────────────────
  const addSubject = useCallback(() => {
    if (!newSubjectName.trim()) return;
    const id = newSubjectName.trim().toLowerCase().replace(/\s+/g, "-");
    if (subjects.find((s) => s.id === id)) {
      addToast("Subject already exists", "warning");
      return;
    }
    const colors = ["blue", "purple", "green", "amber", "red", "cyan"];
    setSubjects((prev) => [...prev, { id, name: newSubjectName.trim(), icon: newSubjectIcon, color: colors[prev.length % colors.length], chapters: [] }]);
    setNewSubjectName("");
    setNewSubjectIcon("📚");
    addToast(`Subject "${newSubjectName.trim()}" added`, "success");
  }, [newSubjectName, newSubjectIcon, subjects, addToast]);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setNotes((prev) => prev.map((n) => (n.subject === id ? { ...n, subject: "" } : n)));
    if (selectedSubject === id) setSelectedSubject("all");
    addToast("Subject deleted", "info");
  }, [selectedSubject, addToast]);

  const addChapter = useCallback((subjectId: string) => {
    if (!newChapterName.trim()) return;
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, chapters: [...s.chapters, newChapterName.trim()] } : s
      )
    );
    setNewChapterName("");
    addToast("Chapter added", "success");
  }, [newChapterName, addToast]);

  const deleteChapter = useCallback((subjectId: string, chapter: string) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, chapters: s.chapters.filter((c) => c !== chapter) } : s
      )
    );
    setNotes((prev) => prev.map((n) => (n.subject === subjectId && n.chapter === chapter ? { ...n, chapter: "" } : n)));
    addToast("Chapter deleted", "info");
  }, [addToast]);

  // ─── Attachment Icons ────────────────────────────────────────────
  const getAttachmentIcon = (category: NoteAttachment["category"]) => {
    switch (category) {
      case "pdf": return <File className="h-4 w-4 text-red-500" />;
      case "image": return <FileImage className="h-4 w-4 text-emerald-500" />;
      case "markdown": return <FileText className="h-4 w-4 text-blue-500" />;
      case "document": return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <PageWrapper
      title=""
      subtitle=""
      headerAction={null}
    >
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
              <StickyNote className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Notes
            </h1>
          </div>
          <p className="text-sm text-muted-foreground/60 ml-[52px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-xs font-semibold text-primary mr-1.5">
              {noteCount}
            </span>
            notes · {totalWords.toLocaleString()} words
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={importNotes}
            className="flex items-center gap-2 rounded-xl border border-border bg-background/80 backdrop-blur-sm px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-primary/20 transition-all duration-200"
          >
            <Upload className="h-4 w-4" /> Import
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={exportNotes}
            className="flex items-center gap-2 rounded-xl border border-border bg-background/80 backdrop-blur-sm px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-primary/20 transition-all duration-200"
          >
            <Download className="h-4 w-4" /> Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openEditor()}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <Plus className="h-4 w-4 relative" /> New Note
          </motion.button>
        </div>
      </motion.div>

      {/* ─── Subject Tabs ─── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        <motion.button
          variants={fadeSlideUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setSelectedSubject("all"); setSelectedChapter("all"); }}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap",
            selectedSubject === "all"
              ? "border-primary/30 bg-primary/10 text-primary shadow-sm shadow-primary/10"
              : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:border-primary/15"
          )}
        >
          <Layers className="h-4 w-4" /> All
          <span className={cn(
            "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors duration-300",
            selectedSubject === "all" ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground/60"
          )}>{notes.filter((n) => !n.archived).length}</span>
        </motion.button>

        {subjects.map((s, i) => {
          const count = notes.filter((n) => n.subject === s.id && !n.archived).length;
          const isActive = selectedSubject === s.id;
          const colors = subjectColorMap[s.color] || subjectColorMap.blue;
          return (
            <motion.button
              key={s.id}
              variants={fadeSlideUp}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedSubject(s.id); setSelectedChapter("all"); }}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap group",
                isActive
                  ? cn("shadow-sm", colors.bg, colors.text, colors.border)
                  : cn("border-border/60 text-muted-foreground hover:bg-muted/40 hover:border-primary/15")
              )}
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
              {s.name}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-all duration-300",
                isActive ? "bg-white/15 dark:bg-black/15 text-current" : "bg-muted/60 text-muted-foreground/60"
              )}>{count}</span>
            </motion.button>
          );
        })}

        <motion.button
          variants={fadeSlideUp}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSubjectManager(true)}
          className="flex items-center justify-center rounded-xl border border-dashed border-border/60 p-2.5 text-muted-foreground/40 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* ─── Chapter Tabs ─── */}
      <AnimatePresence>
        {selectedSubject !== "all" && chapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-hide">
              <button
                onClick={() => setSelectedChapter("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                  selectedChapter === "all"
                    ? "bg-background text-foreground shadow-sm border border-border/60"
                    : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/30"
                )}
              >
                All
              </button>
              {chapters.map((ch) => {
                const chCount = notes.filter((n) => n.chapter === ch && n.subject === selectedSubject && !n.archived).length;
                return (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5",
                      selectedChapter === ch
                        ? "bg-background text-foreground shadow-sm border border-border/60"
                        : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    {ch}
                    {chCount > 0 && (
                      <span className={cn(
                        "rounded-full px-1 text-[9px] font-bold",
                        selectedChapter === ch ? "bg-primary/10 text-primary" : "bg-muted/40 text-muted-foreground/40"
                      )}>{chCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Search & Controls ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div className={cn(
          "relative flex-1 w-full transition-all duration-300",
          searchFocused && "scale-[1.01]"
        )}>
          <Search className={cn(
            "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
            searchFocused ? "text-primary" : "text-muted-foreground/30"
          )} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "w-full rounded-xl border bg-background/80 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none transition-all duration-300",
              searchFocused
                ? "border-primary/30 ring-2 ring-primary/10 shadow-sm shadow-primary/5"
                : "border-border/60 hover:border-primary/15"
            )}
          />
          {search && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted/60 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowArchived(!showArchived)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-300",
              showArchived
                ? "border-amber-500/30 bg-amber-500/8 text-amber-600 dark:text-amber-400"
                : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:border-primary/15"
            )}
          >
            <Archive className="h-3.5 w-3.5" /> {showArchived ? "Archived" : "Active"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSortBy(sortBy === "date" ? "title" : "date")}
            className="flex items-center gap-1.5 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:border-primary/15 transition-all duration-300"
          >
            {sortBy === "date" ? <Clock className="h-3.5 w-3.5" /> : <SortAsc className="h-3.5 w-3.5" />}
            {sortBy === "date" ? "Date" : "Title"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="rounded-xl border border-border/60 p-2 text-muted-foreground hover:bg-muted/40 hover:border-primary/15 transition-all duration-300"
          >
            {sortDir === "asc" ? <SortAsc className="h-3.5 w-3.5" /> : <SortDesc className="h-3.5 w-3.5" />}
          </motion.button>

          <div className="flex gap-0.5 rounded-xl border border-border/60 bg-muted/20 p-1">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/40 hover:text-foreground"
              )}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded-lg p-2 transition-all duration-200",
                viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/40 hover:text-foreground"
              )}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Bar ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-4 text-xs text-muted-foreground/50 font-medium"
      >
        <span>{displayNotes.length} {showArchived ? "archived" : "active"}</span>
        {pinnedNotes.length > 0 && (
          <span className="flex items-center gap-1"><Pin className="h-3 w-3 text-primary/60" /> {pinnedNotes.length} pinned</span>
        )}
        {notes.filter((n) => n.starred && !n.archived).length > 0 && (
          <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400/60 text-amber-400/60" /> {notes.filter((n) => n.starred && !n.archived).length} starred</span>
        )}
        {selectedSubject !== "all" && currentSubject && (
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-primary/60" /> {currentSubject.icon} {currentSubject.name}</span>
        )}
      </motion.div>

      {/* ─── Notes Grid/List ─── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn(
          viewMode === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-2.5"
        )}
      >
        <AnimatePresence mode="popLayout">
          {displayNotes.map((note, index) => {
            const subjectInfo = subjects.find((s) => s.id === note.subject);
            const colors = subjectInfo ? subjectColorMap[subjectInfo.color] : null;
            return (
              <motion.div
                key={note.id}
                layout
                variants={fadeSlideUp}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: index * 0.025, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={cn(
                  "group relative rounded-2xl border bg-gradient-to-br p-5 cursor-pointer",
                  "transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
                  "border-border/50 hover:border-primary/20",
                  noteColors[note.color % noteColors.length],
                  viewMode === "list" && "flex items-center gap-4"
                )}
                onClick={() => setShowPreview(note)}
              >
                {/* Pinned indicator */}
                {note.pinned && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-1.5 -right-1.5 z-10"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20">
                      <Pin className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}

                <div className={cn(viewMode === "grid" ? "" : "flex-1 min-w-0")}>
                  {/* Title & Actions */}
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 text-[15px]">
                        {note.title}
                      </h3>
                      {/* Subject & Chapter badges */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {subjectInfo && (
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold transition-colors duration-200",
                            colors?.bg, colors?.text, colors?.border
                          )}>
                            {subjectInfo.icon} {subjectInfo.name}
                          </span>
                        )}
                        {note.chapter && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted/40 border border-border/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                            {note.chapter}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover actions */}
                    <div
                      className="flex gap-0.5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowPreview(note)}
                        className="rounded-lg p-1.5 hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditor(note)}
                        className="rounded-lg p-1.5 hover:bg-muted/60 text-muted-foreground/40 hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => duplicateNote(note)}
                        className="rounded-lg p-1.5 hover:bg-muted/60 text-muted-foreground/40 hover:text-foreground transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => archiveNote(note.id)}
                        className="rounded-lg p-1.5 hover:bg-amber-500/10 text-muted-foreground/40 hover:text-amber-500 transition-colors"
                        title="Archive"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirm(note.id)}
                        className="rounded-lg p-1.5 hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className={cn(
                    "text-sm text-muted-foreground/50 leading-relaxed whitespace-pre-line",
                    viewMode === "grid" ? "line-clamp-3" : "line-clamp-1"
                  )}>
                    {note.content || "Empty note"}
                  </p>

                  {/* Attachments */}
                  {note.attachments.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {note.attachments.slice(0, 3).map((att) => (
                        <span key={att.id} className="inline-flex items-center gap-1 rounded-md bg-muted/30 border border-border/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/50">
                          {getAttachmentIcon(att.category)} {att.name.length > 12 ? att.name.slice(0, 12) + "…" : att.name}
                        </span>
                      ))}
                      {note.attachments.length > 3 && (
                        <span className="text-[10px] text-muted-foreground/30 font-medium">+{note.attachments.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Tags & Metadata */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, viewMode === "list" ? 4 : 3).map((t) => (
                        <span key={t} className="inline-flex items-center gap-0.5 rounded-md bg-primary/5 border border-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary/70">
                          <Hash className="h-2.5 w-2.5" />{t}
                        </span>
                      ))}
                      {note.tags.length > (viewMode === "list" ? 4 : 3) && (
                        <span className="text-[10px] text-muted-foreground/30">+{note.tags.length - (viewMode === "list" ? 4 : 3)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/35 font-medium">
                      {note.wordCount > 0 && <span>{readingTime(note.wordCount)}</span>}
                      {note.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />{timeAgo(note.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                  {deleteConfirm === note.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-background/95 backdrop-blur-sm border border-red-200 dark:border-red-900/50"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 8 }}
                        className="text-center p-4"
                      >
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-3">Delete this note?</p>
                        <div className="flex items-center gap-2 justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* ─── Empty State ─── */}
      {displayNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 py-20 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-6"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 shadow-lg shadow-primary/10">
              {showArchived ? (
                <Archive className="h-7 w-7 text-primary/60" />
              ) : search ? (
                <Search className="h-7 w-7 text-primary/60" />
              ) : (
                <PenLine className="h-7 w-7 text-primary/60" />
              )}
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-4 rounded-3xl bg-primary/5 -z-10"
            />
          </motion.div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {showArchived ? "No archived notes" : search ? "No notes found" : "Start taking notes"}
          </h3>
          <p className="text-sm text-muted-foreground/50 mb-6 max-w-sm text-center leading-relaxed">
            {search
              ? `No notes match "${search}". Try a different search term.`
              : "Organize your study materials, lecture notes, and ideas. Create your first note to get started."
            }
          </p>
          {!search && (
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openEditor()}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <Plus className="h-4 w-4 relative" /> Create First Note
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          EDITOR MODAL
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-y-auto transition-all duration-300",
                editorFullscreen
                  ? "fixed inset-4 z-50 max-h-none"
                  : "w-full max-w-2xl p-6 max-h-[90vh]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/10">
                    {editingNote ? <Edit3 className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{editingNote ? "Edit Note" : "New Note"}</h3>
                    <p className="text-xs text-muted-foreground/50">{editingNote ? "Update your note" : "Create a new note"}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditor(false)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Enter note title..."
                    className="w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/25 transition-all duration-200"
                    autoFocus
                  />
                </div>

                {/* Subject & Chapter */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative" data-subject-dd>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
                    <button
                      onClick={() => { setShowSubjectDropdown(!showSubjectDropdown); setShowChapterDropdown(false); }}
                      className="w-full flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-foreground hover:border-primary/20 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2 truncate">
                        {editorSubject ? (
                          <>{subjects.find((s) => s.id === editorSubject)?.icon} {subjects.find((s) => s.id === editorSubject)?.name}</>
                        ) : (
                          <><BookOpen className="h-4 w-4 text-muted-foreground/40" /> Select subject</>
                        )}
                      </span>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground/40 transition-transform duration-200", showSubjectDropdown && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {showSubjectDropdown && (
                        <motion.div
                          data-subject-dd
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 mt-1.5 w-full rounded-xl border border-border/60 bg-background shadow-xl overflow-hidden"
                        >
                          {subjects.map((s) => (
                            <button
                              key={s.id}
                              data-dropdown-item
                              onClick={() => { setEditorSubject(s.id); setEditorChapter(""); setShowSubjectDropdown(false); }}
                              className={cn(
                                "w-full px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors flex items-center gap-2",
                                editorSubject === s.id && "bg-primary/8 text-primary font-medium"
                              )}
                            >
                              <span>{s.icon}</span> {s.name}
                              {editorSubject === s.id && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative" data-chapter-dd>
                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chapter</label>
                    <button
                      onClick={() => { setShowChapterDropdown(!showChapterDropdown); setShowSubjectDropdown(false); }}
                      disabled={!editorSubject}
                      className="w-full flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-foreground hover:border-primary/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2 truncate">
                        {editorChapter ? (
                          <><FileText className="h-4 w-4 text-muted-foreground/40" /> {editorChapter}</>
                        ) : (
                          <><FolderOpen className="h-4 w-4 text-muted-foreground/40" /> Select chapter</>
                        )}
                      </span>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground/40 transition-transform duration-200", showChapterDropdown && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {showChapterDropdown && editorSubject && (
                        <motion.div
                          data-chapter-dd
                          initial={{ opacity: 0, y: -4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 mt-1.5 w-full rounded-xl border border-border/60 bg-background shadow-xl max-h-48 overflow-y-auto"
                        >
                          {subjects.find((s) => s.id === editorSubject)?.chapters.map((ch) => (
                            <button
                              key={ch}
                              data-dropdown-item
                              onClick={() => { setEditorChapter(ch); setShowChapterDropdown(false); }}
                              className={cn(
                                "w-full px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors",
                                editorChapter === ch && "bg-primary/8 text-primary font-medium"
                              )}
                            >
                              {ch}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Content with Toolbar & Live Preview */}
                <div>
                  {/* Toolbar Row */}
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content</label>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground/30 font-medium mr-2">
                        {countWords(editorContent)} words · {readingTime(countWords(editorContent))}
                      </span>
                      <button
                        onClick={() => setEditorFullscreen(!editorFullscreen)}
                        className={cn(
                          "rounded-lg p-1.5 text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-all duration-200",
                          editorFullscreen && "text-primary bg-primary/10"
                        )}
                        title="Full-screen (Ctrl+Shift+F)"
                      >
                        {editorFullscreen ? (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                        )}
                      </button>
                      <button
                        onClick={() => setEditorPreview(!editorPreview)}
                        className={cn(
                          "rounded-lg p-1.5 text-muted-foreground/40 hover:text-foreground hover:bg-muted/50 transition-all duration-200",
                          editorPreview && "text-primary bg-primary/10"
                        )}
                        title="Toggle preview (Ctrl+Shift+P)"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-0.5 p-1.5 rounded-t-xl border border-border/60 border-b-0 bg-muted/30">
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "heading1")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Heading 1">
                      <span className="text-xs font-bold">H1</span>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "heading2")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Heading 2">
                      <span className="text-xs font-bold">H2</span>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "heading3")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Heading 3">
                      <span className="text-xs font-bold">H3</span>
                    </button>
                    <div className="w-px h-4 bg-border/40 mx-1" />
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "bold")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Bold (Ctrl+B)">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6.5 4h7a3.5 3.5 0 010 7H6.5V4zM6.5 11h8a3.5 3.5 0 010 7H6.5v-7z" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "italic")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Italic (Ctrl+I)">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0v16m-4 0h8" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "code")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Inline code">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "codeblock")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Code block">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" /></svg>
                    </button>
                    <div className="w-px h-4 bg-border/40 mx-1" />
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "list")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Bullet list">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "ordered")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Numbered list">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h10M7 12h10M7 18h10" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "quote")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Blockquote">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h12M4 18h12M8 6v12" /></svg>
                    </button>
                    <div className="w-px h-4 bg-border/40 mx-1" />
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "link")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Link (Ctrl+K)">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" /></svg>
                    </button>
                    <button onClick={() => insertMarkdown(editorContentRef.current, editorContent, setEditorContent, "hr")} className="rounded-md p-1.5 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 transition-colors" title="Horizontal rule">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" /></svg>
                    </button>
                  </div>

                  {/* Editor & Preview Split */}
                  {editorPreview ? (
                    <div className="grid grid-cols-2 gap-0 border border-border/60 border-t-0 rounded-b-xl overflow-hidden">
                      <textarea
                        ref={editorContentRef}
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder="Write your notes here..."
                        className="w-full h-[400px] bg-muted/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none resize-none font-mono leading-relaxed border-r border-border/40"
                      />
                      <div className="h-[400px] overflow-y-auto bg-muted/5 px-4 py-3">
                        {editorContent ? (
                          <div
                            className="prose prose-sm max-w-none text-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(editorContent) }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground/30 italic">Preview will appear here...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      ref={editorContentRef}
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      placeholder="Write your notes here... (Markdown supported)"
                      rows={editorFullscreen ? 24 : 12}
                      className="w-full rounded-b-xl border border-border/60 border-t-0 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/25 transition-all duration-200 resize-none font-mono leading-relaxed"
                    />
                  )}

                  <p className="mt-1 text-[10px] text-muted-foreground/30">
                    Supports <code className="rounded bg-muted/60 px-1">**bold**</code>, <code className="rounded bg-muted/60 px-1">*italic*</code>, <code className="rounded bg-muted/60 px-1">`code`</code>, <code className="rounded bg-muted/60 px-1">### headings</code>, <code className="rounded bg-muted/60 px-1">- lists</code>
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Add tag and press Enter..."
                      className="flex-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-200"
                    />
                  </div>
                  <AnimatePresence>
                    {editorTags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden"
                      >
                        {editorTags.map((tag) => (
                          <motion.span
                            key={tag}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary/8 border border-primary/12 px-2.5 py-1 text-xs font-semibold text-primary"
                          >
                            #{tag}
                            <button
                              onClick={() => setEditorTags((prev) => prev.filter((t) => t !== tag))}
                              className="hover:text-primary/50 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Attachments */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Upload className="inline h-3.5 w-3.5 mr-1" /> Attachments
                  </label>
                  <div
                    className="rounded-xl border-2 border-dashed border-border/40 p-5 text-center hover:border-primary/25 hover:bg-primary/[0.02] transition-all duration-300 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground/25 group-hover:text-primary/40 transition-colors" />
                    <p className="text-sm text-muted-foreground/50 font-medium">Drop files or click to upload</p>
                    <p className="text-[10px] text-muted-foreground/30 mt-1">PDF, DOC, MD, PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.md,.markdown,.png,.jpg,.jpeg,.gif,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <AnimatePresence>
                    {editorAttachments.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {editorAttachments.map((att) => (
                          <motion.div
                            key={att.id}
                            layout
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/15 p-3 group/att"
                          >
                            {getAttachmentIcon(att.category)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{att.name}</p>
                              <p className="text-[10px] text-muted-foreground/40">{formatFileSize(att.size)}</p>
                            </div>
                            <button
                              onClick={() => setEditorAttachments((prev) => prev.filter((a) => a.id !== att.id))}
                              className="rounded-lg p-1.5 hover:bg-red-500/10 text-muted-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover/att:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Pin & Star Toggles */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditorPinned(!editorPinned)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                      editorPinned
                        ? "border-primary/30 bg-primary/8 text-primary shadow-sm shadow-primary/10"
                        : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:border-primary/15"
                    )}
                  >
                    <Pin className="h-4 w-4" /> Pin
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setEditorStarred(!editorStarred)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-300",
                      editorStarred
                        ? "border-amber-400/30 bg-amber-400/8 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-400/10"
                        : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:border-primary/15"
                    )}
                  >
                    <Star className={cn("h-4 w-4 transition-all duration-300", editorStarred && "fill-amber-400")} /> Star
                  </motion.button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-border/30">
                {/* Left side: save status + keyboard shortcut hints */}
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {editorSaveStatus === "saving" && (
                      <motion.div
                        key="saving"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground/50"
                      >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </motion.div>
                        Saving...
                      </motion.div>
                    )}
                    {editorSaveStatus === "saved" && (
                      <motion.div
                        key="saved"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-1.5 text-xs text-emerald-500/70"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Saved
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground/30">
                    <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono">Ctrl+B</kbd><span>Bold</span>
                    <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono">Ctrl+I</kbd><span>Italic</span>
                    <kbd className="rounded border border-border/40 bg-muted/30 px-1 py-0.5 font-mono">Ctrl+S</kbd><span>Save</span>
                  </div>
                </div>
                {/* Right side: action buttons */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditor(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={saveNote}
                    disabled={!editorTitle.trim()}
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    <Save className="h-4 w-4 relative" /> {editingNote ? "Update" : "Create"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          PREVIEW MODAL
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowPreview(null)}
          >
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-border/30 px-6 py-4 bg-muted/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {showPreview.pinned && (
                      <span className="rounded-full bg-primary/10 p-0.5"><Pin className="h-3 w-3 text-primary" /></span>
                    )}
                    <h3 className="text-lg font-bold text-foreground truncate">{showPreview.title}</h3>
                    {showPreview.starred && <Star className="h-4 w-4 fill-amber-400 text-amber-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/50 flex-wrap">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(showPreview.updatedAt)}</span>
                    {showPreview.subject && <span>{subjects.find((s) => s.id === showPreview.subject)?.icon} {subjects.find((s) => s.id === showPreview.subject)?.name}</span>}
                    {showPreview.chapter && <span className="flex items-center gap-1"><FolderOpen className="h-3 w-3" />{showPreview.chapter}</span>}
                    <span>{showPreview.wordCount} words · {readingTime(showPreview.wordCount)}</span>
                    {showPreview.tags.length > 0 && (
                      <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{showPreview.tags.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowPreview(null); openEditor(showPreview); }}
                    className="flex items-center gap-1.5 rounded-lg bg-primary/8 border border-primary/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/12 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPreview(null)}
                    className="rounded-xl p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div
                  className="prose prose-sm max-w-none text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(showPreview.content) }}
                />

                {/* Attachments Section */}
                {showPreview.attachments.length > 0 && (
                  <div className="mt-8 border-t border-border/30 pt-6">
                    <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground/50" />
                      Attachments ({showPreview.attachments.length})
                    </h4>
                    <div className="space-y-3">
                      {showPreview.attachments.map((att) => (
                        <motion.div
                          key={att.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-border/40 bg-muted/10 overflow-hidden"
                        >
                          {att.category === "pdf" && <div className="w-full h-[500px]"><iframe src={att.url} className="w-full h-full border-0" title={att.name} /></div>}
                          {att.category === "markdown" && (
                            <div className="p-4">
                              <div
                                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: (() => { try { return renderMarkdown(atob(att.url.split(",")[1] || "")); } catch { return "<p class='text-muted-foreground'>Could not render markdown</p>"; } })()
                                }}
                              />
                            </div>
                          )}
                          {att.category === "image" && <div className="p-4 flex justify-center"><img src={att.url} alt={att.name} className="max-w-full max-h-[400px] rounded-lg object-contain" /></div>}
                          {att.category !== "pdf" && att.category !== "markdown" && att.category !== "image" && (
                            <div className="p-4 flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30">{getAttachmentIcon(att.category)}</div>
                              <div className="flex-1"><p className="text-sm font-medium text-foreground">{att.name}</p><p className="text-xs text-muted-foreground/50">{formatFileSize(att.size)}</p></div>
                            </div>
                          )}
                          <div className="flex items-center justify-between border-t border-border/30 bg-muted/10 px-4 py-2.5">
                            <span className="text-xs text-muted-foreground/40 font-medium">{att.name} · {formatFileSize(att.size)}</span>
                            <div className="flex gap-2">
                              <a href={att.url} download={att.name} className="flex items-center gap-1 rounded-lg bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/12 transition-colors"><Download className="h-3 w-3" /> Download</a>
                              {att.category === "pdf" && <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"><ExternalLink className="h-3 w-3" /> Open</a>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          SUBJECT MANAGER MODAL
         ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSubjectManager && (
          <motion.div
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowSubjectManager(false)}
          >
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-lg rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Manage Subjects</h3>
                    <p className="text-xs text-muted-foreground/50">Add subjects and chapters for your notes</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSubjectManager(false)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Add Subject */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  value={newSubjectIcon}
                  onChange={(e) => setNewSubjectIcon(e.target.value)}
                  className="w-14 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all"
                  placeholder="📚"
                />
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSubject()}
                  placeholder="New subject name..."
                  className="flex-1 rounded-xl border border-border/60 bg-muted/20 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={addSubject}
                  disabled={!newSubjectName.trim()}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  Add
                </motion.button>
              </div>

              {/* Subject List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {subjects.map((s, i) => {
                    const colors = subjectColorMap[s.color] || subjectColorMap.blue;
                    const noteCountForSubject = notes.filter((n) => n.subject === s.id).length;
                    return (
                      <motion.div
                        key={s.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn("rounded-xl border p-4 transition-all duration-200 hover:shadow-sm", colors.bg, colors.border)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{s.icon}</span>
                            <span className={cn("font-bold text-sm", colors.text)}>{s.name}</span>
                            <span className="text-xs opacity-50 font-medium">{s.chapters.length} ch · {noteCountForSubject} notes</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteSubject(s.id)}
                            className="rounded-lg p-1.5 hover:bg-red-500/10 text-red-400/60 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {s.chapters.map((ch) => (
                            <motion.span
                              key={ch}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center gap-1 rounded-lg bg-background/50 border border-border/40 px-2.5 py-1 text-xs font-medium text-foreground/70 group/ch"
                            >
                              {ch}
                              <button
                                onClick={() => deleteChapter(s.id, ch)}
                                className="opacity-0 group-hover/ch:opacity-100 hover:text-red-500 transition-all"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </motion.span>
                          ))}
                          {s.chapters.length === 0 && (
                            <span className="text-xs text-muted-foreground/30 italic">No chapters yet</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingSubject === s.id ? newChapterName : ""}
                            onChange={(e) => { setEditingSubject(s.id); setNewChapterName(e.target.value); }}
                            onKeyDown={(e) => { if (e.key === "Enter") { addChapter(s.id); setEditingSubject(null); } }}
                            onFocus={() => setEditingSubject(s.id)}
                            placeholder="Add chapter..."
                            className="flex-1 rounded-lg border border-border/30 bg-background/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/15 transition-all"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { if (editingSubject === s.id && newChapterName.trim()) { addChapter(s.id); setEditingSubject(null); } }}
                            className="rounded-lg bg-background/50 border border-border/30 px-3 py-2 text-xs font-semibold hover:bg-background/80 transition-colors"
                          >
                            +
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
