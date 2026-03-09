"use client";

import { useState } from "react";

export default function UploadImage({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ file: reader.result }),
      });
      const data = await res.json();

      if (data.url) {
        onUploaded(data.url);
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" placeholder="upload a file" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
    </div>
  );
}
