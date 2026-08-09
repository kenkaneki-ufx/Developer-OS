"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Code,
  BookOpen,
  Brain,
  Rocket,
  BarChart3,
  Sparkles,
  ArrowRight,
  Github,
  Heart,
  Zap,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { FeatureMockup } from "@/components/feature-mockup";
type FeatureName = "AI-Powered Tasks" | "DSA Tracking" | "ML Roadmaps" | "Project Management" | "Smart Notes" | "Analytics Dashboard";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  shadow: string;
  href: string;
  highlights: string[];
  detailedDescription: string;
}

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI-Powered Tasks",
    description: "Smart task generation and prioritization powered by AI that learns from your habits",
    gradient: "from-purple-500 to-pink-500",
    shadow: "rgba(168,85,247,0.3)",
    href: "/dashboard/ai-chat",
    highlights: ["Auto-generate tasks from goals", "Smart priority scoring", "AI learns your work patterns", "Natural language task creation"],
    detailedDescription: "Let AI handle the planning. Describe what you want to accomplish in plain English, and the AI will break it down into actionable tasks, estimate time, and set priorities based on your past work patterns and deadlines.",
  },
  {
    icon: Code,
    title: "DSA Tracking",
    description: "Track your Data Structures & Algorithms progress with detailed analytics",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "rgba(59,130,246,0.3)",
    href: "/dashboard/dsa",
    highlights: ["150+ curated problems", "Topic-wise progress tracking", "Difficulty breakdown analytics", "Streak tracking & goals"],
    detailedDescription: "Master DSA with structured tracking. Log problems from LeetCode, HackerRank, or any platform. Track your progress across arrays, trees, graphs, DP, and more. Visualize your growth with detailed analytics and maintain your solving streak.",
  },
  {
    icon: Brain,
    title: "ML Roadmaps",
    description: "Structured learning paths for Machine Learning with milestone tracking",
    gradient: "from-green-500 to-emerald-500",
    shadow: "rgba(34,197,94,0.3)",
    href: "/dashboard/documentation",
    highlights: ["Curated learning paths", "Milestone checkpoints", "Resource recommendations", "Progress visualization"],
    detailedDescription: "Follow battle-tested ML roadmaps from beginner to advanced. Each path includes curated resources, hands-on projects, and milestone checkpoints. Track your progress through linear algebra, neural networks, NLP, computer vision, and more.",
  },
  {
    icon: Rocket,
    title: "Project Management",
    description: "Track all your projects in one place with GitHub integration",
    gradient: "from-accentOrange to-red-500",
    shadow: "rgba(249,115,22,0.3)",
    href: "/dashboard/projects",
    highlights: ["GitHub repo linking", "Progress tracking", "Deadline management", "Technology tagging"],
    detailedDescription: "Keep all your projects organized in one dashboard. Link GitHub repos, track progress with visual bars, set deadlines, and tag technologies. Filter and sort projects to see what needs attention. Import/export projects as JSON.",
  },
  {
    icon: BookOpen,
    title: "Smart Notes",
    description: "Markdown notes with AI assistance and smart organization",
    gradient: "from-cyan-500 to-blue-500",
    shadow: "rgba(6,182,212,0.3)",
    href: "/dashboard/documentation",
    highlights: ["Markdown editor", "AI-powered suggestions", "Tag-based organization", "Full-text search"],
    detailedDescription: "Take notes in Markdown with live preview. AI assists with formatting, summaries, and connects related notes. Organize with tags, search across all your notes, and never lose an idea again.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your productivity with beautiful charts and insights",
    gradient: "from-yellow-500 to-accentOrange",
    shadow: "rgba(234,179,8,0.3)",
    href: "/dashboard/analytics",
    highlights: ["Weekly productivity charts", "Goal completion rates", "Time allocation breakdown", "Trend analysis"],
    detailedDescription: "See your productivity at a glance with beautiful charts. Track weekly trends, goal completion rates, time allocation across projects, and get AI-powered insights on how to improve your workflow.",
  },
];



function FloatingParticle({ delay, duration, left, top, size = 1 }: { delay: number; duration: number; left: string; top: string; size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.6, 0],
        y: [0, -80, -150, -200],
        x: [0, 15, -15, 10, -10, 0],
        scale: [0, 1, 1.2, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-full bg-primary/50"
      style={{ left, top, width: size, height: size }}
    />
  );
}



