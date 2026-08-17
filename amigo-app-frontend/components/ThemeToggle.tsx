"use client";

import { useTheme } from "@/lib/theme/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`h-10 w-10 rounded-full border border-teal-900/10 dark:border-slate-800 bg-transparent ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Current: ${theme} theme. Click to switch.`}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-teal-900/10 dark:border-slate-800 text-slate-650 dark:text-slate-300 transition-all duration-200 hover:bg-mist dark:hover:bg-slate-800/80 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none ${className}`}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4.5 w-4.5 text-teal-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const options: { value: "light" | "dark" | "system"; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-teal-900/10 dark:border-slate-800 bg-mist dark:bg-slate-900/80 p-1">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-sm"
                : "text-slate-650 dark:text-slate-400 hover:text-ink dark:hover:text-slate-200"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
