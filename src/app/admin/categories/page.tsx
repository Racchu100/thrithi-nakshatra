"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ShieldAlert, Sparkles, Folder, FolderOpen, X } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Category Form
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);

  // New Subcategory Form
  const [newSubName, setNewSubName] = useState("");
  const [newSubParentId, setNewSubParentId] = useState("");
  const [addingSub, setAddingSub] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAddingCat(true);
    setError("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add category");
      }

      setNewCatName("");
      // Refresh list
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to add category");
    } finally {
      setAddingCat(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubParentId) return;

    setAddingSub(true);
    setError("");

    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubName, categoryId: newSubParentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add subcategory");
      }

      setNewSubName("");
      // Refresh list
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to add subcategory");
    } finally {
      setAddingSub(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? Warning: All products inside this category will be deleted.`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete category");
      }

      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete category");
    }
  };

  const handleDeleteSubcategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) return;

    try {
      const res = await fetch(`/api/subcategories/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete subcategory");
      }

      await fetchCategories();
    } catch (err: any) {
      alert(err.message || "Failed to delete subcategory");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#C9A24B]/10 pb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
          Manage Categories
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          Create top-level categories and subcategories
        </p>
      </div>

      {error && (
        <div className="flex gap-2.5 items-center bg-red-950/60 border border-red-500/30 text-rose-200 text-xs px-4 py-3 rounded">
          <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-white/5 animate-pulse rounded flex items-center justify-center text-xs text-gray-500">
          Loading categories database...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
          {/* Column 1: Forms */}
          <div className="space-y-6 lg:col-span-1">
            {/* Add Category Form */}
            <div className="bg-[#111111] p-6 rounded-lg border border-[#C9A24B]/15 shadow-xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Folder className="h-4.5 w-4.5 text-[#E9C878]" />
                <span>Add Category</span>
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label htmlFor="cat-name" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="cat-name"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Necklaces"
                    className="w-full bg-white/5 border border-white/10 rounded px-3.5 py-2.5 text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingCat || !newCatName.trim()}
                  className="w-full gold-gradient disabled:opacity-50 text-black font-bold uppercase tracking-widest text-[10px] py-2.5 transition duration-300 rounded shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingCat ? "Adding..." : "Add Category"}</span>
                </button>
              </form>
            </div>

            {/* Add Subcategory Form */}
            <div className="bg-[#111111] p-6 rounded-lg border border-[#C9A24B]/15 shadow-xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FolderOpen className="h-4.5 w-4.5 text-[#E9C878]" />
                <span>Add Subcategory</span>
              </h3>
              <form onSubmit={handleAddSubcategory} className="space-y-4">
                <div>
                  <label htmlFor="sub-parent" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Parent Category
                  </label>
                  <select
                    id="sub-parent"
                    required
                    value={newSubParentId}
                    onChange={(e) => setNewSubParentId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#C9A24B] cursor-pointer"
                  >
                    <option value="">Select Parent</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sub-name" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    id="sub-name"
                    required
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="e.g. Kundan"
                    className="w-full bg-white/5 border border-white/10 rounded px-3.5 py-2.5 text-white placeholder-gray-650 focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingSub || !newSubName.trim() || !newSubParentId}
                  className="w-full bg-[#7A1F2B] hover:bg-[#631821] disabled:opacity-50 text-white font-bold uppercase tracking-widest text-[10px] py-2.5 transition duration-300 rounded shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingSub ? "Adding..." : "Add Subcategory"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Lists */}
          <div className="lg:col-span-2 space-y-6">
            {categories.length === 0 ? (
              <div className="bg-[#111111] border border-white/5 rounded-lg p-12 text-center shadow-md">
                <Sparkles className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-xs font-serif font-bold">No Categories Found</p>
                <p className="text-gray-500 text-[10px] mt-1">Use the forms on the left to add your first category.</p>
              </div>
            ) : (
              <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden shadow-md">
                <div className="bg-[#0B0B0B] border-b border-[#C9A24B]/20 py-4 px-6">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                    Categories & Subcategories List
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-6 space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-serif text-sm font-bold text-[#E9C878]">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-gray-500">Slug: {cat.slug}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 rounded hover:bg-white/5 transition duration-150"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {/* Subcategories Chips */}
                      <div className="bg-black/30 p-4 rounded border border-white/5 space-y-2">
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-500">
                          Subcategories ({cat.subcategories.length})
                        </span>
                        {cat.subcategories.length === 0 ? (
                          <p className="text-gray-500 italic text-[10px] pt-1">No subcategories defined</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {cat.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300"
                              >
                                <span>{sub.name}</span>
                                <button
                                  onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                  className="text-gray-500 hover:text-rose-400 p-0.5"
                                  title="Delete subcategory"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
