import type { Metadata } from "next";
import { fetchStoreDetails } from "@/features/product/api";

type Props = {
  params: Promise<{ "store-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params)["store-slug"];
  try {
    const response = await fetchStoreDetails(slug);
    const store = response?.data?.Store;

    if (!store) return { title: "KasirQ.ID" };

    return {
      title: `${store.name} - Digital Store Menu`,
      description: `Browse and order your favorite products from ${store.name} on KasirQ.ID`,
    };
  } catch (error) {
    return {
      title: "KasirQ.ID - Digital Store Menu",
    };
  }
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
