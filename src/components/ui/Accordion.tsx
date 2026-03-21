import * as React from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div 
      className={cn(
        "transition-colors duration-200 ease-in-out border-b border-outline-variant/20 last:border-0",
        isOpen ? "bg-surface-container-low rounded-xl border-none my-2" : "bg-transparent"
      )}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 px-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
        aria-expanded={isOpen}
      >
        <span className="font-manrope text-lg font-medium text-on-surface">{question}</span>
        {isOpen ? (
          <Minus className="h-5 w-5 text-primary shrink-0 ml-4" />
        ) : (
          <Plus className="h-5 w-5 text-primary shrink-0 ml-4" />
        )}
      </button>
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 px-4 pb-5" : "grid-rows-[0fr] opacity-0 px-4"
        )}
      >
        <div className="overflow-hidden text-on-surface-variant leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: { question: string; answer: string | React.ReactNode }[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
