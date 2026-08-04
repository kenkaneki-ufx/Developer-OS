"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Mail,
  Lock,
  Loader2,
  Zap,
  Github,
  Sparkles,
  Code2,
  CheckCircle2,
  Eye,
  EyeOff,
  Brain,
  Rocket,
  ArrowRight,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 800,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError("Please enter email and password");
      return;
    }
    setIsLoading("demo");
    setFormError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setFormError("Login failed. Please try again.");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setFormError("An error occurred. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Tasks",
      description: "Smart task generation and prioritization",
      gradient: "from-purple-500 to-pink-500",
      shadow: "rgba(168,85,247,0.3)",
    },
    {
      icon: Code2,
      title: "DSA Tracking",
      description: "Track your coding interview preparation",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "rgba(59,130,246,0.3)",
    },
    {
      icon: Brain,
      title: "ML Roadmaps",
      description: "Structured learning paths for ML",
      gradient: "from-green-500 to-emerald-500",
      shadow: "rgba(34,197,94,0.3)",
    },
    {
      icon: Rocket,
      title: "Project Management",
      description: "Track all your projects in one place",
      gradient: "from-accentOrange to-red-500",
      shadow: "rgba(249,115,22,0.3)",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Floating Particles Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            style={{ width: particle.size, height: particle.size, left: particle.x, top: particle.y }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              y: [0, -200 - Math.random() * 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Mouse Follower Glow */}
      <motion.div
        className="pointer-events-none fixed h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]"
        style={{ x: smoothX, y: smoothY }}
      />

      {/* Left side - Branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md"
        >
          {/* Logo */}
          <motion.div
            className="mb-10 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-xl font-bold text-primary-foreground">DO</span>
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Developer OS</h1>
              <p className="text-sm text-muted-foreground">Your second brain</p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="mb-5 text-4xl font-bold leading-tight text-foreground">
              Supercharge your{" "}
              <span className="gradient-text">developer workflow</span>
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              Everything you study, learn, build, and track — all in one place.
              Powered by AI, designed for developers.
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/50 cursor-pointer"
              >
                <motion.div
                  className={`rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 shadow-lg`}
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ boxShadow: `0 8px 24px -8px ${feature.shadow}` }}
                >
                  <feature.icon className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{feature.description}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25">
              <span className="text-2xl font-bold text-primary-foreground">DO</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Developer OS</h1>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to access your Developer OS
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-primary/5"
          >
            {/* Error Messages */}
            {(error || formError) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500"
              >
                {formError || "An error occurred during authentication"}
              </motion.div>
            )}

            {/* Demo Login Form */}
            <form onSubmit={handleDemoLogin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demo@developeros.com"
                    className="w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none border-border"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Any password works in demo mode"
                    className="w-full rounded-xl border bg-background py-3 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:scale-[1.01] focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <motion.button
                type="submit"
                disabled={isLoading === "demo"}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-4 py-3 text-sm font-semibold text-primary-foreground transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading === "demo" ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 180 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <Zap className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {isLoading === "demo" ? "Signing in..." : "Sign in to Demo"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 border-t border-border" />
              <span className="text-xs font-medium text-muted-foreground">
                or continue with
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={() => {
                  setIsLoading("google");
                  signIn("google", { callbackUrl });
                }}
                disabled={isLoading !== null}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading === "google" ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Continue with Google</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  setIsLoading("github");
                  signIn("github", { callbackUrl });
                }}
                disabled={isLoading !== null}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-gray-500/30 hover:bg-gray-500/5 hover:shadow-lg hover:shadow-gray-500/10 active:scale-[0.98] disabled:opacity-50"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading === "github" ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Github className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="group-hover:translate-x-0.5 transition-transform duration-300">Continue with GitHub</span>
              </motion.button>
            </div>

            {/* Demo Mode Notice */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-primary/5 to-primary/[0.03] border border-primary/10 px-4 py-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Demo Mode</p>
                  <p className="mt-1 leading-relaxed">
                    Enter any email and password to sign in. No account needed! Your GitHub data will sync automatically if connected.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="font-medium text-foreground hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-foreground hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
