"use client";

import { cn } from "@/utils/cn";
import type { CategoryOption } from "@/type/product";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: CategoryOption[];
  selected: string;
  onSelect: (categoryId: string) => void;
  isLoading?: boolean;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  isLoading,
}: CategoryFilterProps) {
  const allCategories: CategoryOption[] = [
    { value: "", label: "Semua Menu" },
    ...categories,
  ];

  if (isLoading) {
    return (
      <div className="flex gap-2 px-5 py-2 overflow-x-auto scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 w-20 bg-gray-100 rounded-full animate-pulse shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-4 pb-3 pt-1 overflow-x-auto scrollbar-hide items-center">
      {allCategories.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <motion.button
            key={cat.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.value)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 shrink-0",
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-gray-900",
            )}
          >
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}
