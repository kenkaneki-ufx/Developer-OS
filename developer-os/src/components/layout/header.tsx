"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  LogOut,
  Settings,
  Github,
  Calendar,
  Code2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  type: "class" | "github" | "leetcode";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "class",
    title: "Upcoming Class",
    message: "Data Structures & Algorithms starts in 30 minutes",
    time: "30 min",
    read: false,
  },
  {
    id: "2",
    type: "github",
    title: "PR Review Requested",
    message: "Your pull request on developer-os needs review",
    time: "1h ago",
    read: false,
    link: "https://github.com",
  },
  {
    id: "3",
    type: "leetcode",
    title: "Daily Challenge",
    message: "Complete today's LeetCode challenge to maintain your streak",
    time: "2h ago",
    read: true,
  },
  {
    id: "4",
    type: "class",
    title: "Class Reminder",
    message: "Machine Learning lecture tomorrow at 10:00 AM",
    time: "5h ago",
    read: true,
  },
  {
    id: "5",
    type: "github",
    title: "Issue Assigned",
    message: "New issue assigned to you: Fix authentication bug",
    time: "1d ago",
    read: true,
    link: "https://github.com",
  },
];

const notificationIcons = {
  class: { icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
  github: { icon: Github, color: "text-gray-500", bg: "bg-gray-500/10" },
  leetcode: { icon: Code2, color: "text-accentOrange", bg: "bg-accentOrange/10" },
};

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const user = session?.user;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification panel on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="relative z-[60] flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all duration-200 lg:hidden z-[70]"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative rounded-xl p-2.5 transition-colors duration-200",
              showNotifications
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 ring-2 ring-background shadow-sm shadow-primary/20">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
              </span>
            )}
          </motion.button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute right-0 top-full z-[100] mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5 dark:shadow-black/20"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell className="mx-auto h-8 w-8 text-muted-foreground/30" />
                      <p className="mt-2 text-sm text-muted-foreground/50">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const notifConfig =
                        notificationIcons[notification.type];
                      const IconComp = notifConfig.icon;

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            "flex items-start gap-3 border-b border-border/50 px-4 py-3 transition-colors hover:bg-muted/30 cursor-pointer",
                            !notification.read && "bg-muted/20"
                          )}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.link) {
                              window.open(notification.link, "_blank");
                            }
                          }}
                        >
                          <div
                            className={cn(
                              "mt-0.5 rounded-lg p-1.5",
                              notifConfig.bg
                            )}
                          >
                            <IconComp
                              className={cn("h-4 w-4", notifConfig.color)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={cn(
                                  "text-sm font-medium truncate",
                                  notification.read
                                    ? "text-muted-foreground"
                                    : "text-foreground"
                                )}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground/70 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground/50" />
                              <span className="text-[11px] text-muted-foreground/50">
                                {notification.time}
                              </span>
                              {notification.link && (
                                <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-4 py-2.5">
                  <Link
                    href="/dashboard/schedule"
                    className="flex items-center justify-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    View class schedule
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* GitHub link */}
        {user?.githubUsername && (
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://github.com/${user.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors duration-200"
            title="View GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </motion.a>
        )}

        {/* User avatar */}
        <div className="relative ml-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted/60 transition-colors duration-200"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full ring-2 ring-primary/20 object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary shadow-sm shadow-primary/10">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100]"
                  onClick={() => setShowUserMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 top-full z-[110] mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl shadow-black/5 dark:shadow-black/20"
                >
                  <div className="border-b border-border px-3 py-3 mb-1">
                    <p className="text-sm font-semibold text-foreground">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors duration-150"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut({ callbackUrl: "/auth/login" });
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
