import api from "@/lib/axios";
import { ENDPOINTS } from "@/url";
import type {
  ProductsResponse,
  ProductQueryParams,
  CategoriesSelectResponse,
  CheckoutPayload,
  OrderResponse,
  OrderDetailsResponse,
  StoreDetailsResponse,
} from "@/type/product";

export const fetchProducts = async (
  params: ProductQueryParams,
  slug: string,
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(
    `${ENDPOINTS.PRODUCTS_SELL}/${slug}`,
    {
      params,
    },
  );
  return data;
};

export const fetchCategories = async (
  slug: string,
): Promise<CategoriesSelectResponse> => {
  const { data } = await api.get<CategoriesSelectResponse>(
    `${ENDPOINTS.CATEGORIES_SELECT}/${slug}`,
  );
  return data;
};

export const placeOrder = async ({
  payload,
  slug,
}: {
  payload: CheckoutPayload;
  slug: string;
}): Promise<OrderResponse> => {
  const { data } = await api.post<OrderResponse>(
    `${ENDPOINTS.ORDER_PLACE}/${slug}`,
    payload,
  );
  return data;
};

export const fetchOrderById = async (
  id: string,
): Promise<OrderDetailsResponse> => {
  const { data } = await api.get<OrderDetailsResponse>(
    `${ENDPOINTS.ORDER_PLACE}/${id}`,
  );
  return data;
};

export const fetchStoreDetails = async (
  slug: string,
): Promise<StoreDetailsResponse> => {
  const { data } = await api.get<StoreDetailsResponse>(
    `${ENDPOINTS.STORE_DETAILS}/${slug}`,
  );
  return data;
};
