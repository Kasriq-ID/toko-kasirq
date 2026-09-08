// ============= API Response Types =============

export interface SellPrice {
  id: string;
  price: number;
  storeId: string;
  conversionId: string;
}

export interface ProductUnit {
  id: string;
  name: string;
  ownerId: string;
}

export interface ProductConversion {
  id: string;
  quantity: number;
  unitId: string;
  status: number;
  units: ProductUnit;
  productSellPrices: SellPrice[];
}

export interface Stock {
  id: string;
  productId: string;
  quantity: number;
  storeId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  barcode: string;
  image: string | null;
  sku: string;
  isStock: number;
  status: string;
  categoryId: string;
  ownerId: string;
  categories: Category;
  stocks: Stock[];
  productConversions: ProductConversion[];
}

// ============= API Response Wrappers =============

export interface ProductsResponse {
  message: string;
  data: {
    product: Product[];
    info: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface CategoriesSelectResponse {
  message: string;
  data: {
    category: CategoryOption[];
  };
}

export interface CategoryOption {
  value: string;
  label: string;
}

// ============= Query Parameters =============

export interface ProductQueryParams {
  code?: string;
  categoryId?: string;
  storeId?: string;
  page?: string;
  limit?: string;
}

// ============= Cart Types =============

export interface CartItem {
  product: Product;
  quantity: number;
  selectedConversion: ProductConversion;
  price: number;
}

export interface CheckoutPayload {
  slug?: string;
  accountId?: string;
  memberId?: string | null;
  subTotal: number | string;
  discount: number | string;
  tax?: number | string;
  total?: number | string;
  additionalCost?: number | string;
  pay: number | string;
  description?: string;
  phone: string;
  address: string;
  name: string;
  paymentMethod: string;
  detailItem: Record<
    string,
    {
      quantity: number;
      unitId: string;
      price: number;
    }
  >;
}

export interface OrderDetailItem {
  id: string;
  saleId: string;
  productId: string | null;
  quantity: number | string;
  price: number | string;
  itemName?: string | null;
  products: Pick<Product, "id" | "name"> | null;
}

export interface OrderDetail {
  id: string;
  storeId: string | null;
  date?: string | null;
  accountId?: string | null;
  memberId: string | null;
  subTotal: number | string | null;
  discount: number | string | null;
  pay?: number | string | null;
  total: number | string | null;
  description: string | null;
  phone: string;
  address: string;
  name: string;
  invoice: string;
  paymentMethod?: string;
  createdAt: string | null;
  salePendingDetails: OrderDetailItem[];
}

export interface OrderDetailsResponse {
  status: boolean;
  message: string;
  data: {
    sales: OrderDetail;
  };
}

export interface OrderResponse {
  message: string;
  data?: unknown;
}

export interface Store {
  id: string;
  name: string;
  phone: string | null;
  address: string;
  latitude: string;
  longitude: string;
}

export interface StoreDetailsResponse {
  status: boolean;
  message: string;
  data: {
    Store: Store;
  };
}
