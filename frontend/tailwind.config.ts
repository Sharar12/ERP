// File Location: frontend/tailwind.config.ts
// Purpose: Tailwind CSS Configuration (Colors, Fonts, Breakpoints, Animations)

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
        warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Cascadia Code", "Roboto Mono", "monospace"],
      },
      keyframes: {
        "fade-in":         { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up":         { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-down":       { from: { opacity: "0", transform: "translateY(-8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in":        { from: { opacity: "0", transform: "scale(0.96)" }, to: { opacity: "1", transform: "scale(1)" } },
        "slide-in-right":  { from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        "slide-in-left":   { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "slide-in-bottom": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "shimmer":         { "100%": { transform: "translateX(100%)" } },
        "pulse-dot":       { "0%,100%": { opacity: "1", transform: "scale(1)" }, "50%": { opacity: ".55", transform: "scale(1.35)" } },
        "float":           { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-3px)" } },
      },
      animation: {
        "fade-in":         "fade-in .2s ease-out",
        "fade-up":         "fade-up .3s cubic-bezier(.16,1,.3,1) both",
        "fade-down":       "fade-down .2s ease-out",
        "scale-in":        "scale-in .2s cubic-bezier(.16,1,.3,1)",
        "slide-in-right":  "slide-in-right .25s cubic-bezier(.16,1,.3,1)",
        "slide-in-left":   "slide-in-left .25s cubic-bezier(.16,1,.3,1)",
        "slide-in-bottom": "slide-in-bottom .3s cubic-bezier(.16,1,.3,1)",
        "shimmer":         "shimmer 1.6s infinite",
        "pulse-dot":       "pulse-dot 2s ease-in-out infinite",
        "float":           "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

