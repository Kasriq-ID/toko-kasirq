export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kasirq.id/stores-api";

export const ENDPOINTS = {
  PRODUCTS_SELL: "/products/sell",
  CATEGORIES: "/categories",
  CATEGORIES_SELECT: "/categories/select",
  ORDER_PLACE: "/sale-pending",
  ORDER_DETAIL: "/sale-pending/detail",
  STORE_DETAILS: "/stores/details",
} as const;
