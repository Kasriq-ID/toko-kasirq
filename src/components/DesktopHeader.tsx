"use client";

import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineUser,
} from "react-icons/hi";
import useCart from "@/hooks/useCart";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreDetails } from "@/features/product/api";

export default function DesktopHeader({
  onSearch,
}: {
  onSearch: (val: string) => void;
}) {
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const params = useParams();
  const storeSlug = params["store-slug"] as string;

  const { data: storeResponse, isLoading } = useQuery({
    queryKey: ["store", storeSlug],
    queryFn: () => fetchStoreDetails(storeSlug),
    enabled: !!storeSlug,
  });

  const store = storeResponse?.data?.Store;

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href={`/${storeSlug}`} className="flex items-center gap-2 group">
          {isLoading ? (
            <div className="h-10 w-40 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl">
                  {store?.name?.charAt(0).toUpperCase() || "K"}
                </span>
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
                {store?.name || "KasirQ.ID"}
              </h1>
            </>
          )}
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <HiOutlineSearch className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Cari menu favoritmu..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-800 placeholder:text-gray-400 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative w-11 h-11 flex items-center justify-center bg-gray-50 rounded-xl text-gray-600 hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all group">
            <HiOutlineShoppingBag className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white">
                {totalItems}
              </span>
            )}
          </button>
          <div className="w-11 h-11 rounded-xl bg-orange-100/50 p-1 group cursor-pointer">
            <div className="w-full h-full rounded-lg bg-orange-100 flex items-center justify-center">
              <HiOutlineUser className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
