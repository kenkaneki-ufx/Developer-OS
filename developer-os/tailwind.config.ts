import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        },
        accentOrange: {
          DEFAULT: "hsl(var(--accent-orange))",
          light: "hsl(var(--accent-orange-light))",
          border: "hsl(var(--accent-orange-border))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spring-in": {
          "0%": { opacity: "0", transform: "scale(0.3) translateY(40px)" },
          "50%": { opacity: "1", transform: "scale(1.05) translateY(-8px)" },
          "70%": { transform: "scale(0.97) translateY(2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsl(var(--primary) / 0.15), 0 0 40px -10px hsl(var(--primary) / 0.05)" },
          "50%": { boxShadow: "0 0 35px -5px hsl(var(--primary) / 0.3), 0 0 60px -10px hsl(var(--primary) / 0.1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(0.8deg)" },
          "66%": { transform: "translateY(4px) rotate(-0.4deg)" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "25%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "50%": { borderRadius: "50% 60% 30% 60% / 30% 40% 70% 60%" },
          "75%": { borderRadius: "60% 30% 60% 40% / 70% 50% 40% 60%" },
        },
        "orbit": {
          from: { transform: "rotate(0deg) translateX(40px) rotate(0deg)" },
          to: { transform: "rotate(360deg) translateX(40px) rotate(-360deg)" },
        },
        "wave": {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.8)" },
        },
        "counter-pop": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "spring-in": "spring-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
        "orbit": "orbit 10s linear infinite",
        "wave": "wave 1.5s ease-in-out infinite",
        "counter-pop": "counter-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-glow": "linear-gradient(135deg, hsl(var(--primary) / 0.1), transparent)",
        shimmer:
          "linear-gradient(90deg, transparent, hsl(var(--muted) / 0.5), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
