import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/10 text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-surface-container shadow-sm overflow-hidden group",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-500 transform",
            theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-5 w-5 transition-all duration-500 transform",
            theme === "light" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )} 
        />
      </div>
      <span className="sr-only">Switch to {theme === "light" ? "dark" : "light"} mode</span>
    </button>
  );
}
