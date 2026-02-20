import type { Product, ProductConversion } from "@/type/product";

export function getDefaultConversion(
  product: Product,
): ProductConversion | null {
  const defaultConv = product.productConversions.find((c) => c.status === 1);
  if (defaultConv) return defaultConv;
  return product.productConversions[0] ?? null;
}

export function getProductPrice(product: Product): number {
  const conversion = getDefaultConversion(product);
  if (!conversion) return 0;
  if (conversion.productSellPrices.length === 0) return 0;
  return conversion.productSellPrices[0].price;
}
