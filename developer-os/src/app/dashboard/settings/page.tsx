"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import {
  User,
  Palette,
  Bell,
  Save,
  Calendar,
  Sun,
  Moon,
  Mail,
  Github,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Image,
  Link as LinkIcon,
  Code2,
  ExternalLink,
  Link2,
  Monitor,
  Check,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyScheduleEditor } from "@/features/schedule/components";
import { useSchedule } from "@/features/schedule/hooks/use-schedule";
import { useTheme } from "@/components/providers/theme-provider";
import type { WeeklySchedule } from "@/features/schedule/types";
import { PageWrapper } from "@/components/ui/page-wrapper";

type SettingsSection = "profile" | "appearance" | "schedule" | "notifications" | "accounts";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function getProviderInfo(provider?: string) {
  switch (provider) {
    case "github":
      return { name: "GitHub", icon: Github, color: "bg-zinc-800" };
    case "google":
      return { name: "Google", icon: GoogleIcon, color: "bg-blue-500" };
    default:
      return { name: "Demo", icon: User, color: "bg-muted" };
  }
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors duration-300",
        enabled ? "bg-primary" : "bg-muted border border-border"
      )}
    >
      <motion.div
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
        animate={{ left: enabled ? 22 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [saved, setSaved] = useState(false);
  const { schedule, saveSchedule } = useSchedule();
  const { theme, setTheme, compact, setCompact } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState<string | null>(null);
  const [isSyncingFromProvider, setIsSyncingFromProvider] = useState(false);
  const [isLinkingLeetcode, setIsLinkingLeetcode] = useState(false);
  const [leetcodeLinkError, setLeetcodeLinkError] = useState<string | null>(null);
  const [leetcodeLinkSuccess, setLeetcodeLinkSuccess] = useState(false);
  const [leetcodeManualUsername, setLeetcodeManualUsername] = useState("");
  const [showLeetcodeManualInput, setShowLeetcodeManualInput] = useState(false);

  useEffect(() => {
    const fetchLeetcodeUsername = async () => {
      try {
        const response = await fetch("/api/profile/leetcode");
        const data = await response.json();
        if (data.success && data.leetcodeUsername) {
          setLeetcodeUsername(data.leetcodeUsername);
        }
      } catch {
        // Ignore errors
      }
    };
    fetchLeetcodeUsername();
  }, []);

  const loginProvider = session?.user?.loginProvider;
  const providerInfo = getProviderInfo(loginProvider);

  // Track whether we've initialized profile fields from session
  const hasInitializedRef = useRef(false);
  const googleAutoSyncDoneRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Populate profile fields from session on initial load
  useEffect(() => {
    if (session?.user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setProfileName(session.user.name || "");
      setProfileEmail(session.user.email || "");
      setProfileImage(session.user.image || "");
      setImageError(false);
    }
  }, [session]);

  // Auto-save profile after Google OAuth redirect (detects first Google login)
  useEffect(() => {
    if (
      session?.user?.loginProvider === "google" &&
      hasInitializedRef.current &&
      !googleAutoSyncDoneRef.current
    ) {
      googleAutoSyncDoneRef.current = true;
      const name = session.user.name || "";
      const email = session.user.email || "";
      const image = session.user.image || "";

      if (name || image) {
        setProfileName(name);
        setProfileImage(image);
        // Auto-save the profile to persist Google data
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, image }),
        })
          .then(() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          })
          .catch((err) => {
            console.error("Auto-save after Google connect failed:", err);
          });
      }
    }
  }, [session]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          image: profileImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncFromProvider = async () => {
    if (!session?.user || !loginProvider) return;

    try {
      setIsSyncingFromProvider(true);
      setProfileName(session.user.name || "");
      setProfileEmail(session.user.email || "");
      setProfileImage(session.user.image || "");
      setImageError(false);

      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || "",
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error syncing from provider:", err);
    } finally {
      setIsSyncingFromProvider(false);
    }
  };

  const sections: { value: SettingsSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "profile", label: "Profile", icon: User },
    { value: "accounts", label: "Linked Accounts", icon: Link2 },
    { value: "appearance", label: "Appearance", icon: Palette },
    { value: "schedule", label: "Weekly Schedule", icon: Calendar },
    { value: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleAutoLinkLeetcode = async () => {
    const email = session?.user?.email;
    if (!email) {
      setLeetcodeLinkError("No email found. Please sign in with an OAuth provider.");
      return;
    }

    try {
      setIsLinkingLeetcode(true);
      setLeetcodeLinkError(null);
      setLeetcodeLinkSuccess(false);

      const response = await fetch("/api/leetcode/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoLink: true, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.suggestion) {
          setLeetcodeManualUsername(data.suggestion);
          setShowLeetcodeManualInput(true);
        }
        throw new Error(data.error || "Failed to auto-detect LeetCode account");
      }

      // Success!
      setLeetcodeUsername(data.data?.user?.username || null);
      setLeetcodeLinkSuccess(true);
      setShowLeetcodeManualInput(false);
      setTimeout(() => setLeetcodeLinkSuccess(false), 3000);
    } catch (err) {
      setLeetcodeLinkError(err instanceof Error ? err.message : "Failed to link account");
    } finally {
      setIsLinkingLeetcode(false);
    }
  };

  const handleManualLinkLeetcode = async () => {
    if (!leetcodeManualUsername) {
      setLeetcodeLinkError("Please enter a LeetCode username");
      return;
    }

    try {
      setIsLinkingLeetcode(true);
      setLeetcodeLinkError(null);
      setLeetcodeLinkSuccess(false);

      const response = await fetch("/api/leetcode/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeManualUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to link LeetCode account");
      }

      // Success!
      setLeetcodeUsername(data.data?.user?.username || leetcodeManualUsername);
      setLeetcodeLinkSuccess(true);
      setShowLeetcodeManualInput(false);
      setLeetcodeManualUsername("");
      setTimeout(() => setLeetcodeLinkSuccess(false), 3000);
    } catch (err) {
      setLeetcodeLinkError(err instanceof Error ? err.message : "Failed to link account");
    } finally {
      setIsLinkingLeetcode(false);
    }
  };

  const handleSaveSchedule = (newSchedule: WeeklySchedule) => {
    saveSchedule(newSchedule);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageWrapper
      title="Settings"
      subtitle="Manage your account and preferences"
      headerAction={
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm font-medium text-green-600"
            >
              <Save className="h-4 w-4" /> Saved successfully!
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 rounded-2xl border border-border bg-card p-2 shadow-sm">
            {sections.map((section) => (
              <button
                key={section.value}
                onClick={() => setActiveSection(section.value)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  activeSection === section.value
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your account information</p>
              </div>

              {/* Profile Image & Account Info */}
              <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6 shadow-sm">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-border bg-muted flex items-center justify-center">
                      {profileImage && !imageError ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                          <span className="text-2xl font-bold text-primary">
                            {profileName?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 border-card shadow-sm", providerInfo.color)}>
                        <providerInfo.icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{session?.user?.name || "User"}</h3>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", loginProvider ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" : "bg-muted text-muted-foreground border border-border")}>
                        {loginProvider ? `Logged in via ${providerInfo.name}` : "Demo Mode"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{session?.user?.email || "No email connected"}</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {loginProvider 
                        ? `Email synced from ${providerInfo.name} account` 
                        : "Sign in with Google or GitHub to sync your profile"
                      }
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        <span>
                          {loginProvider 
                            ? `Profile synced from ${providerInfo.name}` 
                            : "Demo mode - no OAuth provider"
                          }
                        </span>
                      </div>
                      {!loginProvider ? (
                        <button
                          onClick={() => signIn("google", { callbackUrl: "/dashboard/settings" })}
                          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
                        >
                          <GoogleIcon className="h-3 w-3" />
                          Connect Google
                        </button>
                      ) : (
                        <button
                          onClick={handleSyncFromProvider}
                          disabled={isSyncingFromProvider}
                          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                        >
                          {isSyncingFromProvider ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Sync from {providerInfo.name}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all duration-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 focus:outline-none"
                    placeholder="Enter your name"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">This is how you'll appear to others</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-sm transition-all duration-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">Used for notifications and account recovery</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Profile Image</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Image className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="url"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-sm transition-all duration-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/10 focus:outline-none"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    {profileImage && (
                      <img
                        src={profileImage}
                        alt="Preview"
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">Image URL from Google/GitHub or custom image</p>
                </div>
              </div>

              {/* Connected Accounts */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Connected Accounts</h3>
                <div className="space-y-2">
                  <div className={cn(
                    "flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-200 shadow-sm",
                    loginProvider === "github" 
                      ? "border-green-500/50 bg-green-500/5" 
                      : "border-border hover:bg-muted/50"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        loginProvider === "github" ? "bg-zinc-800" : "bg-muted"
                      )}>
                        <Github className={cn("h-5 w-5", loginProvider === "github" ? "text-white" : "text-foreground")} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">GitHub</p>
                          {loginProvider === "github" && (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                              Active Login
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session?.user?.githubUsername 
                            ? `@${session.user.githubUsername}` 
                            : "Not connected"
                          }
                        </p>
                      </div>
                    </div>
                    {session?.user?.githubUsername ? (
                      <div className="flex items-center gap-2">
                        {loginProvider === "github" && session?.user?.image && (
                          <img 
                            src={session.user.image} 
                            alt="GitHub" 
                            className="h-6 w-6 rounded-full" 
                          />
                        )}
                        <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not linked</span>
                    )}
                  </div>

                  <div className={cn(
                    "flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-200 shadow-sm",
                    loginProvider === "google" 
                      ? "border-green-500/50 bg-green-500/5" 
                      : "border-border hover:bg-muted/50"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        loginProvider === "google" ? "bg-white border" : "bg-muted"
                      )}>
                        <GoogleIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">Google</p>
                          {loginProvider === "google" && (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                              Active Login
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session?.user?.email || "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {loginProvider === "google" && session?.user?.image && (
                        <img 
                          src={session.user.image} 
                          alt="Google" 
                          className="h-6 w-6 rounded-full" 
                        />
                      )}
                      <span className="flex items-center gap-1 text-xs font-medium text-green-500">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-muted/30 p-4 border border-border/50 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">About OAuth Sync</p>
                      <p>
                        Your profile (name, email, image) is automatically synced from your {providerInfo.name} account. 
                        To update your profile, re-login with {providerInfo.name} or edit the fields above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeSection === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Theme Selection - Visual Cards */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Theme</h2>
                  <p className="text-sm text-muted-foreground mt-1">Select your preferred color scheme</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {([
                    { value: "light" as const, label: "Light", icon: Sun, desc: "Clean & bright", colors: "from-amber-100 via-white to-violet-50", ring: "ring-amber-400", iconColor: "text-amber-500" },
                    { value: "dark" as const, label: "Dark", icon: Moon, desc: "Easy on the eyes", colors: "from-slate-800 via-slate-900 to-indigo-950", ring: "ring-indigo-500", iconColor: "text-indigo-400" },
                    { value: "system" as const, label: "System", icon: Monitor, desc: "Match device", colors: "from-slate-200 via-slate-500 to-slate-800", ring: "ring-slate-500", iconColor: "text-slate-600 dark:text-slate-300" },
                  ]).map((option) => {
                    const isActive = mounted && theme === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const root = document.documentElement;
                          root.classList.add("theme-transition");
                          setTheme(option.value);
                          setTimeout(() => root.classList.remove("theme-transition"), 400);
                        }}
                        className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 ${
                          isActive
                            ? `border-primary shadow-lg shadow-primary/10 bg-primary/5 ${option.ring}`
                            : "border-border hover:border-border/80 bg-background hover:shadow-md"
                        }`}
                      >
                        {/* Preview thumbnail */}
                        <div className={`flex h-16 w-full items-center justify-center rounded-xl bg-gradient-to-br ${option.colors} shadow-inner`}>  
                          <option.icon className={`h-6 w-6 ${option.iconColor} drop-shadow`} />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>{option.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="theme-active-badge"
                            className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/25"
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Layout & Density */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Layout & Density</h2>
                  <p className="text-sm text-muted-foreground mt-1">Adjust spacing and content density</p>
                </div>
                <div className="space-y-3">
                  {/* Compact Mode */}
                  <div className="group flex items-center justify-between rounded-2xl border border-border p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 bg-gradient-to-r from-transparent to-primary/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-indigo-500/15 transition-all duration-300 group-hover:from-violet-500/25 group-hover:to-indigo-500/25">
                        <LayoutGrid className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Compact Mode</p>
                        <p className="text-sm text-muted-foreground">Reduce spacing and padding throughout the app for a denser layout</p>
                      </div>
                    </div>
                    <Toggle
                      enabled={compact}
                      onToggle={() => setCompact(!compact)}
                    />
                  </div>


                </div>
              </div>

              {/* Appearance Preview */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                  <p className="text-sm text-muted-foreground mt-1">See how your current settings look</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Mini window preview */}
                  <div className={cn(
                    "rounded-xl border overflow-hidden transition-all duration-500",
                    mounted && theme === "dark" 
                      ? "border-white/10 bg-gradient-to-br from-slate-800 to-slate-900" 
                      : "border-black/5 bg-gradient-to-br from-white to-slate-50"
                  )}>
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 border-b",
                      mounted && theme === "dark" 
                        ? "border-white/10 bg-slate-800/50" 
                        : "border-black/5 bg-slate-100/50"
                    )}>
                      <div className="h-2 w-2 rounded-full bg-red-400" />
                      <div className="h-2 w-2 rounded-full bg-amber-400" />
                      <div className="h-2 w-2 rounded-full bg-green-400" />
                      <div className={cn(
                        "ml-2 h-1.5 flex-1 rounded-full",
                        mounted && theme === "dark" ? "bg-white/10" : "bg-black/5"
                      )} />
                    </div>
                    <div className={cn("p-3", compact ? "space-y-1.5" : "space-y-2.5")}>
                      <div className={cn("h-2 rounded-full bg-primary/40", compact ? "w-2/3" : "w-3/4")} />
                      <div className={cn("h-1.5 rounded-full", mounted && theme === "dark" ? "bg-white/15" : "bg-black/10", compact ? "w-1/2" : "w-1/2")} />
                      <div className={cn("h-1.5 rounded-full", mounted && theme === "dark" ? "bg-white/10" : "bg-black/5", compact ? "w-2/5" : "w-2/3")} />
                    </div>
                  </div>
                  {/* Mini sidebar preview */}
                  <div className={cn(
                    "rounded-xl border overflow-hidden transition-all duration-500",
                    mounted && theme === "dark" 
                      ? "border-white/10 bg-gradient-to-br from-slate-800 to-slate-900" 
                      : "border-black/5 bg-gradient-to-br from-slate-50 to-white"
                  )}>
                    <div className={cn(
                      "flex items-center gap-2 px-3 border-b",
                      mounted && theme === "dark" 
                        ? "border-white/10 bg-indigo-950/30" 
                        : "border-black/5 bg-primary/5",
                      compact ? "py-1.5" : "py-2.5"
                    )}>
                      <div className="h-4 w-4 rounded-md bg-gradient-to-br from-primary to-primary/80" />
                      <div className={cn("h-1.5 rounded-full bg-primary/30", compact ? "w-12" : "w-16")} />
                    </div>
                    <div className={cn("p-2", compact ? "space-y-0.5" : "space-y-1")}>
                      {["bg-primary/20", "", "", ""].map((bg, i) => (
                        <div key={i} className={cn("flex items-center gap-2", compact ? "py-1 px-2" : "py-1.5 px-2")}>
                          <div className={cn(
                            "h-3 w-3 rounded",
                            bg || (mounted && theme === "dark" ? "bg-white/10" : "bg-black/5")
                          )} />
                          <div className={cn(
                            "h-1.5 rounded-full",
                            bg ? "bg-primary/20 w-14" : (mounted && theme === "dark" ? "bg-white/10 w-12" : "bg-black/5 w-12")
                          )} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Current settings indicator */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {mounted && theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                    {theme === "system" ? "System" : mounted && theme === "dark" ? "Dark" : "Light"}
                  </span>
                  <span className="h-3 w-px bg-border" />
                  <span className="flex items-center gap-1.5">
                    <LayoutGrid className="h-3 w-3" />
                    {compact ? "Compact" : "Default"} spacing
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "schedule" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground">Weekly Schedule</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Set up your repeating weekly schedule. This schedule repeats every week but can be edited anytime.
                </p>
              </div>
              <WeeklyScheduleEditor
                schedule={schedule}
                onSave={handleSaveSchedule}
              />
            </div>
          )}

          {activeSection === "accounts" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-6 shadow-sm"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground">Linked Accounts</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage your connected accounts, sync data, and control what's linked</p>
              </div>

              {/* Connection Status Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className={cn(
                  "rounded-2xl border p-4 text-center transition-all duration-200 shadow-sm",
                  loginProvider === "google" 
                    ? "border-green-500/50 bg-green-500/5" 
                    : "border-border hover:border-primary/20"
                )}>
                  <div className="flex justify-center mb-2">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      loginProvider === "google" ? "bg-white border shadow-sm" : "bg-muted"
                    )}>
                      <GoogleIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Google</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {loginProvider === "google" ? "Active Login" : "Connected"}
                  </p>
                </div>

                <div className={cn(
                  "rounded-2xl border p-4 text-center transition-all duration-200 shadow-sm",
                  session?.user?.githubUsername 
                    ? "border-green-500/50 bg-green-500/5" 
                    : "border-border hover:border-primary/20"
                )}>
                  <div className="flex justify-center mb-2">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      session?.user?.githubUsername ? "bg-zinc-800" : "bg-muted"
                    )}>
                      <Github className={cn("h-5 w-5", session?.user?.githubUsername ? "text-white" : "text-foreground")} />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">GitHub</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session?.user?.githubUsername ? `@${session.user.githubUsername}` : "Not linked"}
                  </p>
                </div>

                <div className={cn(
                  "rounded-2xl border p-4 text-center transition-all duration-200 shadow-sm",
                  leetcodeUsername 
                    ? "border-green-500/50 bg-green-500/5" 
                    : "border-border hover:border-primary/20"
                )}>
                  <div className="flex justify-center mb-2">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      leetcodeUsername ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-muted"
                    )}>
                      <Code2 className={cn("h-5 w-5", leetcodeUsername ? "text-white" : "text-foreground")} />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-foreground">LeetCode</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {leetcodeUsername ? `@${leetcodeUsername}` : "Not linked"}
                  </p>
                </div>
              </div>

              {/* Google Account */}
              <div className="rounded-2xl border border-border p-5 transition-all duration-200 hover:border-primary/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border shadow-sm">
                      <GoogleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">Google Account</h3>
                        {loginProvider === "google" && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                            Active Login
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{session?.user?.email || "Not connected"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session?.user?.image && (
                      <img src={session.user.image} alt="Google" className="h-8 w-8 rounded-full ring-2 ring-border" />
                    )}
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                      <CheckCircle2 className="h-4 w-4" /> Connected
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="https://myaccount.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Manage Account <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    Profile data synced automatically
                  </div>
                </div>
              </div>

              {/* GitHub Account */}
              <div className="rounded-2xl border border-border p-5 transition-all duration-200 hover:border-primary/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800">
                      <Github className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">GitHub Account</h3>
                        {loginProvider === "github" && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                            Active Login
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session?.user?.githubUsername 
                          ? `@${session.user.githubUsername}` 
                          : "Auto-syncs with your Google email"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session?.user?.githubUsername ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                        <CheckCircle2 className="h-4 w-4" /> Linked
                      </span>
                    ) : (
                      <a
                        href="/dashboard/github"
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
                      >
                        <Link2 className="h-4 w-4" /> Link Account
                      </a>
                    )}
                  </div>
                </div>
                {session?.user?.githubUsername && (
                  <div className="mt-4 flex items-center gap-4">
                    <a
                      href={`https://github.com/${session.user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View Profile <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="/dashboard/github"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Sync Data
                    </a>
                  </div>
                )}
              </div>

              {/* LeetCode Account */}
              <div className="rounded-2xl border border-border p-5 transition-all duration-200 hover:border-primary/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accentOrange to-red-500">
                      <Code2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">LeetCode Account</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {leetcodeUsername 
                          ? `@${leetcodeUsername}` 
                          : "Track your problem-solving progress"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {leetcodeUsername ? (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                        <CheckCircle2 className="h-4 w-4" /> Connected
                      </span>
                    ) : (
                      <button
                        onClick={handleAutoLinkLeetcode}
                        disabled={isLinkingLeetcode}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50"
                      >
                        {isLinkingLeetcode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )} 
                        {isLinkingLeetcode ? "Detecting..." : "Link Account"}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Auto-link status messages */}
                {leetcodeLinkError && !showLeetcodeManualInput && (
                  <div className="mt-4 rounded-xl border border-accentOrange/20 bg-accentOrange/5 p-4">
                    <p className="text-sm text-accentOrange">{leetcodeLinkError}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => setShowLeetcodeManualInput(true)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        Enter username manually
                      </button>
                      <span className="text-xs text-muted-foreground">or</span>
                      <button
                        onClick={handleAutoLinkLeetcode}
                        disabled={isLinkingLeetcode}
                        className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" /> Try again
                      </button>
                    </div>
                  </div>
                )}
                
                {leetcodeLinkSuccess && (
                  <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> LeetCode account linked successfully!
                    </p>
                  </div>
                )}
                
                {/* Manual username input */}
                {showLeetcodeManualInput && !leetcodeUsername && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Code2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={leetcodeManualUsername}
                          onChange={(e) => setLeetcodeManualUsername(e.target.value)}
                          placeholder="Enter LeetCode username"
                          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-accentOrange/20 focus:border-accentOrange/30"
                          onKeyDown={(e) => e.key === "Enter" && handleManualLinkLeetcode()}
                        />
                      </div>
                      <button
                        onClick={handleManualLinkLeetcode}
                        disabled={isLinkingLeetcode || !leetcodeManualUsername}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accentOrange to-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accentOrange/25 transition-all hover:shadow-xl hover:shadow-accentOrange/30 disabled:opacity-50"
                      >
                        {isLinkingLeetcode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link2 className="h-4 w-4" />
                        )}
                        Link
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowLeetcodeManualInput(false);
                        setLeetcodeLinkError(null);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {leetcodeUsername && (
                  <div className="mt-4 flex items-center gap-4">
                    <a
                      href={`https://leetcode.com/${leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      View Profile <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="/dashboard/leetcode"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Sync Data
                    </a>
                  </div>
                )}
              </div>

              {/* Auto-Sync Info */}
              <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-500/20 p-2.5">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Auto-Sync Enabled</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Your accounts are automatically synced when you sign in. When you sign in with Google, we find and link your GitHub account using the same email (if public on GitHub). 
                      Profile data (name, email, image) syncs from your login provider. LeetCode requires manual linking via username.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <div className="space-y-3">
                {["Task Deadlines", "Daily Goals", "Weekly Reviews", "Streak Alerts"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-border p-5 transition-all duration-200 hover:border-primary/20 shadow-sm">
                    <p className="font-semibold text-foreground">{item}</p>
                    <Toggle enabled={true} onToggle={() => {}} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
