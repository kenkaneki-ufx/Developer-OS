"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Code2,
  Trophy,
  TrendingUp,
  AlertCircle,
  Loader2,
  RefreshCw,
  Link2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Zap,
  BookOpen,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
  Hash,
  GitBranch,
  Lightbulb,
  Award,
  Timer,
  ChevronRight,
  Play,
  Search,
  Database,
  BarChart3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { AnimatedProgress } from "@/components/ui/animated-progress";
import { PageWrapper } from "@/components/ui/page-wrapper";

interface LeetCodeUser {
  username: string;
  profile: {
    realName: string | null;
    userAvatar: string | null;
    reputation: number | null;
    ranking: number | null;
  };
}

interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  easyPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
  ranking: number;
  streak: number;
  recentSubmissions: Array<{
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
  }>;
}

interface LeetCodeData {
  user: LeetCodeUser;
  stats: LeetCodeStats;
  isFallback?: boolean;
}

const difficultyColors = {
  Easy: {
    text: "text-emerald-500",
    bg: "bg-emerald-500",
    light: "bg-emerald-500/10",
    gradient: "from-emerald-500 to-emerald-400",
  },
  Medium: {
    text: "text-amber-500",
    bg: "bg-amber-500",
    light: "bg-amber-500/10",
    gradient: "from-amber-500 to-amber-400",
  },
  Hard: {
    text: "text-rose-500",
    bg: "bg-rose-500",
    light: "bg-rose-500/10",
    gradient: "from-rose-500 to-rose-400",
  },
};

