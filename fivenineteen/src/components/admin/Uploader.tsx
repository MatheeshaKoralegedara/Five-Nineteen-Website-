"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { savePhoto } from "@/app/admin/actions";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function Uploader({ galleryId, gallerySlug }: { galleryId: number; gallerySlug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function handle(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter((f) => ACCEPTED.includes(f.type));
    if (!files.length) {
      setStatus("Please choose JPG, PNG or WebP files.");
      return;
    }
    setBusy(true);
    let failed = 0;

    for (const [i, original] of files.entries()) {
      try {
        setStatus(`Resizing ${i + 1} of ${files.length}: ${original.name}`);
        setProgress(Math.round((i / files.length) * 100));

        const file = await imageCompression(original, {
          maxWidthOrHeight: 2500,
          maxSizeMB: 2,
          fileType: "image/jpeg",
          initialQuality: 0.85,
          useWebWorker: true,
        });
        const { width, height } = await createImageBitmap(file);

        setStatus(`Uploading ${i + 1} of ${files.length}: ${original.name}`);
        const res = await fetch("/api/admin/upload-url", {
          method: "POST",
          body: JSON.stringify({ fileName: original.name, contentType: "image/jpeg", gallerySlug }),
        });
        if (!res.ok) throw new Error(`Upload link failed (${res.status})`);
        const { url, key } = await res.json();

        const put = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": "image/jpeg" },
        });
        if (!put.ok) throw new Error(`Upload failed (${put.status})`);

        await savePhoto({ galleryId, r2Key: key, alt: "", width, height });
      } catch (err) {
        console.error(original.name, err);
        failed++;
      }
    }

    setProgress(100);
    setStatus(
      failed
        ? `Done, but ${failed} file(s) failed. Check the browser console.`
        : `Uploaded ${files.length} photo(s).`,
    );
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) handle(e.dataTransfer.files);
        }}
        className={`block cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
          dragging ? "border-black bg-neutral-100" : "border-neutral-300 bg-white"
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          hidden
          onChange={(e) => {
            handle(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="font-medium">Drag photos here or click to upload</p>
        <p className="text-sm text-neutral-500">Resized in your browser, then sent straight to R2</p>
      </label>

      {status && (
        <div className="mt-3">
          {busy && (
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <p className="text-sm text-neutral-600">{status}</p>
        </div>
      )}
    </div>
  );
}
