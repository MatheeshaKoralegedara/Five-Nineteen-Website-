import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { galleries, photos } from "@/db/schema";
import { Uploader } from "@/components/admin/Uploader";
import { PhotoGrid } from "@/components/admin/PhotoGrid";
import { GalleryControls } from "@/components/admin/GalleryControls";

export const instant = false;

export default async function EditGallery({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [gallery] = await db.select().from(galleries).where(eq(galleries.id, id));
  if (!gallery) notFound();

  const list = await db
    .select({ id: photos.id, r2Key: photos.r2Key, alt: photos.alt, featured: photos.featured })
    .from(photos)
    .where(eq(photos.galleryId, id))
    .orderBy(asc(photos.sortOrder), asc(photos.id));

  const missingAlt = list.filter((p) => !p.alt.trim()).length;

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <Link href="/admin" className="text-sm text-neutral-500 hover:text-black">← All galleries</Link>

      <GalleryControls id={gallery.id} title={gallery.title} published={gallery.published} />

      <Uploader galleryId={gallery.id} gallerySlug={gallery.slug} />

      <div className="flex items-baseline justify-between">
        <h2 className="font-medium">{list.length} photos</h2>
        {missingAlt > 0 && (
          <p className="text-sm text-amber-700">{missingAlt} photo(s) still need alt text</p>
        )}
      </div>

      <PhotoGrid galleryId={gallery.id} coverPhotoId={gallery.coverPhotoId} initial={list} />
    </main>
  );
}