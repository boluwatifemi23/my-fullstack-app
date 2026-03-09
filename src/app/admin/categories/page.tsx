"use client";

import { useState } from "react";
import UploadImage from "../components/UploadImage";

export default function AdminCategories() {
  const [image, setImage] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      slug: e.target.slug.value,
      image,
    };

    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    alert("Category created!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>

      <form onSubmit={submit} className="space-y-4 max-w-md">
        <input
          name="name"
          placeholder="Category Name"
          className="border p-2 rounded w-full"
        />

        <input
          name="slug"
          placeholder="Slug"
          className="border p-2 rounded w-full"
        />

        <UploadImage onUploaded={setImage} />

        {image && (
          <img src={image} alt="" className="w-32 h-32 object-cover rounded" />
        )}

        <button className="bg-orange-600 text-white px-4 py-2 rounded">
          Save Category
        </button>
      </form>
    </div>
  );
}
