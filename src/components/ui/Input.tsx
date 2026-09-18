import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, min = 0, max = 1e12, step = "any", "aria-invalid": ariaInvalid, "aria-describedby": describedBy, ...props }, ref) => {
    const isNumeric = type === "number";
    
    const invalid = isNumeric && typeof value === "number" && (!Number.isFinite(value) || value < Number(min) || value > Number(max));
    const errorId = React.useId();
    return (
      <>
      <input
        type={type}
        value={typeof value === "number" && !Number.isFinite(value) ? "" : value}
        min={isNumeric ? min : undefined}
        max={isNumeric ? max : undefined}
        step={isNumeric ? step : undefined}
        aria-invalid={invalid || ariaInvalid}
        aria-describedby={[describedBy, invalid ? errorId : null].filter(Boolean).join(" ") || undefined}
        inputMode={isNumeric ? "decimal" : props.inputMode}
        className={cn(
          "flex h-12 w-full rounded-md border border-outline-variant/50 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-on-surface-variant/70",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {invalid && <span id={errorId} className="block text-sm text-red-700 dark:text-red-300">Enter a number between {min} and {max}.</span>}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
