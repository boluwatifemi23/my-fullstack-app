"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";

type Category = { _id: string; name: string; slug: string; image?: string };
const emptyForm = { name: "", slug: "", image: "" };

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    open: false, title: "", message: "", onConfirm: () => {},
  });

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  function autoSlug(name: string) {
    return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });
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
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to save"); return; }
      toast.success(editingId ? "Category updated!" : "Category created!");
      setShowForm(false); setEditingId(null); setForm(emptyForm);
      loadCategories();
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  function handleDelete(id: string, name: string) {
    setConfirmModal({
      open: true,
      title: "Delete Category",
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        try {
          const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            toast.success("Category deleted");
            setCategories((prev) => prev.filter((c) => c._id !== id));
          } else {
            toast.error("Failed to delete");
          }
        } catch { toast.error("Something went wrong"); }
      },
    });
  }

  function openEdit(cat: Category) {
    setForm({ name: cat.name, slug: cat.slug, image: cat.image || "" });
    setEditingId(cat._id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-white font-semibold text-lg">{editingId ? "Edit Category" : "Add Category"}</h2>
              <button title="Close" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Category Name *</label>
                <input required value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editingId ? f.slug : autoSlug(e.target.value) }))}
                  placeholder="e.g. Small Chops"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Slug *</label>
                <input required value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="e.g. small-chops"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
                <p className="text-gray-500 text-xs mt-1">Auto-generated from name. Used in URLs.</p>
              </div>
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1">Image</label>
                <input title="Upload image" type="file" accept="image/*" onChange={handleImageUpload}
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500/20 file:text-orange-400 file:cursor-pointer hover:file:bg-orange-500/30" />
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
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No categories yet. Add your first one!</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-gray-800 border border-white/10 rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-all">
              <div className="relative h-24 bg-linear-to-br from-orange-500/20 to-amber-500/20">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">🍽️</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-white font-semibold text-sm">{cat.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">/{cat.slug}</p>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => openEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(cat._id, cat.name)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Delete"
        danger
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}