"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import DesktopHeader from "@/components/DesktopHeader";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import DesktopSidebar from "@/components/DesktopSidebar";
import CartSidebar from "@/components/CartSidebar";
import MenuItem from "@/components/MenuItem";
import CartSummaryBar from "@/components/CartSummaryBar";
import { useProducts, useCategories } from "@/features/product/hooks";
import { motion } from "framer-motion";
import { getProductPrice } from "@/features/product/utils";

export default function StorePage() {
  const params = useParams();
  const storeSlug = params["store-slug"] as string;
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("Terpopuler");

  const { data: productsData, isLoading: productsLoading } = useProducts(
    {
      code: search || undefined,
      categoryId: categoryId || undefined,
      limit: "50",
    },
    storeSlug,
  );

  const sortedProducts = useMemo(() => {
    if (!productsData?.product) return [];
    const items = [...productsData.product];
    if (sortBy === "Harga Terendah") {
      return items.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    }
    if (sortBy === "Harga Tertinggi") {
      return items.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }
    return items;
  }, [productsData, sortBy]);

  const { data: categories, isLoading: categoriesLoading } =
    useCategories(storeSlug);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleCategorySelect = useCallback((id: string) => {
    setCategoryId(id);
  }, []);

  const categoryOptions = categories ?? [];

  return (
    <div className="min-h-screen bg-[#F8F9FB] md:bg-white">
      {/* Mobile Header */}
      <div className="md:hidden">
        <Header />
      </div>

      <DesktopHeader onSearch={handleSearch} />

      <main className="max-w-lg md:max-w-7xl mx-auto md:px-6 md:py-8">
        <div className="md:flex md:gap-8">
          {/* Left Sidebar - Desktop only */}
          <div className="hidden md:block">
            <DesktopSidebar
              categories={categoryOptions}
              selected={categoryId}
              onSelect={handleCategorySelect}
              isLoading={categoriesLoading}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white md:bg-transparent min-h-screen md:min-h-0 relative pb-28 md:pb-0">
            {/* Mobile Only: Search & Category */}
            <div className="md:hidden bg-white border-b border-gray-100">
              <SearchBar onSearch={handleSearch} />
              <CategoryFilter
                categories={categoryOptions}
                selected={categoryId}
                onSelect={handleCategorySelect}
                isLoading={categoriesLoading}
              />
            </div>

            {/* Desktop Header Info */}
            <div className="hidden md:flex items-end justify-between mb-8 px-2">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Daftar Menu
                </h2>
                <p className="text-gray-400 font-medium mt-1">
                  Temukan pilihan menu terbaik untuk harimu
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-[13px] font-bold text-blue-600 cursor-pointer"
                >
                  <option>Terpopuler</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Product List */}
            <div className="md:px-2">
              {productsLoading ? (
                // Loading skeleton
                <div className="divide-y md:divide-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex md:flex-col items-center gap-4 px-5 py-4 md:p-3 md:bg-white md:rounded-3xl md:border md:border-gray-50"
                    >
                      <div className="w-20 md:w-full h-20 md:h-40 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
                      <div className="flex-1 md:w-full space-y-2 md:mt-3">
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <motion.div
                  layout
                  className="divide-y md:divide-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
                >
                  {sortedProducts.map((product) => (
                    <MenuItem key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20 px-5 bg-white md:rounded-[40px] md:border md:border-gray-50">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    No products found
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    Try a different search or category
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Desktop only */}
          <div className="hidden md:block">
            <CartSidebar />
          </div>
        </div>
      </main>

      {/* Mobile Cart Summary */}
      <div className="md:hidden">
        <CartSummaryBar />
      </div>
    </div>
  );
}
