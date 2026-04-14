import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href}>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-outline-variant mx-1" />
              <Link
                href={item.href}
                className={`ml-1 text-sm font-medium md:ml-2 transition-colors ${
                  index === items.length - 1
                    ? "text-primary cursor-default pointer-events-none"
                    : "text-on-surface-variant hover:text-primary"
                }`}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};
