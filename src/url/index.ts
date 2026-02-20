export const API_BASE_URL = "http://localhost:3001/stores-api";

export const ENDPOINTS = {
  PRODUCTS_SELL: "/products/sell",
  CATEGORIES: "/categories",
  CATEGORIES_SELECT: "/categories/select",
  ORDER_PLACE: "/sale-pending",
  ORDER_DETAIL: "/sale-pending/detail",
  STORE_DETAILS: "/stores/details",
} as const;
