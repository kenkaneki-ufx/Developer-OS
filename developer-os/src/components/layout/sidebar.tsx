"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Code,
  Map,
  FolderKanban,
  GitBranch,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  FileCode,
  Sparkles,
  Calendar,
  LogIn,
  MessageSquare,
  Trophy,
  GraduationCap,
  BookOpen,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Chat",
        href: "/dashboard/ai-chat",
        icon: MessageSquare,
        badge: "AI",
      },
      {
        label: "College Planner",
        href: "/dashboard/college",
        icon: GraduationCap,
      },
      {
        label: "Weekly Schedule",
        href: "/dashboard/schedule",
        icon: Calendar,
      },
      {
        label: "Daily Tasks",
        href: "/dashboard/tasks",
        icon: Sparkles,
        badge: "AI",
      },
    ],
  },
  {
    title: "Skills & Growth",
    items: [
      {
        label: "DSA Tracker",
        href: "/dashboard/dsa",
        icon: Code,
      },
      {
        label: "Programming Roadmap",
        href: "/dashboard/roadmaps/programming",
        icon: Map,
      },
      {
        label: "ML Roadmap",
        href: "/dashboard/roadmaps/ml",
        icon: Map,
      },
    ],
  },
  {
    title: "Projects & Work",
    items: [
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        label: "GitHub",
        href: "/dashboard/github",
        icon: Github,
      },
      {
        label: "LeetCode",
        href: "/dashboard/leetcode",
        icon: Trophy,
      },
      {
        label: "Notes",
        href: "/dashboard/notes",
        icon: FileText,
      },
      {
        label: "Documentation",
        href: "/dashboard/documentation",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        label: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        label: "Weekly Review",
        href: "/dashboard/reviews/weekly",
        icon: FileCode,
      },
      {
        label: "Monthly Review",
        href: "/dashboard/reviews/monthly",
        icon: FileCode,
      },
    ],
  },
];

function NavGroupComponent({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200"
      >
        {group.title}
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-primary to-primary/70"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-all duration-200",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-lg bg-gradient-to-r from-primary/15 to-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/10 shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile overlay - only visible on mobile when sidebar is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => onOpenChange(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - CSS-only responsive positioning */}
      <aside
        className={cn(
          // Base styles
          "h-screen border-r border-border bg-sidebar transition-all duration-300 ease-[0.25,0.46,0.45,0.94]",
          // Desktop: always visible, relative positioning, fixed width
          "lg:relative lg:z-50 lg:shrink-0 lg:w-[260px] lg:opacity-100",
          // Mobile: fixed positioning, controlled by open state
          "fixed left-0 top-0 z-50 w-[260px]",
          open
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 pointer-events-none lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto"
        )}
      >
        <div className="flex h-full w-[260px] flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-5">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.08, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-sm font-bold text-primary-foreground">DO</span>
            </motion.div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">
                Developer OS
              </h1>
              <p className="text-[11px] text-muted-foreground/70">Your second brain</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 pt-4">
            {navGroups.map((group) => (
              <NavGroupComponent
                key={group.title}
                group={group}
                pathname={pathname}
              />
            ))}

          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            {status === "loading" ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ) : user ? (
              <Link
                href="/dashboard/settings"
                className="group"
              >
                <div
                  className="flex items-center gap-3 rounded-xl p-2 -m-2 cursor-pointer hover:bg-muted/60 transition-all duration-200"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-full object-cover shadow-md ring-2 ring-primary/20 group-hover:ring-primary/40 group-hover:scale-105 transition-all duration-200"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary shadow-md shadow-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 group-hover:scale-105 transition-all duration-200">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground/70">
                      {user.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="text-muted-foreground/40 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0 -translate-x-1">
                    <Settings className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
