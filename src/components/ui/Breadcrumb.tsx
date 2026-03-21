import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href: string }[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-on-surface-variant ${className}`} aria-label="Breadcrumb">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-outline-variant" />
          {index === items.length - 1 ? (
            <span className="font-semibold text-primary truncate max-w-[200px]" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="hover:text-primary transition-colors truncate max-w-[150px]">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
