"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Link2, Loader2 } from "lucide-react";
import { item } from "../types";

interface LinkAccountFormProps {
  sessionEmail: string | null;
  onLink: (email: string) => Promise<void>;
}

export function LinkAccountForm({ sessionEmail, onLink }: LinkAccountFormProps) {
  const [email, setEmail] = useState(sessionEmail || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionEmail) setEmail(sessionEmail);
  }, [sessionEmail]);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter an email address");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      await onLink(email);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to link account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div variants={item} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Link GitHub Account</h3>
      <p className="mb-4 text-sm text-muted-foreground/70">Enter the email associated with your GitHub account to automatically sync your profile.</p>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your GitHub email"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all duration-200">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />} Link Account
        </motion.button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </motion.div>
  );
}
