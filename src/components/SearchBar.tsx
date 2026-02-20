"use client";

import { useEffect, useState } from "react";
import { DEBOUNCE_DELAY } from "@/const";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="px-4 py-2.5">
      <div className="relative group">
        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
        <input
          type="text"
          placeholder="Cari menu favoritmu..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 rounded-2xl text-[13px] font-medium text-gray-800 placeholder:text-gray-400 transition-all"
        />
      </div>
    </div>
  );
}
