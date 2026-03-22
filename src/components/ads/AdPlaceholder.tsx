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
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden bg-transparent flex flex-col items-center pointer-events-none", className)}>
        <div className="w-[320px] h-[50px] bg-transparent pointer-events-auto" />
      </div>
    );
  }

  const formats = {
    horizontal: {
      container: "w-full max-w-[728px]",
      inner: "w-full min-h-[90px] md:min-h-[100px]",
    },
    rectangle: {
      container: "w-full max-w-[300px]",
      inner: "w-[300px] min-h-[250px]",
    },
    vertical: {
      container: "w-full max-w-[160px]",
      inner: "w-[160px] min-h-[600px]",
    },
    "mobile-sticky": { container: "", inner: "" },
  };

  const currentFormat = formats[format];

  return (
    <div className={cn("flex flex-col items-center justify-center my-6", currentFormat.container, className)}>
      <div className={cn("bg-transparent w-full flex items-center justify-center", currentFormat.inner)}>
        {/* AdSense Slot container - exact sizing reserved to prevent layout shift */}
      </div>
    </div>
  );
}
