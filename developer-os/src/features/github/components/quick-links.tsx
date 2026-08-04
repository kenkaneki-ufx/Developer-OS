"use client";

import { motion } from "framer-motion";
import { Github, User, ExternalLink } from "lucide-react";
import { item } from "../types";

export function QuickLinks() {
  return (
    <motion.div variants={item} className="rounded-2xl border border-border/50 bg-muted/20 p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href="https://github.com/settings/connections/applications" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl bg-background p-4 text-sm transition-all duration-200 hover:bg-muted/60 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <Github className="h-5 w-5 text-foreground" />
            <div><p className="font-medium text-foreground">GitHub Settings</p><p className="text-xs text-muted-foreground/60">Manage connected apps</p></div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground/40" />
        </a>
        <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl bg-background p-4 text-sm transition-all duration-200 hover:bg-muted/60 hover:shadow-sm">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground/60" />
            <div><p className="font-medium text-foreground">Create Account</p><p className="text-xs text-muted-foreground/60">New to GitHub?</p></div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground/40" />
        </a>
      </div>
    </motion.div>
  );
}
