import React from "react";
import { cn } from "@/lib/utils";
import { 
  Home, 
  TrendingUp, 
  Calculator, 
  Wallet, 
  Briefcase, 
  PieChart, 
  Gem,
  BookOpen
} from "lucide-react";

interface BlogThumbnailProps {
  category: string;
  title?: string;
  className?: string;
  isFeatured?: boolean;
}

const categoryMap: Record<string, { icon: React.ReactNode; color: string }> = {
  "Mortgages": { 
    icon: <Home className="w-1/3 h-1/3" />, 
    color: "from-blue-500/20 to-teal-500/20" 
  },
  "Mortgage Guides": { 
    icon: <Home className="w-1/3 h-1/3" />, 
    color: "from-blue-600/20 to-indigo-500/20" 
  },
  "Investing": { 
    icon: <TrendingUp className="w-1/3 h-1/3" />, 
    color: "from-emerald-500/20 to-teal-500/20" 
  },
  "Real Estate": { 
    icon: <PieChart className="w-1/3 h-1/3" />, 
    color: "from-indigo-500/20 to-blue-500/20" 
  },
  "Home Loans": { 
    icon: <Calculator className="w-1/3 h-1/3" />, 
    color: "from-cyan-500/20 to-blue-600/20" 
  },
  "Loan Guides": { 
    icon: <Calculator className="w-1/3 h-1/3" />, 
    color: "from-blue-500/20 to-cyan-500/20" 
  },
  "Financial Planning": { 
    icon: <Wallet className="w-1/3 h-1/3" />, 
    color: "from-teal-500/20 to-emerald-600/20" 
  },
  "Debt Management": { 
    icon: <Briefcase className="w-1/3 h-1/3" />, 
    color: "from-slate-500/20 to-blue-500/20" 
  },
  "Personal Finance": { 
    icon: <Gem className="w-1/3 h-1/3" />, 
    color: "from-purple-500/20 to-indigo-500/20" 
  },
  "Affordability": { 
    icon: <PieChart className="w-1/3 h-1/3" />, 
    color: "from-amber-500/20 to-orange-500/20" 
  },
  "Refinance": { 
    icon: <TrendingUp className="w-1/3 h-1/3" />, 
    color: "from-lime-500/20 to-emerald-500/20" 
  },
  "Home Buying": { 
    icon: <BookOpen className="w-1/3 h-1/3" />, 
    color: "from-rose-500/20 to-pink-500/20" 
  }
};

export function BlogThumbnail({ category, className, isFeatured = false }: BlogThumbnailProps) {
  const config = categoryMap[category] || { 
    icon: <BookOpen className="w-1/3 h-1/3" />, 
    color: "from-slate-400/20 to-slate-600/20" 
  };

  return (
    <div className={cn(
      "relative w-full overflow-hidden flex items-center justify-center bg-gradient-to-br transition-all duration-500",
      config.color,
      isFeatured ? "min-h-[400px]" : "aspect-[16/9]",
      className
    )}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-primary blur-3xl" />
      </div>

      {/* Main Visual */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-primary transition-transform duration-500 group-hover:scale-110">
        <div className={cn(
          "flex items-center justify-center rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md shadow-sm border border-white/20",
          isFeatured ? "w-24 h-24" : "w-16 h-16"
        )}>
          {React.isValidElement(config.icon) && React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, { 
            className: cn(
              (config.icon as React.ReactElement<{ className?: string }>).props.className,
              "text-primary"
            ) 
          })}
        </div>
        <span className={cn(
          "font-manrope font-bold uppercase tracking-widest opacity-60",
          isFeatured ? "text-sm" : "text-[10px]"
        )}>
          {category}
        </span>
      </div>

      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
