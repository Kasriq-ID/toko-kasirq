"use client";

import { useState, useEffect } from "react";
import useCart from "@/hooks/useCart";
import { formatCurrency } from "@/const";
import Image from "next/image";
import { HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function QuantityInput({
  productId,
  initialQuantity,
  onUpdate,
  onRemove,
}: {
  productId: string;
  initialQuantity: number;
  onUpdate: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}) {
  const [val, setVal] = useState(initialQuantity.toString());

  useEffect(() => {
    setVal(initialQuantity.toString());
  }, [initialQuantity]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === "" || /^\d+$/.test(v)) {
      setVal(v);
      if (v !== "") {
        onUpdate(productId, parseInt(v, 10));
      }
    }
  };

  const onBlur = () => {
    if (val === "" || parseInt(val, 10) === 0) {
      onRemove(productId);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
      <button
        onClick={() => onUpdate(productId, initialQuantity - 1)}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
      >
        <HiMinus className="w-2.5 h-2.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={val}
        onChange={onChange}
        onBlur={onBlur}
        className="w-7 text-center text-[10px] font-black text-gray-800 bg-transparent border-none focus:ring-0 p-0"
      />
      <button
        onClick={() => onUpdate(productId, initialQuantity + 1)}
        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
      >
        <HiPlus className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}

export default function CartSidebar() {
  const { items, updateQuantity, removeItem } = useCart();
  const params = useParams();
  const router = useRouter();
  const storeSlug = params["store-slug"];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    router.push(`/${storeSlug}/checkout`);
  };

  if (totalItems === 0) {
    return (
      <aside className="w-80 shrink-0 sticky top-24 h-fit">
        <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineTrash className="w-8 h-8 text-gray-200" />
          </div>
          <p className="text-gray-400 text-sm font-bold">Belum ada pesanan</p>
          <p className="text-gray-300 text-[11px] mt-1">
            Pilih menu untuk memulai pesanan Anda
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 sticky top-24 h-fit">
      <div className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-xl shadow-gray-200/20 max-h-[calc(100vh-120px)] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-800 tracking-tight">
            Pesanan Saya
          </h2>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider">
            {totalItems} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide mb-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.product.image ? (
                    <Image
                      src={
                        item.product.image.startsWith("http")
                          ? item.product.image
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kasirq.id"}/images/products/${item.product.image}`
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <HiOutlineTrash className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {item.product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <QuantityInput
                      productId={item.product.id}
                      initialQuantity={item.quantity}
                      onUpdate={updateQuantity}
                      onRemove={removeItem}
                    />
                    <span className="text-[10px] text-gray-400 font-medium">
                      @ {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-black text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pt-6 border-t border-dashed border-gray-100 space-y-3">
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Subtotal</span>
            <span className="text-gray-600">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            <span>Pajak (10%)</span>
            <span className="text-gray-600">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-black text-gray-800 uppercase tracking-widest">
              Total
            </span>
            <span className="text-lg font-black text-blue-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-8 w-full py-4 bg-blue-600 text-white text-[13px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all"
        >
          Konfirmasi Pesanan
        </button>
      </div>
    </aside>
  );
}
