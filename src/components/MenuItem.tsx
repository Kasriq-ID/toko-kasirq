"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/const";
import useCart from "@/hooks/useCart";
import { useShallow } from "zustand/react/shallow";
import type { Product } from "@/type/product";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { getProductPrice } from "@/features/product/utils";
import { getInitials } from "@/utils/string";

interface MenuItemProps {
  product: Product;
}

export default function MenuItem({ product }: MenuItemProps) {
  const { addItem, removeItem, updateQuantity } = useCart(
    useShallow((s) => ({
      addItem: s.addItem,
      removeItem: s.removeItem,
      updateQuantity: s.updateQuantity,
    })),
  );

  const items = useCart((s) => s.items);
  const quantity =
    items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const price = getProductPrice(product);

  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setInputValue(val);
      if (val !== "") {
        updateQuantity(product.id, parseInt(val, 10));
      }
    }
  };

  const handleBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) === 0) {
      removeItem(product.id);
    }
  };

  const handleAdd = () => {
    const conversion =
      product.productConversions.find((c) => c.status === 1) ||
      product.productConversions[0];
    if (conversion) {
      addItem(product, conversion);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${process.env.NEXT_PUBLIC_API_BASE || "https://api.kasirq.id"}/images/products/${product.image}`
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex md:flex-col items-center md:items-stretch gap-4 md:gap-0 p-3 md:p-3 bg-white md:rounded-3xl border-b md:border border-gray-100 last:border-b-0 md:last:border-b hover:shadow-xl md:hover:shadow-blue-500/5 transition-all group"
    >
      {/* Product Image */}
      <div className="relative w-20 md:w-full h-20 md:h-40 rounded-2xl md:rounded-2xl overflow-hidden bg-gray-50 shrink-0 md:mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 80px, 200px"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-blue-50 text-blue-600 font-black text-xl md:text-2xl tracking-tighter">
            {getInitials(product.name)}
          </div>
        )}
        {/* Category Tag (Desktop only) */}
        <div className="hidden md:block absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded-lg shadow-sm">
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">
            {product.categories?.name}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 md:flex md:flex-col pr-2">
        <h3 className="text-sm md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 md:h-10">
          {product.name}
        </h3>
        <div className="flex md:flex-col md:items-start items-center justify-between mt-1 md:mt-2">
          <p className="text-sm md:text-sm font-black text-blue-600">
            {formatCurrency(price)}
          </p>
          {product.code && (
            <p className="hidden md:block text-[10px] text-gray-400 mt-0.5 truncate uppercase tracking-widest font-bold">
              #{product.code}
            </p>
          )}
        </div>
      </div>

      {/* Add / Quantity Controls */}
      <div className="shrink-0 md:mt-4">
        <AnimatePresence mode="wait">
          {quantity > 0 ? (
            <motion.div
              key="controls"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center justify-between bg-gray-50 p-1 rounded-xl gap-1 md:gap-2"
            >
              <button
                onClick={handleRemove}
                className="w-8 md:w-7 h-8 md:h-7 flex items-center justify-center rounded-lg bg-white border border-gray-100 md:border-gray-200 text-blue-600 md:text-gray-400 hover:bg-red-50 hover:text-red-500 active:scale-95 transition-all shadow-sm"
                aria-label="Decrease quantity"
              >
                <HiMinus className="w-3 h-3 md:w-3.5 md:h-3.5" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-8 md:w-8 text-center text-xs md:text-sm font-black text-gray-800 bg-transparent border-none focus:ring-0 p-0"
              />
              <button
                onClick={handleAdd}
                className="w-8 md:w-9 h-8 md:h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
                aria-label="Increase quantity"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="add"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="px-4 md:px-0 md:w-full py-2.5 md:py-3 bg-blue-600 md:bg-blue-50/50 text-white md:text-blue-600 text-[11px] md:text-sm font-black uppercase tracking-wider rounded-xl md:rounded-2xl hover:bg-blue-700 md:hover:bg-blue-600 md:hover:text-white active:scale-95 transition-all shadow-lg shadow-blue-500/20 md:shadow-none border border-transparent"
            >
              <span className="hidden md:inline text-xs">
                Tambah ke Keranjang
              </span>
              <span className="md:hidden">Tambah</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
