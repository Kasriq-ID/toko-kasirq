import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "./api";
import type { ProductQueryParams } from "@/type/product";

export const useProducts = (params: ProductQueryParams, slug: string) => {
  return useQuery({
    queryKey: ["products", params, slug],
    queryFn: () => fetchProducts(params, slug),
    select: (data) => data.data,
  });
};

export const useCategories = (slug: string) => {
  return useQuery({
    queryKey: ["categories", slug],
    queryFn: () => fetchCategories(slug),
    select: (data) => data.data.category,
  });
};
