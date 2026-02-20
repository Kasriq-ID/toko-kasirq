"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/const";
import useCart from "@/hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { HiChevronRight } from "react-icons/hi";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CartSummaryBar() {
  const params = useParams();
  const storeSlug = params["store-slug"];
  const items = useCart((s) => s.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3 pointer-events-none"
        >
          <div className="max-w-lg mx-auto pointer-events-auto">
            <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl shadow-blue-500/30">
              {/* Left: Cart info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-sm">
                  <HiOutlineShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {totalItems} Items in Cart
                  </p>
                  <p className="text-xs text-blue-200">
                    {formatCurrency(totalPrice)} total price
                  </p>
                </div>
              </div>

              {/* Right: Checkout button */}
              <Link
                href={`/${storeSlug}/checkout`}
                className="flex items-center gap-1 px-5 py-2.5 bg-white text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-lg pointer-events-auto"
              >
                Checkout
                <HiChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
