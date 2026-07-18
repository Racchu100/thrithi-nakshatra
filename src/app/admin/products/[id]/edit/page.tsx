import ProductForm from "@/components/ProductForm";

interface AdminEditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  return <ProductForm productId={id} />;
}
