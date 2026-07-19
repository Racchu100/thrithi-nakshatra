"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Check, X, ShieldAlert, Sparkles } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  priceSale: number | null;
  priceRentPerPeriod: number | null;
  stockStatus: string;
  quantity: number;
  featured: boolean;
  images: string;
  category: {
    name: string;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.ok ? await res.json() : [];
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }

      // Remove from state
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#C9A24B]/10 pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
            Manage Products
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Add, edit, or delete jewelry inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs px-5 py-3 transition duration-300 rounded shadow-md flex items-center justify-center gap-2 self-start"
        >
          <Plus className="h-4.5 w-4.5 stroke-[3px]" />
          <span>Add Product</span>
        </Link>
      </div>

      {error && (
        <div className="flex gap-2.5 items-center bg-red-950/60 border border-red-500/30 text-rose-200 text-xs px-4 py-3 rounded">
          <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="h-64 bg-white/5 animate-pulse rounded flex items-center justify-center text-xs text-gray-500">
          Loading products database...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#111111] border border-white/5 rounded-lg p-12 text-center shadow-md">
          <Sparkles className="h-10 w-10 text-gray-600 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">No Products Seeded</h3>
          <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
            There are currently no products in the catalog database. Click "Add Product" to create your first item.
          </p>
          <Link
            href="/admin/products/new"
            className="border border-[#C9A24B] hover:bg-[#C9A24B] hover:text-black text-[#C9A24B] px-5 py-2.5 text-xs uppercase tracking-widest transition duration-300 inline-block"
          >
            Create First Product
          </Link>
        </div>
      ) : (
        /* Products Table */
        <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0B0B0B] border-b border-[#C9A24B]/20 text-[#E9C878] uppercase tracking-widest font-bold">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Pricing</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {products.map((product) => {
                  const firstImg = product.images.split(",")[0] || "/images/placeholder.jpg";
                  return (
                    <tr key={product.id} className="hover:bg-white/5 transition duration-150">
                      {/* Image Thumbnail */}
                      <td className="py-4 px-6 shrink-0">
                        <div className="relative h-12 w-12 rounded overflow-hidden border border-white/10">
                          <Image
                            src={firstImg}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-4 px-6 font-medium">
                        <p className="font-bold text-white font-serif text-sm truncate max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-gray-500 text-[10px] truncate max-w-xs mt-1">
                          Slug: {product.slug}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-gray-400">
                        {product.category?.name || "Uncategorized"}
                      </td>

                      {/* Transaction Type */}
                      <td className="py-4 px-6">
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {product.type}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-6 space-y-1">
                        {(product.type === "rent" || product.type === "both") && (
                          <p className="text-[10px] text-gray-400">
                            Rent:{" "}
                            <span className="font-bold text-white">
                              {formatPrice(product.priceRentPerPeriod)}
                            </span>
                          </p>
                        )}
                        {(product.type === "sale" || product.type === "both") && (
                          <p className="text-[10px] text-gray-400">
                            Sale:{" "}
                            <span className="font-bold text-white">
                              {formatPrice(product.priceSale)}
                            </span>
                          </p>
                        )}
                      </td>

                      {/* Stock / Featured Status */}
                      <td className="py-4 px-6 space-y-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            {product.stockStatus === "available" ? (
                              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                                <Check className="h-3.5 w-3.5" />
                                <span>In Stock</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                                <X className="h-3.5 w-3.5" />
                                <span>Out Of Stock</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-500">
                            Qty: <span className="font-bold text-white">{product.quantity}</span>
                          </p>
                        </div>
                        {product.featured && (
                          <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#C9A24B]/20 text-[#E9C878] border border-[#C9A24B]/20">
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right shrink-0">
                        <div className="flex justify-end gap-2.5">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-[#E9C878] rounded hover:bg-white/5"
                            title="Edit Product"
                          >
                            <Edit className="h-4.5 w-4.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-1.5 text-gray-400 hover:text-rose-400 rounded hover:bg-white/5"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
