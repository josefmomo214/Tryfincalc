'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import { searchIndex } from '@/lib/searchIndex';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'description', weight: 0.3 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

export default function SearchBar({ className, isLarge = false }: { className?: string, isLarge?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const searchResults = fuse.search(query).slice(0, 6);
    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selected = results[activeIndex].item;
        handleSelect(selected.url);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSelect = (url: string) => {
    router.push(url);
    setQuery('');
    setIsOpen(false);
  };

  const categoryColors: Record<string, string> = {
    'Calculators': '#0D4B3F',
    'Mortgage Guides': '#185FA5',
    'Home Buying': '#3B6D11',
    'Loan Guides': '#854F0B',
    'Refinancing': '#993556',
    'European Guides': '#534AB7',
    'Guides': '#5F5E5A',
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full", isLarge ? "max-w-3xl" : "max-w-[400px]", className)}
    >
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
          <Search size={isLarge ? 20 : 16} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLarge ? "Search for a specific calculator or guide..." : "Search... ⌘K"}
          aria-label="Search TryFinCalc"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          className={cn(
            "w-full rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/10",
            isLarge ? "py-4 pl-12 pr-4 text-lg" : "py-2 pl-10 pr-10 text-sm"
          )}
        />
        {query && (
          <button 
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full mt-2 left-0 right-0 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {results.map((result, index) => (
            <div
              key={result.item.url}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => handleSelect(result.item.url)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "px-4 py-3 cursor-pointer flex items-center justify-between gap-4 transition-colors",
                index === activeIndex ? "bg-primary/5" : "hover:bg-surface-container-low",
                index < results.length - 1 && "border-b border-outline-variant/10"
              )}
            >
              <div className="flex-1 min-width-0">
                <div className="text-sm font-semibold text-on-surface mb-0.5 truncate">
                  {result.item.title}
                </div>
                <div className="text-xs text-on-surface-variant truncate opacity-80">
                  {result.item.description}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  style={{ 
                    backgroundColor: `${categoryColors[result.item.category] || '#5F5E5A'}15`,
                    color: categoryColors[result.item.category] || '#5F5E5A'
                  }}
                >
                  {result.item.category}
                </span>
                {index === activeIndex && (
                  <CornerDownLeft size={14} className="text-primary animate-pulse" />
                )}
              </div>
            </div>
          ))}

          <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
            <div className="text-[10px] text-on-surface-variant/60 flex gap-3 uppercase font-bold tracking-widest">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div className="text-[10px] text-primary/60 font-bold uppercase tracking-widest cursor-pointer hover:text-primary transition-colors" onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}>
              View All Results
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
