import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface AdPlaceholderProps {
  className?: string;
  format?: "horizontal" | "rectangle" | "vertical" | "mobile-sticky";
  label?: string;
}

export function AdPlaceholder({ className, format = "horizontal", label = "Recommended for you" }: AdPlaceholderProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;
  
  if (format === "mobile-sticky") {
    return (
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface-container-high/95 backdrop-blur-md border-t border-outline-variant/30 flex flex-col items-center py-3 shadow-[0_-8px_20px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-bottom-full duration-500", className)}>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 p-1.5 rounded-full bg-primary/5 text-primary/40 hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none"
          aria-label="Close advertisement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] text-primary/40 uppercase tracking-[0.2em] mb-2 font-manrope font-bold">{label}</span>
        <div className="w-[320px] h-[50px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10 flex items-center justify-center text-primary/30 text-[11px] font-semibold tracking-wide overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
          <span>320 × 50 MOBILE AD UNIT</span>
        </div>
      </div>
    );
  }

  const formats = {
    horizontal: {
      container: "w-full max-w-[728px]",
      inner: "w-full h-[90px] md:h-[100px]",
      label: "728 × 90 LEADERBOARD"
    },
    rectangle: {
      container: "w-full max-w-[300px]",
      inner: "w-[300px] h-[250px]",
      label: "300 × 250 RECTANGLE"
    },
    vertical: {
      container: "w-full max-w-[160px]",
      inner: "w-[160px] h-[600px]",
      label: "160 × 600 SKYSCRAPER"
    },
    "mobile-sticky": { container: "", inner: "", label: "" },
  };

  const currentFormat = formats[format];

  return (
    <div className={cn("flex flex-col items-center justify-center my-6 group", currentFormat.container, className)}>
      <span className="text-[10px] text-primary/40 uppercase tracking-[0.2em] mb-4 font-manrope font-bold text-center w-full">
        {label}
      </span>
      <div 
        className={cn(
          "bg-gradient-to-br from-surface-container-low to-surface-container-high rounded-3xl flex items-center justify-center border border-outline-variant/20 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:border-primary/20 relative overflow-hidden",
          currentFormat.inner
        )}
      >
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
        
        <div className="text-center z-10">
          <p className="text-primary/30 font-manrope font-extrabold text-sm tracking-tight">{currentFormat.label}</p>
          <p className="text-[10px] text-primary/20 uppercase tracking-widest mt-1.5 font-bold">Premium Responsive Unit</p>
        </div>
        
        {/* AdSense Slot container - exact sizing reserved */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
          {/* Real AdSense code would be injected here */}
        </div>
      </div>
    </div>
  );
}
