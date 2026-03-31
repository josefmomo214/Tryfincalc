'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import { searchIndex } from '@/lib/searchIndex';
import { X, CornerDownLeft, Search } from 'lucide-react';
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

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const searchResults = fuse.search(query).slice(0, 8);
    setResults(searchResults);
    setActiveIndex(-1);
  }, [query]);

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
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  if (!isOpen) return null;

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
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-[9999] flex flex-col items-center pt-20 px-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-2xl relative animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30">
          <div className="relative group p-1 border-b border-outline-variant/10">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
              <Search size={22} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search articles and calculators..."
              className="w-full py-5 pl-14 pr-6 text-xl bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className={cn("max-h-[60vh] overflow-y-auto transition-all", results.length === 0 && query.length > 0 ? "h-32" : "")}>
            {results.length > 0 ? (
              results.map((result, index) => (
                <div
                  key={result.item.url}
                  onClick={() => handleSelect(result.item.url)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "px-6 py-4 cursor-pointer flex items-center justify-between gap-4 transition-colors",
                    index === activeIndex ? "bg-primary/5" : "hover:bg-surface-container-low",
                    index < results.length - 1 && "border-b border-outline-variant/10"
                  )}
                >
                  <div className="flex-1 min-width-0">
                    <div className="text-base font-semibold text-on-surface mb-0.5 truncate">
                      {result.item.title}
                    </div>
                    <div className="text-sm text-on-surface-variant truncate opacity-80">
                      {result.item.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span 
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${categoryColors[result.item.category] || '#5F5E5A'}15`,
                        color: categoryColors[result.item.category] || '#5F5E5A'
                      }}
                    >
                      {result.item.category}
                    </span>
                    {index === activeIndex && (
                      <CornerDownLeft size={16} className="text-primary animate-pulse" />
                    )}
                  </div>
                </div>
              ))
            ) : query.length >= 2 ? (
              <div className="p-10 text-center text-on-surface-variant/60 italic">
                No matches found for "{query}"
              </div>
            ) : (
              <div className="p-10 text-center text-on-surface-variant/30 flex flex-col items-center gap-3">
                <Search size={32} strokeWidth={1} />
                <span className="text-sm">Start typing to see results...</span>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between">
            <div className="text-[10px] text-on-surface-variant/60 flex gap-4 uppercase font-bold tracking-widest">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
