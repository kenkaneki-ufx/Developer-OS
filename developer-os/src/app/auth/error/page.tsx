"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw, HelpCircle, Mail } from "lucide-react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string; icon: string }> = {
    Configuration: {
      title: "Server Configuration Error",
      description: "There's a problem with the server configuration. Please contact support.",
      icon: "⚙️",
    },
    AccessDenied: {
      title: "Access Denied",
      description: "You don't have permission to sign in. Please contact your administrator.",
      icon: "🔒",
    },
    Verification: {
      title: "Verification Failed",
      description: "The verification link may have expired or already been used. Please try signing in again.",
      icon: "📧",
    },
    OAuthSignin: {
      title: "OAuth Sign-in Error",
      description: "An error occurred while starting the sign-in process. Please try again.",
      icon: "🔐",
    },
    OAuthCallback: {
      title: "OAuth Callback Error",
      description: "An error occurred while handling the sign-in callback. Please try again.",
      icon: "🔄",
    },
    OAuthCreateAccount: {
      title: "Account Creation Failed",
      description: "Could not create an account with the provided credentials. Please try again.",
      icon: "👤",
    },
    EmailCreateAccount: {
      title: "Email Account Failed",
      description: "Could not create an email account. Please try again.",
      icon: "📧",
    },
    Callback: {
      title: "Callback Error",
      description: "An error occurred in the authentication callback. Please try again.",
      icon: "⚠️",
    },
    OAuthAccountNotLinked: {
      title: "Account Already Linked",
      description: "This account is already linked with another provider. Please use the original provider to sign in.",
      icon: "🔗",
    },
    Default: {
      title: "Authentication Error",
      description: "An unexpected error occurred during authentication. Please try again.",
      icon: "❌",
    },
  };

  const errorInfo = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[500px] w-[500px] rounded-full bg-destructive/5 blur-[120px]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg"
      >
        {/* Error Card */}
        <div className="rounded-3xl border border-border bg-card p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-destructive/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/10 border border-destructive/20">
                <span className="text-4xl">{errorInfo.icon}</span>
              </div>
            </div>
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-3 text-center text-2xl font-bold text-foreground"
          >
            {errorInfo.title}
          </motion.h1>

          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6 text-center text-muted-foreground"
          >
            {errorInfo.description}
          </motion.p>

          {/* Error Code */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mb-6 rounded-xl border border-border bg-muted/50 p-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Error code: <code className="font-mono font-medium text-foreground">{error}</code></span>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-col gap-3"
          >
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-6 rounded-2xl border border-border bg-card/50 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need help?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                If this error persists, please contact our support team. We're here to help you get back on track.
              </p>
              <a
                href="mailto:support@developeros.com"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          Developer OS • Your second brain for developers
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}