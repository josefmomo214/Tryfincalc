import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-gradient-to-br from-primary to-primary-container text-[#FFFFFF] hover:from-primary-container hover:to-[#005a5a] shadow-ambient rounded-3xl", // Stitch specs: xl (1.5rem / 24px - rounded-3xl)
      secondary: "bg-transparent text-primary pb-1 border-b-2 border-primary-fixed-dim hover:border-primary-fixed hover:-translate-y-0.5 rounded-none",
      outline: "border border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low",
      ghost: "bg-transparent text-on-surface hover:bg-surface-container-low",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
      xl: "h-14 px-10 text-lg rounded-[24px]", // For primary hero buttons
    };

    // If secondary, don't use standard height, let it be natural for text with underline
    const finalSizeClass = variant === "secondary" ? "text-lg pt-2" : sizes[size];

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], finalSizeClass, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
