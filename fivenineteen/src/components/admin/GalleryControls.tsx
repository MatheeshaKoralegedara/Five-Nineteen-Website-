"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGallery, renameGallery, setGalleryPublished } from "@/app/admin/actions";

export function GalleryControls({
  id,
  title,
  published,
}: {
  id: number;
  title: string;
  published: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(title);
  const [isPublished, setIsPublished] = useState(published);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name.trim() && name !== title && renameGallery(id, name)}
        className="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-2xl font-semibold"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={async (e) => {
            setIsPublished(e.target.checked);
            await setGalleryPublished(id, e.target.checked);
          }}
        />
        Published
      </label>
      <button
        onClick={async () => {
          if (!confirm(`Delete "${title}" and ALL its photos? This cannot be undone.`)) return;
          await deleteGallery(id);
          router.push("/admin");
        }}
        className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Delete gallery
      </button>
    </div>
  );
}