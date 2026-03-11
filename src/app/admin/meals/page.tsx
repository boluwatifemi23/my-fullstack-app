"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X, Search } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

type Category = { _id: string; name: string; slug: string };
type Meal = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

const emptyForm = { name: "", price: "", category: "", image: "", description: "" };

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export default function AdminMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    open: false, title: "", message: "", onConfirm: () => {},
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [mealsRes, catsRes] = await Promise.all([
      fetch("/api/meals", { credentials: "include" }),
      fetch("/api/categories", { credentials: "include" }),
    ]);
    setMeals(await mealsRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", credentials: "include", body: data });
      const result = await res.json();
      if (result.url) { setForm((f) => ({ ...f, image: result.url })); toast.success("Image uploaded!"); }
      else toast.error("Upload failed");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      const url = editingId ? `/api/meals/${editingId}` : "/api/meals";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to save meal"); return; }
      toast.success(editingId ? "Meal updated!" : "Meal created!");
      setShowForm(false); setEditingId(null); setForm(emptyForm);
      loadData();
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  function handleDelete(id: string, name: string) {
    setConfirmModal({
      open: true, title: "Delete Meal",
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        try {
          const res = await fetch(`/api/meals/${id}`, { method: "DELETE", credentials: "include" });
          if (res.ok) { toast.success("Meal deleted"); setMeals((prev) => prev.filter((m) => m._id !== id)); }
          else toast.error("Failed to delete");
        } catch { toast.error("Something went wrong"); }
      },
    });
  }

  function openEdit(meal: Meal) {
    setForm({ name: meal.name, price: String(meal.price), category: meal.category, image: meal.image || "", description: meal.description || "" });
    setEditingId(meal._id);
    setShowForm(true);
  }

  function openNew() { setForm(emptyForm); setEditingId(null); setShowForm(true); }

  const filtered = meals.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white">Meals</h1>
          <p className="text-gray-400 text-sm mt-1">{meals.length} meals in the menu</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all shrink-0">
          <Plus size={16} /> <span className="hidden sm:inline">Add</span> Meal
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meals or categories..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold text-lg">{editingId ? "Edit Meal" : "Add New Meal"}</h2>
              <button title="Close" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="text-gray-400 hover:text-white transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Meal Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Jollof Rice"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Price ($) *</label>
                <input required type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 2500"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Category *</label>
                <select title="Category" required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500/50">
                  <option value="">Select a category</option>
                  {categories.map((cat) => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the meal..."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50 resize-none" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Image</label>
                <input title="Upload image" type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/20 file:text-orange-400 file:cursor-pointer hover:file:bg-orange-500/30 cursor-pointer" />
                {uploading && <p className="text-orange-400 text-xs mt-1 animate-pulse">Uploading...</p>}
                {form.image && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                    <Image src={form.image} alt="preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-gray-300 text-sm hover:bg-white/5 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Meal" : "Create Meal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {search ? "No meals match your search." : "No meals yet. Add your first meal!"}
        </div>
      ) : (
        <>
       
          <div className="sm:hidden space-y-3">
            {filtered.map((meal) => (
              <div key={meal._id} className="bg-gray-800 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-700">
                  {meal.image
                    ? <Image src={meal.image} alt={meal.name} width={48} height={48} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{meal.name}</p>
                  <p className="text-gray-500 text-xs capitalize">{meal.category.replace(/-/g, " ")}</p>
                  <p className="text-orange-400 font-bold text-sm mt-0.5">${meal.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                  title="edit"
                   onClick={() => openEdit(meal)}
                    className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition">
                    <Pencil size={15} />
                  </button>
                  <button title="delete" onClick={() => handleDelete(meal._id, meal.name)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        
          <div className="hidden sm:block bg-gray-800 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Meal</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((meal) => (
                  <tr key={meal._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-700">
                          {meal.image
                            ? <Image src={meal.image} alt={meal.name} width={40} height={40} className="object-cover w-full h-full" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>}
                        </div>
                        <div>
                          <p className="text-white font-medium">{meal.name}</p>
                          {meal.description && <p className="text-gray-500 text-xs line-clamp-1">{meal.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs capitalize">
                        {meal.category.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">${meal.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(meal)} title="Edit Meal"
                          className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(meal._id, meal.name)} title="Delete Meal"
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmModal
        open={confirmModal.open} title={confirmModal.title} message={confirmModal.message}
        confirmLabel="Delete" danger
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}