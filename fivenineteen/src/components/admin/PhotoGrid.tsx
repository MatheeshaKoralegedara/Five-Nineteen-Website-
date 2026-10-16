"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { deletePhoto, reorderPhotos, setGalleryCover, updatePhoto } from "@/app/admin/actions";

type Photo = { id: number; r2Key: string; alt: string; featured: boolean };

const imageUrl = (key: string) => `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${key}`;

export function PhotoGrid({
  galleryId,
  coverPhotoId,
  initial,
}: {
  galleryId: number;
  coverPhotoId: number | null;
  initial: Photo[];
}) {
  const [items, setItems] = useState(initial);
  // Resync when the server sends fresh photos (e.g. after an upload or revalidate).
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setItems(initial);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((p) => p.id === active.id);
    const to = items.findIndex((p) => p.id === over.id);
    const next = arrayMove(items, from, to);
    setItems(next);
    await reorderPhotos(next.map((p) => p.id));
  }

  if (!items.length) {
    return <p className="text-neutral-500">No photos yet. Upload some above.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <Tile
              key={p.id}
              photo={p}
              isCover={p.id === coverPhotoId}
              galleryId={galleryId}
              onRemoved={() => setItems((prev) => prev.filter((x) => x.id !== p.id))}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function Tile({
  photo,
  isCover,
  galleryId,
  onRemoved,
}: {
  photo: Photo;
  isCover: boolean;
  galleryId: number;
  onRemoved: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });
  const [alt, setAlt] = useState(photo.alt);
  const [featured, setFeatured] = useState(photo.featured);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-lg border bg-white ${isDragging ? "shadow-lg" : ""}`}
    >
      <div className="relative aspect-square bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl(photo.r2Key)} alt={alt} className="h-full w-full object-cover" />

        <button
          {...attributes}
          {...listeners}
          className="absolute left-2 top-2 cursor-grab rounded bg-white/90 px-2 py-1 text-sm active:cursor-grabbing"
          title="Drag to reorder"
        >
          ⠿
        </button>

        <button
          onClick={async () => {
            setFeatured(!featured);
            await updatePhoto(photo.id, { featured: !featured });
          }}
          className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs ${
            featured ? "bg-yellow-300" : "bg-white/90"
          }`}
          title="Feature on home page"
        >
          ★ {featured ? "Featured" : "Feature"}
        </button>

        {isCover && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/80 px-2 py-0.5 text-xs text-white">
            Cover
          </span>
        )}
      </div>

      <div className="space-y-2 p-2">
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onBlur={() => alt !== photo.alt && updatePhoto(photo.id, { alt })}
          placeholder="Add alt text"
          className={`w-full rounded border px-2 py-1 text-sm ${
            alt.trim() ? "" : "border-amber-400 bg-amber-50"
          }`}
        />
        <div className="flex justify-between text-xs">
          <button
            onClick={() => setGalleryCover(galleryId, photo.id)}
            disabled={isCover}
            className="text-neutral-600 hover:text-black disabled:opacity-40"
          >
            Set as cover
          </button>
          <button
            onClick={async () => {
              if (!confirm("Delete this photo permanently?")) return;
              onRemoved();
              await deletePhoto(photo.id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}