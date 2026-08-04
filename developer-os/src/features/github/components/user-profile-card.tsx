"use client";

import { motion } from "framer-motion";
import { Code2, User, Calendar } from "lucide-react";
import type { GitHubUser } from "../types";
import { item } from "../types";

interface UserProfileCardProps {
  user: GitHubUser;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative flex items-start gap-6">
        <img src={user.avatar_url} alt={user.login} className="h-20 w-20 rounded-2xl ring-4 ring-border shadow-lg" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{user.name || user.login}</h2>
            <span className="rounded-lg bg-muted/50 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border/50">@{user.login}</span>
          </div>
          {user.bio && <p className="mt-2 text-muted-foreground/70">{user.bio}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground/70">
            <span className="flex items-center gap-1.5"><Code2 className="h-4 w-4" />{user.public_repos} repositories</span>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{user.followers} followers</span>
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{user.following} following</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
