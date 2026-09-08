"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderById, fetchStoreDetails } from "@/features/product/api";
import { formatCurrency } from "@/const";
import {
  HiChevronLeft,
  HiOutlinePrinter,
  HiOutlineCheckCircle,
  HiOutlineChat,
} from "react-icons/hi";
import Link from "next/link";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const storeSlug = params["store-slug"] as string;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });

  const { data: storeResponse } = useQuery({
    queryKey: ["store", storeSlug],
    queryFn: () => fetchStoreDetails(storeSlug),
    enabled: !!storeSlug,
  });

  const order = response?.data?.sales;
  const store = storeResponse?.data?.Store;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-white text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl text-red-500">!</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Order Not Found
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          We couldnt find the order youre looking for.
        </p>
        <Link
          href={`/${storeSlug}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm"
        >
          Back to Store
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-[#F8F9FB] pb-10 print:bg-white print:pb-0">
      {/* Header - Hidden on print */}
      <header className="sticky top-0 z-30 flex items-center h-16 px-5 bg-white border-b border-gray-100 print:hidden">
        <button
          onClick={() => router.push(`/${storeSlug}`)}
          className="p-2 -ml-2 rounded-xl text-blue-600 hover:bg-gray-100"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-800 pr-6">
          Order Details
        </h1>
      </header>

      <div className="p-5 space-y-4 print:p-0">
        {/* Success Alert - Hidden on print */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col items-center text-center print:hidden">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
            <HiOutlineCheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Sukses Membuat Pesanan!
          </h2>
          <div className="mt-4 px-4 py-1.5 bg-gray-50 rounded-full">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              No Pesanan:{" "}
            </span>
            <span className="text-[11px] font-bold text-gray-800">
              {order?.invoice}
            </span>
          </div>
        </div>

        {/* Receipt UI */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          <div className="p-6 border-b border-dashed border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-blue-600 tracking-tight">
                  RECEIPT
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-800">{order?.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {order?.phone}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order?.salePendingDetails?.map((detail) => (
                <div
                  key={detail.id}
                  className="flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      {detail.products?.name ?? detail.itemName ?? "Produk"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {detail.quantity} x {formatCurrency(Number(detail.price))}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {formatCurrency(
                      Number(detail.price) * Number(detail.quantity),
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">
                {formatCurrency(Number(order?.subTotal))}
              </span>
            </div>
            {Number(order?.discount) > 0 && (
              <div className="flex justify-between text-xs text-red-500">
                <span>Discount</span>
                <span className="font-bold">
                  -{formatCurrency(Number(order?.discount))}
                </span>
              </div>
            )}
            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">
                Total Amount
              </span>
              <span className="text-lg font-black text-blue-600">
                {formatCurrency(Number(order?.total || order?.pay))}
              </span>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Payment Method
                </p>
                <p className="text-xs font-bold text-gray-800 capitalize">
                  {order?.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Shipping Address
                </p>
                <p className="text-xs font-bold text-gray-800 max-w-[150px] line-clamp-1">
                  {order?.address}
                </p>
              </div>
            </div>
            {order?.description && (
              <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-50">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  {order.description}
                </p>
              </div>
            )}
          </div>

          {/* Print Footer - Only visible on print */}
          <div className="hidden print:block p-8 text-center bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-blue-600 font-black text-xl text-center">
                {store?.name?.charAt(0) || "K"}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-800">{store?.name}</p>
            <p className="text-[10px] text-gray-400 mt-1 italic">
              Please keep this receipt for your records.
            </p>
          </div>
        </section>

        {/* Action Buttons - Hidden on print */}
        <div className="space-y-3 print:hidden">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-600 text-[13px] font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
            >
              <HiOutlinePrinter className="w-5 h-5 text-gray-400" />
              Print
            </button>
            {store?.phone && (
              <a
                href={(() => {
                  const phone = store.phone.replace(/[^0-9]/g, "");
                  const formattedPhone = phone.startsWith("0")
                    ? "62" + phone.slice(1)
                    : phone;

                  const itemsList = order?.salePendingDetails
                    ?.map(
                      (d) =>
                        `- ${d.products?.name ?? d.itemName ?? "Produk"} (${d.quantity}x) @ ${formatCurrency(Number(d.price))}`,
                    )
                    .join("\n");

                  const message = [
                    `Halo ${store.name},`,
                    `Saya ingin bertanya tentang pesanan saya:`,
                    `*No Pesanan:* ${order?.invoice}`,
                    `*Nama Pelanggan:* ${order?.name}`,
                    `*Daftar Pesanan:*`,
                    itemsList,
                    `*Total:* ${formatCurrency(Number(order?.total || order?.pay))}`,
                  ].join("\n");

                  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
                })()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 bg-green-500 text-white text-[13px] font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/10"
              >
                <HiOutlineChat className="w-5 h-5" />
                Chat Toko
              </a>
            )}
          </div>
          <Link
            href={`/${storeSlug}`}
            className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 w-full"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  );
}
