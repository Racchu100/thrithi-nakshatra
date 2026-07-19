"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface ProductFormProps {
  productId?: string; // If passed, we are in Edit Mode
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const editMode = !!productId;

  // Categories loading
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [type, setType] = useState("both"); // "rent", "sale", "both"
  const [priceSale, setPriceSale] = useState("");
  const [priceRentPerPeriod, setPriceRentPerPeriod] = useState("");
  const [rentDurations, setRentDurations] = useState("3,5,7,10,15");
  const [images, setImages] = useState("");
  const [stockStatus, setStockStatus] = useState("available");
  const [quantity, setQuantity] = useState("5");
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error("Error loading categories", err);
        setLoadingCategories(false);
      });
  }, []);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (editMode && productId) {
      setLoading(true);
      fetch(`/api/products/${productId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load product details");
          return res.json();
        })
        .then((data) => {
          setName(data.name || "");
          setSlug(data.slug || "");
          setDescription(data.description || "");
          setCategoryId(data.categoryId || "");
          setSubcategoryId(data.subcategoryId || "");
          setType(data.type || "both");
          setPriceSale(data.priceSale ? String(data.priceSale) : "");
          setPriceRentPerPeriod(data.priceRentPerPeriod ? String(data.priceRentPerPeriod) : "");
          setRentDurations(data.rentDurations || "");
          setImages(data.images || "");
          setStockStatus(data.stockStatus || "available");
          setQuantity(data.quantity !== undefined ? String(data.quantity) : "5");
          setFeatured(!!data.featured);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to load product details");
          setLoading(false);
        });
    }
  }, [editMode, productId]);

  // Handle slug auto-generation from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editMode) {
      setSlug(
        val
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
      );
    }
  };

  // Populate random jewellery images
  const handleAddRandomImage = () => {
    const jewelryPics = [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600"
    ];
    
    // Pick two random images
    const img1 = jewelryPics[Math.floor(Math.random() * jewelryPics.length)];
    let img2 = jewelryPics[Math.floor(Math.random() * jewelryPics.length)];
    while (img1 === img2) {
      img2 = jewelryPics[Math.floor(Math.random() * jewelryPics.length)];
    }

    setImages(`${img1},${img2}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !slug || !categoryId || !type) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const url = editMode ? `/api/products/${productId}` : "/api/products";
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          categoryId,
          subcategoryId: subcategoryId || null,
          type,
          priceSale: priceSale ? parseFloat(priceSale) : null,
          priceRentPerPeriod: priceRentPerPeriod ? parseFloat(priceRentPerPeriod) : null,
          rentDurations,
          images,
          stockStatus,
          quantity: parseInt(quantity) || 0,
          featured
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  if (loading && editMode) {
    return (
      <div className="h-64 bg-white/5 animate-pulse rounded flex items-center justify-center text-xs text-gray-500">
        Loading product form data...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back link */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#E9C878] transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
          {editMode ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          {editMode ? "Modify product parameters" : "Insert a new jewelry item in the boutique database"}
        </p>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-500/30 text-rose-200 text-xs px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#111111] p-8 rounded-lg border border-[#C9A24B]/15 shadow-xl space-y-6 text-xs">
        {/* Name */}
        <div>
          <label htmlFor="prod-name" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="prod-name"
            required
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Royal Kundan Bridal Choker"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="prod-slug" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
            Product URL Slug *
          </label>
          <input
            type="text"
            id="prod-slug"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. royal-kundan-bridal-choker"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="prod-desc" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
            Product Description *
          </label>
          <textarea
            id="prod-desc"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter detailed specifications, gems used, plating finish, and dimensions..."
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
          />
        </div>

        {/* Category & Subcategory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="prod-cat" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
              Category *
            </label>
            <select
              id="prod-cat"
              required
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId(""); // reset subcategory on change
              }}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A24B] cursor-pointer"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prod-sub" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
              Subcategory
            </label>
            <select
              id="prod-sub"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={!categoryId || !selectedCategoryObj || selectedCategoryObj.subcategories.length === 0}
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A24B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="">Select Subcategory</option>
              {selectedCategoryObj?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction Type */}
        <div>
          <label htmlFor="prod-type" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
            Transaction Offer Type *
          </label>
          <select
            id="prod-type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C9A24B] cursor-pointer"
          >
            <option value="rent">Rent Only</option>
            <option value="sale">Sale Only</option>
            <option value="both">Both (Rent & Sale)</option>
          </select>
        </div>

        {/* Dynamic Pricing fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
          {/* Rent Price */}
          {(type === "rent" || type === "both") && (
            <div>
              <label htmlFor="prod-price-rent" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
                Rental Price (INR per Period) *
              </label>
              <input
                type="number"
                id="prod-price-rent"
                required
                value={priceRentPerPeriod}
                onChange={(e) => setPriceRentPerPeriod(e.target.value)}
                placeholder="e.g. 1499"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
              />
            </div>
          )}

          {/* Sale Price */}
          {(type === "sale" || type === "both") && (
            <div>
              <label htmlFor="prod-price-sale" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
                Sale Price (INR Outright) *
              </label>
              <input
                type="number"
                id="prod-price-sale"
                required
                value={priceSale}
                onChange={(e) => setPriceSale(e.target.value)}
                placeholder="e.g. 5999"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
              />
            </div>
          )}
        </div>

        {/* Rent Durations (only if rentable) */}
        {(type === "rent" || type === "both") && (
          <div>
            <label htmlFor="prod-rent-durations" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
              Allowed Rental Durations (comma-separated days) *
            </label>
            <input
              type="text"
              id="prod-rent-durations"
              required
              value={rentDurations}
              onChange={(e) => setRentDurations(e.target.value)}
              placeholder="e.g. 3,5,7,10,15"
              className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Provide days options separated by commas, e.g. "3,5,7" or "3,5,7,10,15".
            </p>
          </div>
        )}

        {/* Images URLs list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prod-images" className="block font-bold uppercase tracking-wider text-gray-300">
              Product Images (comma-separated URLs)
            </label>
            <button
              type="button"
              onClick={handleAddRandomImage}
              className="text-[#E9C878] hover:text-white flex items-center gap-1 font-bold transition duration-200"
              title="Populate test placeholder images"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Use Test Images</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute top-3.5 left-3 pointer-events-none">
              <ImageIcon className="h-4.5 w-4.5 text-gray-500" />
            </div>
            <textarea
              id="prod-images"
              rows={3}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="https://example.com/image1.jpg,https://example.com/image2.jpg"
              className="pl-10 w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
            />
          </div>
        </div>

        {/* Quantity (Stock) */}
        <div>
          <label htmlFor="prod-quantity" className="block font-bold uppercase tracking-wider text-gray-300 mb-2">
            Product Stock Quantity *
          </label>
          <input
            type="number"
            id="prod-quantity"
            required
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 5"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B] transition duration-200"
          />
          <p className="text-[10px] text-gray-500 mt-1">
            Specify the number of units available in stock. The system automatically decrements this when rented, and restores it when completed/cancelled.
          </p>
        </div>

        {/* Toggles (Stock & Featured) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
          <div className="flex items-center justify-between bg-white/5 p-4 rounded border border-white/5">
            <div>
              <span className="font-bold text-white block uppercase tracking-wider">Stock Status</span>
              <span className="text-[10px] text-gray-500">Toggle availability of this jewelry set</span>
            </div>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="bg-[#0B0B0B] border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9A24B] cursor-pointer"
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center justify-between bg-white/5 p-4 rounded border border-white/5">
            <div>
              <span className="font-bold text-white block uppercase tracking-wider">Featured on Home</span>
              <span className="text-[10px] text-gray-500">Display this product on the home page showcase</span>
            </div>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#C9A24B] h-5 w-5 bg-white/5 border border-white/10 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7A1F2B] hover:bg-[#631821] disabled:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs py-4 transition duration-300 rounded shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? "Saving Product..." : "Save Product Details"}</span>
            <Save className="h-4.5 w-4.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
