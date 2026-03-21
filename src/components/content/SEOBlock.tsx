import React from "react";
import { cn } from "@/lib/utils";

interface SEOBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function SEOBlock({ children, className }: SEOBlockProps) {
  return (
    <div className={cn("w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8", className)}>
      <div className="prose prose-lg prose-teal max-w-none text-on-surface-variant leading-relaxed">
        {/*
          Global typography rules applied via classes where needed,
          but semantic HTML tags inside this block should look good naturally.
        */}
        {children}
      </div>
    </div>
  );
}
