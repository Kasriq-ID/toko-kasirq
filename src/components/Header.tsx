"use client";

import useCart from "@/hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { HiOutlineMenu } from "react-icons/hi";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchStoreDetails } from "@/features/product/api";

export default function Header() {
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
    <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      {/* Menu Icon */}
      <button
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-all"
        aria-label="Menu"
      >
        <HiOutlineMenu className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="h-7 w-24 bg-gray-100 animate-pulse rounded-lg" />
        ) : (
          <>
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-sm">
                {store?.name?.charAt(0).toUpperCase() || "K"}
              </span>
            </div>
            <h1 className="text-lg font-black text-gray-900 tracking-tighter uppercase">
              {store?.name || "KasirQ.ID"}
            </h1>
          </>
        )}
      </div>

      {/* Cart Icon */}
      <button
        className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 active:scale-95 transition-all"
        aria-label="Cart"
      >
        <HiOutlineShoppingBag className="w-5 h-5 text-blue-600" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-600 rounded-full shadow-lg">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
