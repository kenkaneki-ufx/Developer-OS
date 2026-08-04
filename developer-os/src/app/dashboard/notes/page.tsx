"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageWrapper } from "@/components/ui/page-wrapper";

interface NoteAttachment {
  id: string;
  name: string;
  type: string; // mime type
  size: number;
  url: string; // data URL or blob URL
  category: "pdf" | "document" | "markdown" | "image" | "other";
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  updatedAt: string;
  pinned: boolean;
  starred: boolean;
  attachments: NoteAttachment[];
  color: number;
}

const defaultNotes: Note[] = [
  { id: "1", title: "Binary Trees Notes", content: "In-order, pre-order, post-order traversal patterns.\n\n## DFS and BFS approaches\n- DFS uses stack or recursion\n- BFS uses queue\n\n### Traversal patterns\n1. **In-order**: Left → Root → Right\n2. **Pre-order**: Root → Left → Right\n3. **Post-order**: Left → Right → Root", tags: ["dsa", "trees"], folder: "DSA", updatedAt: "2 hours ago", pinned: true, starred: false, attachments: [], color: 0 },
  { id: "2", title: "React Hooks Cheat Sheet", content: "useState, useEffect, useCallback, useMemo patterns. Custom hooks best practices. Performance optimization tips.", tags: ["react", "hooks"], folder: "Frontend", updatedAt: "1 day ago", pinned: false, starred: true, attachments: [], color: 1 },
  { id: "3", title: "SQL Joins Reference", content: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, CROSS JOIN. Performance considerations and indexing strategies.", tags: ["sql", "database"], folder: "Database", updatedAt: "3 days ago", pinned: false, starred: false, attachments: [], color: 2 },
  { id: "4", title: "ML Algorithms Summary", content: "Linear Regression, Logistic Regression, SVM, Decision Trees, Random Forest, Gradient Boosting. When to use each algorithm.", tags: ["ml", "algorithms"], folder: "ML", updatedAt: "1 week ago", pinned: false, starred: false, attachments: [], color: 3 },
  { id: "5", title: "Git Commands", content: "git stash, git rebase, git cherry-pick advanced. Git workflow strategies for teams. Conflict resolution patterns.", tags: ["git", "devops"], folder: "DevOps", updatedAt: "2 days ago", pinned: false, starred: false, attachments: [], color: 4 },
  { id: "6", title: "System Design Notes", content: "CAP theorem, horizontal vs vertical scaling, load balancing strategies, caching patterns, database sharding.", tags: ["architecture", "system-design"], folder: "Architecture", updatedAt: "5 days ago", pinned: true, starred: true, attachments: [], color: 0 },
];

const folders = ["All", "DSA", "Frontend", "Database", "ML", "DevOps", "Architecture"];

const noteColors = [
  "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
  "from-green-500/10 to-green-500/5 border-green-500/20",
  "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  "from-pink-500/10 to-pink-500/5 border-pink-500/20",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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

const NOTES_STORAGE_KEY = "developer-os-notes";

function loadNotesFromStorage(): Note[] | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveNotesToStorage(notes: Note[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }
}

function renderMarkdown(text: string): string {
  let html = text
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

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const isLoadedRef = useRef(false);

  // Load from localStorage on mount, then persist on changes
  useEffect(() => {
    const stored = loadNotesFromStorage();
    if (stored) setNotes(stored);
    isLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (isLoadedRef.current) saveNotesToStorage(notes);
  }, [notes]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [showPreview, setShowPreview] = useState<Note | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorFolder, setEditorFolder] = useState("DSA");
  const [editorPinned, setEditorPinned] = useState(false);
  const [editorStarred, setEditorStarred] = useState(false);
  const [editorAttachments, setEditorAttachments] = useState<NoteAttachment[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = notes.filter(
    (n) =>
      (folder === "All" || n.folder === folder) &&
      (n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  );

  const pinnedNotes = filtered.filter((n) => n.pinned);
  const unpinnedNotes = filtered.filter((n) => !n.pinned);
  const displayNotes = [...pinnedNotes, ...unpinnedNotes];

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setEditorTitle(note.title);
      setEditorContent(note.content);
      setEditorTags([...note.tags]);
      setEditorFolder(note.folder);
      setEditorPinned(note.pinned);
      setEditorStarred(note.starred);
      setEditorAttachments([...note.attachments]);
    } else {
      setEditingNote(null);
      setEditorTitle("");
      setEditorContent("");
      setEditorTags([]);
      setEditorFolder("DSA");
      setEditorPinned(false);
      setEditorStarred(false);
      setEditorAttachments([]);
    }
    setShowEditor(true);
  };

  const saveNote = () => {
    if (!editorTitle.trim()) return;

    const now = "Just now";
    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                title: editorTitle,
                content: editorContent,
                tags: editorTags,
                folder: editorFolder,
                pinned: editorPinned,
                starred: editorStarred,
                attachments: editorAttachments,
                updatedAt: now,
              }
            : n
        )
      );
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: editorTitle,
        content: editorContent,
        tags: editorTags,
        folder: editorFolder,
        updatedAt: now,
        pinned: editorPinned,
        starred: editorStarred,
        attachments: editorAttachments,
        color: Math.floor(Math.random() * noteColors.length),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setShowEditor(false);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (showPreview?.id === id) setShowPreview(null);
  };

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const toggleStar = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n)));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editorTags.includes(tag)) {
      setEditorTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setEditorTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const attachment: NoteAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: dataUrl,
          category: getAttachmentCategory(file.type, file.name),
        };
        setEditorAttachments((prev) => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setEditorAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const downloadAttachment = (att: NoteAttachment) => {
    const a = document.createElement("a");
    a.href = att.url;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getAttachmentIcon = (category: NoteAttachment["category"]) => {
    switch (category) {
      case "pdf": return <File className="h-4 w-4 text-red-500" />;
      case "image": return <FileImage className="h-4 w-4 text-green-500" />;
      case "markdown": return <FileText className="h-4 w-4 text-blue-500" />;
      case "document": return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <PageWrapper
      title="Notes"
      subtitle="Your personal knowledge base"
      headerAction={
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openEditor()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200"
        >
          <Plus className="h-4 w-4" /> New Note
        </motion.button>
      }
    >
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Search and Filters */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1 overflow-x-auto">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap",
                    folder === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-xl border border-border bg-muted/30 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("rounded-lg p-2 transition-all duration-200", viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("rounded-lg p-2 transition-all duration-200", viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground")}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notes Stats */}
        <motion.div variants={item} className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium">{displayNotes.length} notes</span>
          {pinnedNotes.length > 0 && (
            <span className="flex items-center gap-1">
              <Pin className="h-3 w-3" /> {pinnedNotes.length} pinned
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" /> {notes.filter((n) => n.starred).length} starred
          </span>
        </motion.div>

        {/* Notes Grid/List */}
        <motion.div variants={item} className={cn(viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3")}>
          <AnimatePresence mode="popLayout">
            {displayNotes.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
                  noteColors[note.color % noteColors.length],
                  viewMode === "list" && "flex items-center gap-4"
                )}
                onClick={() => setShowPreview(note)}
              >
                {note.pinned && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <Pin className="h-3 w-3" />
                    </div>
                  </div>
                )}

                <div className={cn(viewMode === "grid" ? "" : "flex-1")}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">{note.title}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setShowPreview(note)}
                        className="rounded-lg p-1.5 hover:bg-primary/10"
                        title="Preview"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openEditor(note)}
                        className="rounded-lg p-1.5 hover:bg-background/80"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-muted-foreground/60" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteNote(note.id)}
                        className="rounded-lg p-1.5 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                  <p className={cn("text-sm text-muted-foreground/60 leading-relaxed whitespace-pre-line", viewMode === "grid" ? "line-clamp-3" : "line-clamp-1")}>
                    {note.content}
                  </p>

                  {/* Attachments preview */}
                  {note.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {note.attachments.slice(0, 3).map((att) => (
                        <span key={att.id} className="inline-flex items-center gap-1 rounded-md bg-background/60 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                          {getAttachmentIcon(att.category)}
                          {att.name.length > 15 ? att.name.slice(0, 15) + "..." : att.name}
                        </span>
                      ))}
                      {note.attachments.length > 3 && (
                        <span className="text-[10px] text-muted-foreground/40">+{note.attachments.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="mt-3.5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.slice(0, viewMode === "list" ? 3 : undefined).map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-md bg-background/50 border border-border/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                          <Hash className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/40 font-medium">
                      {note.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {note.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {displayNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16"
          >
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <FileText className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
            <p className="text-sm text-muted-foreground/60 mb-4">{search ? "Try a different search term" : "Create your first note to get started"}</p>
            <button
              onClick={() => openEditor()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200"
            >
              <Plus className="h-4 w-4" /> New Note
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-foreground">{editingNote ? "Edit Note" : "New Note"}</h3>
                <button onClick={() => setShowEditor(false)} className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted/60 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Note title..."
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Content</label>
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write your notes here... (Markdown supported)"
                    rows={10}
                    className="w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 resize-none font-mono leading-relaxed"
                  />
                  <p className="mt-1 text-xs text-muted-foreground/40">Supports **bold**, *italic*, `code`, ### headings, - lists</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Folder</label>
                    <button
                      onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                      className="w-full flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        {editorFolder}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {showFolderDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-xl border border-border bg-background shadow-lg">
                        {folders.filter((f) => f !== "All").map((f) => (
                          <button
                            key={f}
                            onClick={() => {
                              setEditorFolder(f);
                              setShowFolderDropdown(false);
                            }}
                            className={cn("w-full px-4 py-2.5 text-sm text-left hover:bg-muted/60 transition-colors first:rounded-t-xl last:rounded-b-xl", editorFolder === f && "bg-primary/10 text-primary font-medium")}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Tags</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className="flex-1 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                      <button onClick={addTag} className="rounded-xl bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors">
                        Add
                      </button>
                    </div>
                    {editorTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {editorTags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                            #{tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-primary/70">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* File Attachments */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    <Upload className="inline h-4 w-4 mr-1" />
                    Attachments (PDF, Docs, MD, Images)
                  </label>
                  <div
                    className="rounded-xl border-2 border-dashed border-border p-4 text-center hover:border-primary/30 hover:bg-muted/20 transition-all duration-200 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground/60">Click to upload or drag files here</p>
                    <p className="text-xs text-muted-foreground/40 mt-1">PDF, DOC, MD, PNG, JPG up to 10MB</p>
                  </div>
                  <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.md,.markdown,.png,.jpg,.jpeg,.gif,.txt" className="hidden" onChange={handleFileUpload} />

                  {editorAttachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {editorAttachments.map((att) => (
                        <div key={att.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-3">
                          {getAttachmentIcon(att.category)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{att.name}</p>
                            <p className="text-xs text-muted-foreground/50">{formatFileSize(att.size)} • {att.category.toUpperCase()}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => downloadAttachment(att)} className="rounded-lg p-1.5 hover:bg-muted/60 text-muted-foreground/60 hover:text-foreground transition-colors" title="Download">
                              <Download className="h-4 w-4" />
                            </button>
                            <button onClick={() => removeAttachment(att)} className="rounded-lg p-1.5 hover:bg-red-500/10 text-muted-foreground/60 hover:text-red-500 transition-colors" title="Remove">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick toggles */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditorPinned(!editorPinned)}
                    className={cn("flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200", editorPinned ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/40")}
                  >
                    <Pin className="h-4 w-4" /> Pin
                  </button>
                  <button
                    onClick={() => setEditorStarred(!editorStarred)}
                    className={cn("flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200", editorStarred ? "border-yellow-400 bg-yellow-400/10 text-yellow-600" : "border-border text-muted-foreground hover:bg-muted/40")}
                  >
                    <Star className={cn("h-4 w-4", editorStarred && "fill-yellow-400")} /> Star
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button onClick={() => setShowEditor(false)} className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveNote}
                  disabled={!editorTitle.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {editingNote ? "Update Note" : "Create Note"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">{showPreview.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{showPreview.updatedAt}</span>
                    <span>{showPreview.folder}</span>
                    {showPreview.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {showPreview.tags.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setShowPreview(null); openEditor(showPreview); }} className="flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => setShowPreview(null)} className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted/60 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Render markdown content */}
                <div className="prose prose-sm max-w-none text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: renderMarkdown(showPreview.content) }} />

                {/* Attachments */}
                {showPreview.attachments.length > 0 && (
                  <div className="mt-8 border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attachments ({showPreview.attachments.length})
                    </h4>
                    <div className="space-y-3">
                      {showPreview.attachments.map((att) => (
                        <div key={att.id} className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                          {/* PDF Preview */}
                          {att.category === "pdf" && (
                            <div className="w-full h-[500px]">
                              <iframe src={att.url} className="w-full h-full border-0" title={att.name} />
                            </div>
                          )}

                          {/* Markdown Preview */}
                          {att.category === "markdown" && (
                            <div className="p-4">
                              <div
                                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: (() => {
                                    try {
                                      const content = atob(att.url.split(",")[1] || "");
                                      return renderMarkdown(content);
                                    } catch {
                                      return "<p class='text-muted-foreground'>Could not render markdown content</p>";
                                    }
                                  })(),
                                }}
                              />
                            </div>
                          )}

                          {/* Image Preview */}
                          {att.category === "image" && (
                            <div className="p-4 flex justify-center">
                              <img src={att.url} alt={att.name} className="max-w-full max-h-[400px] rounded-lg object-contain" />
                            </div>
                          )}

                          {/* File info for non-previewable */}
                          {att.category !== "pdf" && att.category !== "markdown" && att.category !== "image" && (
                            <div className="p-4 flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/40">
                                {getAttachmentIcon(att.category)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{att.name}</p>
                                <p className="text-xs text-muted-foreground/50">{formatFileSize(att.size)}</p>
                              </div>
                            </div>
                          )}

                          {/* Download bar */}
                          <div className="flex items-center justify-between border-t border-border bg-muted/10 px-4 py-2.5">
                            <span className="text-xs text-muted-foreground/60 font-medium">{att.name} • {formatFileSize(att.size)}</span>
                            <div className="flex gap-2">
                              <button onClick={() => downloadAttachment(att)} className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                                <Download className="h-3 w-3" /> Download
                              </button>
                              {att.category === "pdf" && (
                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                                  <ExternalLink className="h-3 w-3" /> Open in New Tab
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
