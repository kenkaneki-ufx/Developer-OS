import {
  FileCode,
  Palette,
  Braces,
  Terminal,
  Coffee,
  Cpu,
  Code2,
  Database,
  Rocket,
  Layers,
  Atom,
  Server,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface Course {
  id: string;
  title: string;
  language: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind gradient classes used for the icon tile */
  gradient: string;
  /** Tailwind text color for accents */
  accent: string;
  /** Number of sections in the notes file (0 for coming-soon) */
  sections: number;
  /** Filename inside public/learning/ — undefined means not published yet */
  file?: string;
  available: boolean;
}

/**
 * Learning Hub course registry.
 *
 * To add a new language:
 *   1. Drop the notes .html file into public/learning/ (e.g. python-notes.html)
 *   2. Add an entry below with `available: true` and `file: "python-notes.html"`
 *   3. It appears in the hub automatically — no other changes needed.
 */
export const courses: Course[] = [
  // ---------------- Web (ready now) ----------------
  {
    id: "html",
    title: "HTML",
    language: "Web",
    description:
      "Every tag, every topic. 41 sections covering structure, forms, tables, media and more — with live previews.",
    icon: FileCode,
    gradient: "from-orange-500 to-amber-500",
    accent: "text-orange-400",
    sections: 41,
    file: "html-complete-notes.html",
    available: true,
  },
  {
    id: "css",
    title: "CSS",
    language: "Web",
    description:
      "From selectors and the box model to Flexbox, Grid and animations. 31 sections with live, resizable demos.",
    icon: Palette,
    gradient: "from-blue-500 to-indigo-500",
    accent: "text-blue-400",
    sections: 31,
    file: "css-notes.html",
    available: true,
  },
  {
    id: "javascript",
    title: "JavaScript",
    language: "Web",
    description:
      "Variables to fetch and async/await. 36 sections, every demo is a live interactive playground.",
    icon: Braces,
    gradient: "from-yellow-500 to-amber-600",
    accent: "text-yellow-400",
    sections: 36,
    file: "javascript-notes.html",
    available: true,
  },
  {
    id: "python",
    title: "Python",
    language: "General Purpose",
    description:
      "From print() to classes, decorators and a playable guessing game. 36 sections with live Python-style demos.",
    icon: Terminal,
    gradient: "from-green-500 to-emerald-600",
    accent: "text-green-400",
    sections: 36,
    file: "python-notes.html",
    available: true,
  },

  // ---------------- Coming soon ----------------
  {
    id: "java",
    title: "Java",
    language: "General Purpose",
    description: "OOP from the ground up — classes, inheritance, collections.",
    icon: Coffee,
    gradient: "from-red-500 to-orange-600",
    accent: "text-red-400",
    sections: 0,
    available: false,
  },
  {
    id: "c",
    title: "C",
    language: "Systems",
    description:
      "Pointers, malloc, structs and linked lists — how computers really work. 36 sections with live memory demos.",
    icon: Cpu,
    gradient: "from-sky-500 to-blue-600",
    accent: "text-sky-400",
    sections: 36,
    file: "c-notes.html",
    available: true,
  },
  {
    id: "cpp",
    title: "C++",
    language: "Systems",
    description: "C plus objects, STL, and performance.",
    icon: Code2,
    gradient: "from-blue-500 to-purple-600",
    accent: "text-blue-400",
    sections: 0,
    available: false,
  },
  {
    id: "typescript",
    title: "TypeScript",
    language: "Web",
    description: "JavaScript with types — what every modern project uses.",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500",
    accent: "text-cyan-400",
    sections: 0,
    available: false,
  },
  {
    id: "sql",
    title: "SQL",
    language: "Data",
    description: "Querying databases — SELECT, JOIN, and the rest.",
    icon: Database,
    gradient: "from-indigo-500 to-violet-600",
    accent: "text-indigo-400",
    sections: 0,
    available: false,
  },
  {
    id: "go",
    title: "Go",
    language: "Systems",
    description: "Simple, fast, concurrent — Google's modern classic.",
    icon: Rocket,
    gradient: "from-cyan-500 to-teal-500",
    accent: "text-teal-400",
    sections: 0,
    available: false,
  },
  {
    id: "rust",
    title: "Rust",
    language: "Systems",
    description: "Memory safety without a garbage collector.",
    icon: Layers,
    gradient: "from-orange-600 to-red-600",
    accent: "text-orange-400",
    sections: 0,
    available: false,
  },
  {
    id: "react",
    title: "React",
    language: "Framework",
    description: "Components, state and hooks — the web framework.",
    icon: Atom,
    gradient: "from-cyan-500 to-sky-600",
    accent: "text-cyan-400",
    sections: 0,
    available: false,
  },
  {
    id: "nodejs",
    title: "Node.js",
    language: "Backend",
    description: "JavaScript on the server — APIs, Express, and more.",
    icon: Server,
    gradient: "from-green-600 to-lime-600",
    accent: "text-green-400",
    sections: 0,
    available: false,
  },
];

export function getCourse(id: string | null | undefined) {
  return courses.find((c) => c.id === id);
}

export const availableCourses = courses.filter((c) => c.available);
export const comingSoonCourses = courses.filter((c) => !c.available);
export const totalSections = availableCourses.reduce(
  (acc, c) => acc + c.sections,
  0
);