export default function HomePage() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedFeature) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedFeature(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedFeature]);



  const isLoggedIn = mounted && !!session?.user;

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-500 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-blue-500 blur-[150px]"
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[
          { left: "10%", top: "20%", size: 4 },
          { left: "80%", top: "15%", size: 3 },
          { left: "30%", top: "60%", size: 5 },
          { left: "70%", top: "70%", size: 3 },
          { left: "50%", top: "40%", size: 6 },
          { left: "20%", top: "80%", size: 4 },
          { left: "85%", top: "50%", size: 3 },
          { left: "15%", top: "45%", size: 5 },
          { left: "60%", top: "25%", size: 4 },
          { left: "40%", top: "85%", size: 3 },
          { left: "75%", top: "35%", size: 5 },
          { left: "25%", top: "55%", size: 4 },
          { left: "55%", top: "75%", size: 3 },
          { left: "90%", top: "60%", size: 6 },
          { left: "5%", top: "30%", size: 4 },
          { left: "45%", top: "10%", size: 5 },
          { left: "35%", top: "90%", size: 3 },
          { left: "65%", top: "45%", size: 4 },
          { left: "12%", top: "70%", size: 5 },
          { left: "88%", top: "20%", size: 4 },
        ].map((pos, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.6}
            duration={6 + (i % 5) * 2}
            left={pos.left}
            top={pos.top}
            size={pos.size}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-xl" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <span className="text-sm font-bold text-primary-foreground">DO</span>
              </div>
            </div>
            <span className="text-lg font-bold text-foreground">Developer OS</span>
          </motion.div>
          <div className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
            ) : null}
            <Link
              href={isLoggedIn ? "/dashboard" : "/auth/login"}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/20 blur-md rounded-lg transition-all duration-300 group-hover:bg-primary/30" />
              <div className="relative rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all">
                {isLoggedIn ? "Dashboard" : "Sign Up"}
                <ArrowRight className="inline-block ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-32"
      >
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/10 blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 30, -30, 0],
              scale: [1, 0.9, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-[80px]"
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="font-medium">Now in Public Beta</span>
            <ChevronRight className="h-4 w-4" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          >
            The Operating System
            <br />
            for{" "}              <span className="relative inline-block">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-text"
              >
                Developers
              </motion.span>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full"
              />
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl lg:text-2xl"
          >
            Your second brain for everything you study, learn, build, complete,
            review and track. Powered by AI, designed for developers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/auth/login"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300 rounded-xl animate-glow-pulse" />
              <div className="relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/50 hover:scale-[1.03] active:scale-[0.98] overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="relative">Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 text-base font-semibold text-primary transition-all hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>

        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              Features
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              All the tools you need to ace your coding interviews, track your learning, and manage your projects.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12, scale: 1.03, rotateX: 2, rotateY: -2 }}
                onClick={() => setSelectedFeature(feature)}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 cursor-pointer"
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-25 group-hover:scale-110 pointer-events-none`} />
                <div className={`absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-all duration-700 delay-100 group-hover:opacity-15 group-hover:scale-110 pointer-events-none`} />

                <div className="relative">
                  <div
                    className={`mb-6 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 8px 24px -8px ${feature.shadow}` }}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedFeature(null)}
          >            <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${selectedFeature.gradient} p-3 shadow-lg`}>
                    <selectedFeature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{selectedFeature.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Interactive Mockup */}
              <div className="mb-6 aspect-video rounded-xl border border-border/50 overflow-hidden">
                <FeatureMockup feature={selectedFeature.title as FeatureName} gradient={selectedFeature.gradient} />
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{selectedFeature.detailedDescription}</p>

              <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Key Features</h3>
              <ul className="space-y-2.5 mb-6">
                {selectedFeature.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3 pt-2">
                <Link
                  href={selectedFeature.href}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl transition-all"
                >
                  Try it now <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-card/80 to-purple-500/10 p-12 text-center lg:p-20 backdrop-blur-sm"
          >
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/15 blur-[100px]" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                100% Free & Open Source
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Free forever. No catches.
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Developer OS is completely free and open source. No credit card required, no hidden fees, no premium tiers. Everything is available to everyone.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="https://github.com/kenkaneki-ufx/Developer-OS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 rounded-xl" />
                  <div className="relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]">
                    <Github className="h-5 w-5" />
                    View on GitHub
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
                <Link
                  href={isLoggedIn ? "/dashboard" : "/auth/login"}
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-8 text-base font-semibold text-primary transition-all hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-12"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                  <span className="text-sm font-bold text-primary-foreground">DO</span>
                </div>
                <span className="text-lg font-bold text-foreground">Developer OS</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your second brain for everything you study, learn, build, complete, review and track.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2">
                {["Blog", "Community", "Help Center", "API Reference"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2">
                {["About", "Careers", "Privacy", "Terms"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Developer OS. Open source under MIT License.
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by developers, for developers
            </p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