const topicCategories = [
  { name: "Arrays", icon: Hash, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20", problems: 250, slug: "array" },
  { name: "Strings", icon: Code2, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/20", problems: 180, slug: "string" },
  { name: "Linked Lists", icon: GitBranch, color: "text-emerald-500", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20", problems: 65, slug: "linked-list" },
  { name: "Trees", icon: GitBranch, color: "text-accentOrange", bgColor: "bg-accentOrange/10", borderColor: "border-accentOrange/20", problems: 120, slug: "tree" },
  { name: "Dynamic Programming", icon: Brain, color: "text-rose-500", bgColor: "bg-rose-500/10", borderColor: "border-rose-500/20", problems: 300, slug: "dynamic-programming" },
  { name: "Graphs", icon: GitBranch, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20", problems: 150, slug: "graph" },
  { name: "Binary Search", icon: Search, color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/20", problems: 80, slug: "binary-search" },
  { name: "Stack & Queue", icon: BarChart3, color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/20", problems: 90, slug: "stack" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function LeetCodePage() {
  const { data: session } = useSession();
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [username, setUsername] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "topics" | "submissions">("stats");
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDetectError, setAutoDetectError] = useState<string | null>(null);
  const [suggestedUsername, setSuggestedUsername] = useState<string | null>(null);
  const [autoDetectSuccess, setAutoDetectSuccess] = useState(false);

  const getStoredUsername = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("leetcode_username");
  };

  const setStoredUsername = (uname: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("leetcode_username", uname);
    } catch (e) {
      console.warn("Failed to save LeetCode username to localStorage:", e);
    }
  };

  const fetchLeetCodeData = async (uname: string, showAutoSyncIndicator = false) => {
    if (!uname) return;

    try {
      if (showAutoSyncIndicator) {
        setIsAutoSyncing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch(`/api/leetcode/sync?username=${encodeURIComponent(uname)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch LeetCode data`);
      }

      const data = await response.json();
      setLeetcodeData({
        ...data.data,
        isFallback: data.isFallback,
      });
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load LeetCode data";
      setError(errorMessage);
      console.error("LeetCode fetch error:", err);
    } finally {
      setIsLoading(false);
      setIsAutoSyncing(false);
    }
  };

  useEffect(() => {
    const fetchSavedUsername = async () => {
      try {
        const response = await fetch("/api/profile/leetcode");
        const data = await response.json();

        let savedUsername = data.success ? data.leetcodeUsername : null;

        if (!savedUsername) {
          savedUsername = getStoredUsername();
        }

        if (savedUsername) {
          setUsername(savedUsername);
          fetchLeetCodeData(savedUsername, true);
        } else {
          setIsLoading(false);
        }
      } catch {
        const savedUsername = getStoredUsername();
        if (savedUsername) {
          setUsername(savedUsername);
          fetchLeetCodeData(savedUsername, true);
        } else {
          setIsLoading(false);
        }
      }
    };
    fetchSavedUsername();
  }, []);

  const handleSync = async () => {
    if (!username) return;
    setIsSyncing(true);
    setRetryCount((prev) => prev + 1);
    await fetchLeetCodeData(username);
    setIsSyncing(false);
  };

  const handleAutoDetect = async () => {
    try {
      setIsAutoDetecting(true);
      setAutoDetectError(null);
      setSuggestedUsername(null);

      // Use session email directly - no need for extra API call
      const email = session?.user?.email;

      if (!email) {
        setAutoDetectError("No email found. Please sign in with an OAuth provider.");
        return;
      }

      const response = await fetch("/api/leetcode/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoLink: true, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.suggestion) {
          setSuggestedUsername(data.suggestion);
        }
        throw new Error(data.error || "Could not auto-detect LeetCode account");
      }

      // Success! Update state with linked data
      const linkedUsername = (data.data as { user?: { username?: string } })?.user?.username;
      if (linkedUsername) {
        setUsername(linkedUsername);
        setStoredUsername(linkedUsername);
        setLeetcodeData({
          ...(data.data as LeetCodeData),
          isFallback: data.isFallback,
        });
        setError(null);
        setAutoDetectSuccess(true);
        setTimeout(() => setAutoDetectSuccess(false), 3000);
      }
    } catch (err) {
      setAutoDetectError(err instanceof Error ? err.message : "Auto-detection failed");
    } finally {
      setIsAutoDetecting(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!username) {
      setLinkError("Please enter a LeetCode username");
      return;
    }

    try {
      setIsLinking(true);
      setLinkError(null);

      // Use the new link endpoint which validates and saves to database
      const response = await fetch("/api/leetcode/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link LeetCode account");
      }

      // Save username locally as backup
      setStoredUsername(username);

      // Set the data directly from the link response
      if (data.data) {
        setLeetcodeData({
          ...data.data,
          isFallback: data.isFallback,
        });
        setError(null);
      } else {
        // Fallback to fetching data
        await fetchLeetCodeData(username);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to link account";
      setLinkError(errorMessage);
      console.error("LeetCode link error:", err);
    } finally {
      setIsLinking(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Clear the database entry
      await fetch("/api/leetcode/link", { method: "DELETE" });
    } catch (err) {
      console.error("Error unlinking LeetCode account:", err);
    } finally {
      // Always clear local state regardless of API success
      localStorage.removeItem("leetcode_username");
      setUsername("");
      setLeetcodeData(null);
      setLinkError(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = difficultyColors[difficulty as keyof typeof difficultyColors];
    return colors ? colors.text + " " + colors.light : "text-muted-foreground bg-muted";
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper title="LeetCode" subtitle="Loading your LeetCode activity...">
        <div className="flex items-center justify-center py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accentOrange to-red-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative rounded-full bg-gradient-to-br from-accentOrange to-red-500 p-6 shadow-2xl shadow-accentOrange/30">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">Fetching your LeetCode data</p>
              <p className="text-sm text-muted-foreground">This may take a moment...</p>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  // Error state
  if (error && !leetcodeData) {
    return (
      <PageWrapper title="LeetCode" subtitle="Connect your LeetCode account to track your progress">

        {/* Error Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-accentOrange/20 bg-gradient-to-br from-accentOrange/5 via-red-500/5 to-accentOrange/5 p-6"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-accentOrange/10 to-transparent rounded-bl-full" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-accentOrange to-red-500 p-3 shadow-lg shadow-accentOrange/20">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Having trouble connecting?</h3>
              <p className="mt-1 text-muted-foreground">
                {error}. This might be due to LeetCode API rate limits.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentOrange to-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accentOrange/25 transition-all hover:shadow-xl hover:shadow-accentOrange/30 disabled:opacity-50"
                >
                  {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  {retryCount > 0 ? `Retry (${retryCount})` : "Try Again"}
                </motion.button>
                <a
                  href="https://leetcode.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open LeetCode
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Auto-Detect Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-accentOrange to-red-500 p-3 shadow-lg shadow-accentOrange/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Auto-Detect Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We can automatically find your LeetCode account using your login email.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAutoDetect}
              disabled={isAutoDetecting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentOrange to-red-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accentOrange/25 transition-all hover:shadow-xl hover:shadow-accentOrange/30 disabled:opacity-50"
            >
              {isAutoDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isAutoDetecting ? "Detecting..." : "Auto-Detect"}
            </motion.button>
          </div>
          
          {/* Success message */}
          {autoDetectSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-3"
            >
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> LeetCode account auto-detected and linked!
              </p>
            </motion.div>
          )}
          
          {/* Error with suggestion */}
          {autoDetectError && !autoDetectSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-border bg-background/50 p-3"
            >
              <p className="text-sm text-muted-foreground">{autoDetectError}</p>
              {suggestedUsername && (
                <p className="mt-2 text-sm">
                  <span className="text-muted-foreground">Suggested: </span>
                  <button
                    onClick={() => {
                      setUsername(suggestedUsername);
                      setAutoDetectError(null);
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    @{suggestedUsername}
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Connect Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <h3 className="mb-2 text-lg font-semibold text-foreground">Connect LeetCode Account</h3>
          <p className="mb-4 text-sm text-muted-foreground">Enter your LeetCode username manually to link your account</p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Code2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your LeetCode username"
                className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accentOrange/20 focus:border-accentOrange/30"
                onKeyDown={(e) => e.key === "Enter" && handleLinkAccount()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLinkAccount}
              disabled={isLinking}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentOrange to-red-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accentOrange/25 transition-all hover:shadow-xl hover:shadow-accentOrange/30 disabled:opacity-50"
            >
              {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              Connect
            </motion.button>
          </div>
          {linkError && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-destructive">
              {linkError}
            </motion.p>
          )}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { icon: BookOpen, title: "Browse All", desc: "3000+ problems", color: "text-blue-500", bg: "bg-blue-500/10", href: "https://leetcode.com/problemset/" },
            { icon: Zap, title: "Easy", desc: "Start here", color: "text-emerald-500", bg: "bg-emerald-500/10", href: "https://leetcode.com/problemset/?difficulty=EASY" },
            { icon: Brain, title: "Medium", desc: "Level up", color: "text-amber-500", bg: "bg-amber-500/10", href: "https://leetcode.com/problemset/?difficulty=MEDIUM" },
            { icon: Target, title: "Hard", desc: "Challenge", color: "text-rose-500", bg: "bg-rose-500/10", href: "https://leetcode.com/problemset/?difficulty=HARD" },
          ].map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={cn("rounded-xl p-3 transition-transform duration-300 group-hover:scale-110", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
            </motion.a>
          ))}
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Practice by Topic</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 w-52"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topicCategories
              .filter((topic) => topic.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((topic, index) => (
                <motion.a
                  key={topic.name}
                  href={`https://leetcode.com/tag/${topic.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md",
                    topic.borderColor,
                    "bg-card hover:bg-muted/50"
                  )}
                >
                  <div className={cn("rounded-lg p-2 transition-transform duration-300 group-hover:scale-110", topic.bgColor)}>
                    <topic.icon className={cn("h-5 w-5", topic.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{topic.name}</p>
                    <p className="text-xs text-muted-foreground">{topic.problems} problems</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                </motion.a>
              ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 p-6"
        >
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg shadow-blue-500/20">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pro Tips</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Start with Easy problems to build confidence and learn patterns",
                  "Focus on understanding the approach, not just the solution",
                  "Review solutions from others to learn different techniques",
                  "Practice timed mock interviews regularly",
                ].map((tip, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </PageWrapper>
    );
  }

  // No LeetCode account connected
  if (!leetcodeData) {
    return (
      <PageWrapper title="LeetCode" subtitle="Connect your LeetCode account to see your activity">
        <div className="flex items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 text-center max-w-md"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 blur-2xl opacity-30" />
              <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 shadow-2xl shadow-orange-500/30">
                <Code2 className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            <div>
              <h2 className="text-xl font-semibold text-foreground">No LeetCode account connected</h2>
              <p className="mt-2 text-muted-foreground">
                Enter your LeetCode username to track your progress, problem-solving stats, and more.
              </p>
            </div>

            <div className="w-full space-y-4">
              {/* Auto-Detect Card */}
              <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-2.5 shadow-lg shadow-orange-500/20">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Auto-detect from your email</p>
                    <p className="text-xs text-muted-foreground">We'll try to find your LeetCode account automatically</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAutoDetect}
                    disabled={isAutoDetecting}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-md shadow-orange-500/25 transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    {isAutoDetecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Detect
                  </motion.button>
                </div>
                {autoDetectError && (
                  <div className="mt-3 rounded-lg bg-background/50 p-2.5">
                    <p className="text-xs text-muted-foreground">{autoDetectError}</p>
                    {suggestedUsername && (
                      <p className="mt-1 text-xs">
                        <span className="text-muted-foreground">Try: </span>
                        <button
                          onClick={() => {
                            setUsername(suggestedUsername);
                            setAutoDetectError(null);
                          }}
                          className="font-medium text-primary hover:underline"
                        >
                          @{suggestedUsername}
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Input */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <p className="mb-3 text-sm font-medium text-foreground">Or enter username manually</p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Code2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your LeetCode username"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accentOrange/20 focus:border-accentOrange/30"
                      onKeyDown={(e) => e.key === "Enter" && handleLinkAccount()}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLinkAccount}
                    disabled={isLinking}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentOrange to-red-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accentOrange/25 transition-all hover:shadow-xl hover:shadow-accentOrange/30 disabled:opacity-50"
                  >
                    {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    Connect
                  </motion.button>
                </div>
                {linkError && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm text-destructive">
                    {linkError}
                  </motion.p>
                )}
              </div>
            </div>

            <div className="w-full space-y-2">
              <a
                href="https://leetcode.com/problemset/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-all duration-300 hover:border-primary/20 hover:bg-muted/50 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-foreground">Browse Problems</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="https://leetcode.com/problemset/?difficulty=EASY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-all duration-300 hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <Zap className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="font-medium text-foreground">Start with Easy Problems</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  const { user, stats } = leetcodeData;
  const completionPercent = stats.totalQuestions > 0 ? Math.round((stats.totalSolved / stats.totalQuestions) * 100) : 0;

  return (
    <PageWrapper 
      title="LeetCode" 
      subtitle="Your LeetCode activity and progress"
      headerAction={
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 disabled:opacity-50 transition-all duration-200 hover:shadow-sm"
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isSyncing ? "Syncing..." : "Refresh"}
        </motion.button>
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >

      {/* Fallback Warning */}
      {leetcodeData.isFallback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Using limited data
              </p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                LeetCode API may be unavailable. Stats shown are placeholders. Try refreshing later.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Profile Card */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/5 to-transparent rounded-bl-full" />
        <div className="relative flex items-start gap-6">
          {user.profile.userAvatar ? (
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              src={user.profile.userAvatar}
              alt={user.username}
              className="h-20 w-20 rounded-2xl ring-4 ring-border shadow-lg"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-2xl font-bold text-white shadow-lg shadow-orange-500/30">
              {user.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">
                {user.profile.realName || user.username}
              </h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                @{user.username}
              </span>
              <button
                onClick={handleDisconnect}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                title="Disconnect account"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {user.profile.reputation && user.profile.reputation > 0 && (
                <span className="flex items-center gap-1.5">⭐ Reputation: {user.profile.reputation}</span>
              )}
              {user.profile.ranking && user.profile.ranking > 0 && (
                <span className="flex items-center gap-1.5">🏆 Ranking: #{user.profile.ranking.toLocaleString()}</span>
              )}
              <a
                href={`https://leetcode.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                View Profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Solved", value: stats.totalSolved, icon: CheckCircle2, color: "text-emerald-500", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20" },
          { label: "Total Questions", value: stats.totalQuestions, icon: Target, color: "text-blue-500", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20" },
          { label: "Streak", value: stats.streak, suffix: " days", icon: Flame, color: "text-orange-500", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20" },
          { label: "Completion", value: completionPercent, suffix: "%", icon: TrendingUp, color: "text-purple-500", bg: "from-purple-500/10 to-purple-500/5", border: "border-purple-500/20" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -2, scale: 1.02 }}
            className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-300 hover:shadow-md", stat.bg, stat.border)}
          >
            <div className="flex items-center gap-2">
              <div className={cn("rounded-xl p-2 bg-background/50 backdrop-blur-sm", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Difficulty Breakdown */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-foreground">Problem Difficulty</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Easy", solved: stats.easySolved, total: stats.easyTotal, percentage: stats.easyPercentage, colors: difficultyColors.Easy },
            { label: "Medium", solved: stats.mediumSolved, total: stats.mediumTotal, percentage: stats.mediumPercentage, colors: difficultyColors.Medium },
            { label: "Hard", solved: stats.hardSolved, total: stats.hardTotal, percentage: stats.hardPercentage, colors: difficultyColors.Hard },
          ].map((diff, i) => (
            <div key={diff.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-semibold", diff.colors.text)}>{diff.label}</span>
                <span className="text-sm text-muted-foreground">
                  {diff.solved}/{diff.total}
                </span>
              </div>
              <AnimatedProgress
                value={diff.percentage}
                variant="gradient"
                barClassName={cn("bg-gradient-to-r", diff.colors.gradient)}
              />
              <p className="text-xs text-muted-foreground">
                {diff.percentage.toFixed(1)}% faster than others
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="flex gap-2 rounded-xl bg-muted p-1">
        {[
          { id: "stats", label: "Stats", icon: BarChart3 },
          { id: "topics", label: "Topics", icon: Hash },
          { id: "submissions", label: "Recent", icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "topics" && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-semibold text-foreground">Practice by Topic</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {topicCategories.map((topic, index) => (
                <motion.a
                  key={topic.name}
                  href={`https://leetcode.com/tag/${topic.slug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 hover:shadow-md",
                    topic.borderColor,
                    "bg-card hover:bg-muted/50"
                  )}
                >
                  <div className={cn("rounded-lg p-2 transition-transform duration-300 group-hover:scale-110", topic.bgColor)}>
                    <topic.icon className={cn("h-5 w-5", topic.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{topic.name}</p>
                    <p className="text-xs text-muted-foreground">{topic.problems} problems</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "submissions" && (
          <motion.div
            key="submissions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Accepted Solutions</h3>
              <a
                href={`https://leetcode.com/${user.username}/submissions/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            {stats.recentSubmissions.length > 0 ? (
              <div className="space-y-2">
                {stats.recentSubmissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between rounded-xl border border-border p-4 transition-all duration-200 hover:border-emerald-500/20 hover:bg-emerald-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-emerald-500/10 p-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <a
                        href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-primary hover:underline transition-colors"
                      >
                        {submission.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(submission.timestamp).toLocaleDateString()}
                      </div>
                      <a
                        href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        Solve Again
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">No recent submissions</p>
            )}
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Daily Challenge */}
            <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 p-6">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-orange-500/10 blur-xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-2.5 shadow-lg shadow-orange-500/20">
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Daily Challenge</h3>
                  <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-500">
                    New today
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { title: "Two Sum", difficulty: "Easy", slug: "two-sum", time: "15 min" },
                    { title: "Add Two Numbers", difficulty: "Medium", slug: "add-two-numbers", time: "30 min" },
                    { title: "Median of Two Sorted Arrays", difficulty: "Hard", slug: "median-of-two-sorted-arrays", time: "45 min" },
                  ].map((challenge, index) => (
                    <motion.a
                      key={challenge.slug}
                      href={`https://leetcode.com/problems/${challenge.slug}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      className="group flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:shadow-md"
                    >
                      <div>
                        <p className="font-medium text-foreground group-hover:text-orange-500 transition-colors">{challenge.title}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getDifficultyColor(challenge.difficulty))}>
                            {challenge.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            {challenge.time}
                          </span>
                        </div>
                      </div>
                      <Play className="h-4 w-4 text-orange-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Motivation Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 p-6"
            >
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-orange-500/10 blur-xl" />
              <div className="relative flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-4 shadow-lg shadow-orange-500/20"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {stats.totalSolved < 10
                      ? "Just getting started! 🚀"
                      : stats.totalSolved < 50
                      ? "Great progress! 💪"
                      : stats.totalSolved < 100
                      ? "You're on fire! 🔥"
                      : stats.totalSolved < 500
                      ? "Incredible work! ⭐"
                      : "LeetCode Master! 🏆"}
                  </h3>
                  <p className="text-muted-foreground">
                    {stats.totalSolved < 10
                      ? "Solve 10 problems to build momentum!"
                      : stats.totalSolved < 50
                      ? `You've solved ${stats.totalSolved} problems. Keep going!`
                      : stats.totalSolved < 100
                      ? `${stats.totalSolved} problems solved. You're building strong skills!`
                      : `${stats.totalSolved} problems solved. You're a coding champion!`}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
}
