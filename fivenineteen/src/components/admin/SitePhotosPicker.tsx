"use client";
import { useState } from "react";

export type PickablePhoto = { id: number; src: string; alt: string; gallery: string; published: boolean };
type Slot = { key: string; name: string; label: string; hint: string };

export function SitePhotosPicker({
  slots,
  photos,
  initial,
}: {
  slots: Slot[];
  photos: PickablePhoto[];
  initial: Record<string, number | undefined>;
}) {
  const [chosen, setChosen] = useState(initial);
  const [open, setOpen] = useState<string | null>(null);
  const byId = new Map(photos.map((p) => [p.id, p]));

  const groups = photos.reduce<{ gallery: string; published: boolean; items: PickablePhoto[] }[]>((acc, p) => {
    const last = acc[acc.length - 1];
    if (last?.gallery === p.gallery) last.items.push(p);
    else acc.push({ gallery: p.gallery, published: p.published, items: [p] });
    return acc;
  }, []);

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const photo = byId.get(chosen[slot.key] ?? 0);
        const isOpen = open === slot.key;
        return (
          <div key={slot.key} className="rounded-lg border bg-white">
            <input type="hidden" name={slot.name} value={photo ? photo.id : ""} />
            <div className="flex items-center gap-4 p-3">
              <div className="size-16 shrink-0 overflow-hidden rounded bg-neutral-100">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{slot.label}</p>
                <p className="truncate text-xs text-neutral-500">{slot.hint}</p>
                <p className="mt-1 text-xs">
                  {photo ? (
                    <span className={photo.published ? "text-neutral-600" : "text-amber-700"}>
                      From “{photo.gallery}”{!photo.published && " (unpublished, won't show until published)"}
                    </span>
                  ) : (
                    <span className="text-neutral-400">Automatic (uses featured photos)</span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 text-sm sm:flex-row sm:items-center sm:gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : slot.key)}
                  className="rounded border px-3 py-1 hover:bg-neutral-50"
                >
                  {isOpen ? "Close" : "Choose"}
                </button>
                {photo && (
                  <button
                    type="button"
                    onClick={() => setChosen({ ...chosen, [slot.key]: undefined })}
                    className="text-xs text-neutral-500 hover:text-black"
                  >
                    Use automatic
                  </button>
                )}
              </div>
            </div>

            {isOpen && (
              <div className="max-h-96 space-y-4 overflow-y-auto border-t p-3">
                {groups.length === 0 && <p className="text-sm text-neutral-500">Upload photos to a gallery first.</p>}
                {groups.map((g, i) => (
                  <div key={`${i}-${g.gallery}`}>
                    <p className="mb-2 text-xs font-medium text-neutral-600">
                      {g.gallery}
                      {!g.published && <span className="ml-1 text-amber-700">(unpublished)</span>}
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {g.items.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setChosen({ ...chosen, [slot.key]: p.id });
                            setOpen(null);
                          }}
                          className={`aspect-square overflow-hidden rounded ring-offset-2 hover:opacity-80 ${
                            p.id === photo?.id ? "ring-2 ring-black" : ""
                          }`}
                          aria-label={`Use ${p.alt || "photo"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
