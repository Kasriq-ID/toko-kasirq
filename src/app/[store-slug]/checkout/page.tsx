"use client";
// Type-safe checkout page

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import { HiChevronLeft, HiOutlineCash } from "react-icons/hi";
import useCart from "@/hooks/useCart";
import { useShallow } from "zustand/react/shallow";
import { formatCurrency } from "@/const";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/features/product/api";
import { CheckoutPayload } from "@/type/product";
import { AxiosError } from "axios";
import Swal from "sweetalert2";

const checkoutSchema = z.object({
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  description: z.string().optional(),
  paymentMethod: z.enum(["cashier", "wallet"]),
  name: z.string().min(1, "Nama minimal 1 karakter"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params["store-slug"] as string;
  const { items, clearCart } = useCart(
    useShallow((s) => ({
      items: s.items,
      clearCart: s.clearCart,
    })),
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + tax + serviceCharge;

  const mutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (response) => {
      Swal.fire({
        title: "Berhasil!",
        text: "Pesanan Anda telah berhasil dikirim.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
      clearCart();
      const orderId = response.data as string;
      console.log(orderId);

      if (orderId) {
        router.push(`/${storeSlug}/order/${orderId}`);
      } else {
        router.push(`/${storeSlug}`);
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      Swal.fire({
        title: "Gagal!",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengirim pesanan.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cashier",
      description: "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  const onSubmit = (data: CheckoutFormValues) => {
    const detailItem: CheckoutPayload["detailItem"] = {};
    items.forEach((item) => {
      detailItem[item.product.id] = {
        quantity: item.quantity,
        unitId: item.selectedConversion.id,
        price: item.price,
      };
    });

    const payload = {
      slug: storeSlug,
      subTotal: subtotal,
      discount: 0,
      tax,
      total,
      additionalCost: serviceCharge,
      pay: total,
      description: data.description,
      detailItem,
      phone: data.phone,
      address: data.address,
      name: data.name,
      paymentMethod: data.paymentMethod,
    };

    mutation.mutate({ payload, slug: storeSlug });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-white">
        <p className="text-gray-500 mb-4">Keranjang belanja kosong</p>
        <Link
          href={`/${storeSlug}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
        >
          Kembali Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-[#F8F9FB] pb-10">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center h-16 px-5 bg-white border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-xl text-blue-600 hover:bg-gray-100"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-800 pr-6">
          Checkout
        </h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4 px-5">
        {/* Customer Information */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-sm font-bold text-gray-800 mb-4">
            Customer Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Nama
              </label>
              <input
                {...register("name")}
                placeholder="Eko"
                className={cn(
                  "w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all",
                  errors.name
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-400",
                )}
              />
              {errors.name && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Phone Number (No. HP)
              </label>
              <input
                {...register("phone")}
                placeholder="081234567890"
                className={cn(
                  "w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all",
                  errors.phone
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-400",
                )}
              />
              {errors.phone && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Address (Alamat)
              </label>
              <textarea
                {...register("address")}
                placeholder="Jl. Sudirman No. 12345, Pekanbaru"
                rows={3}
                className={cn(
                  "w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none",
                  errors.address
                    ? "border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-100 focus:border-blue-400",
                )}
              />
              {errors.address && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Description (Catatan)
              </label>
              <textarea
                {...register("description")}
                placeholder="Tambah ekstra pedas, dll..."
                rows={2}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-sm font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  {item.product.image ? (
                    <Image
                      src={
                        item.product.image.startsWith("http")
                          ? item.product.image
                          : `${process.env.NEXT_PUBLIC_API_BASE || "https://api.kasirq.id"}/images/products/${item.product.image}`
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <HiOutlinePhotograph className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-1">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Billing Details */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-sm font-bold text-gray-800 mb-3">
            Billing Details
          </h2>
          <div className="text-xs">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className="text-base font-bold text-blue-600">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
              Total hanya mencakup total produk. Belum termasuk PPN, diskon, atau
              biaya lainnya jika ada.
            </p>
          </div>
        </section>

        {/* Payment Method */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h2 className="text-sm font-bold text-gray-800 mb-4">
            Payment Method
          </h2>
          <div className="space-y-3">
            <label
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all",
                selectedPayment === "cashier"
                  ? "border-blue-500 bg-blue-50/30"
                  : "border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 flex items-center justify-center rounded-xl",
                    selectedPayment === "cashier"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-400",
                  )}
                >
                  <HiOutlineCash className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-gray-700">
                  Pay at Cashier
                </span>
              </div>
              <input
                type="radio"
                {...register("paymentMethod")}
                value="cashier"
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </label>
          </div>
        </section>

        {/* Place Order Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className={cn(
              "w-full py-4 bg-blue-600 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20",
              mutation.isPending
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700",
            )}
          >
            {mutation.isPending
              ? "Processing..."
              : `Place Order • ${formatCurrency(total)}`}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-3 px-10">
            Order will be processed immediately once you click place order
            button.
          </p>
        </div>
      </form>
    </div>
  );
}
