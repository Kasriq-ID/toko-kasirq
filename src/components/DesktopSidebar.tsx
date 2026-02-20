"use client";

import { cn } from "@/utils/cn";
import type { CategoryOption } from "@/type/product";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { HiOutlineLightningBolt } from "react-icons/hi";
import type { IconType } from "react-icons";

interface DesktopSidebarProps {
  categories: CategoryOption[];
  selected: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

const CATEGORY_ICONS: Record<string, IconType> = {
  default: HiOutlineLightningBolt,
};

export default function DesktopSidebar({
  categories,
  selected,
  onSelect,
  isLoading,
}: DesktopSidebarProps) {
  const allCategories = [
    { value: "", label: "Semua Menu", icon: HiOutlineSquares2X2 },
    ...categories.map((cat) => ({
      ...cat,
      icon: CATEGORY_ICONS[cat.label] || CATEGORY_ICONS.default,
    })),
  ];

  return (
    <aside className="w-64 shrink-0 space-y-8 sticky top-24 h-fit">
      <div>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">
          Categories
        </h2>
        <div className="space-y-1">
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-12 w-full bg-gray-50 animate-pulse rounded-2xl"
                  />
                ))
            : allCategories.map((cat) => {
                const isActive = selected === cat.value;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => onSelect(cat.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                      isActive
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-blue-600",
                      )}
                    />
                    <span className="text-[13px] font-bold tracking-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
        </div>
      </div>

      {/* Promo Card */}
      <div className="bg-blue-50/50 rounded-[32px] p-6 border border-blue-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
        <div className="relative z-10">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
            Promo Hari Ini
          </p>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Diskon <span className="text-blue-600 font-bold">20%</span> untuk
            semua varian Kopi Susu.
          </p>
          <button className="mt-4 w-full py-2.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            Lihat Detail
          </button>
        </div>
      </div>
    </aside>
  );
}
