export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/stores-api";

export const ENDPOINTS = {
  PRODUCTS_SELL: "/products/sell",
  CATEGORIES: "/categories",
  CATEGORIES_SELECT: "/categories/select",
  ORDER_PLACE: "/public/sale-pending",
  ORDER_DETAIL: "/public/sale-pending",
  STORE_DETAILS: "/stores/details",
} as const;
