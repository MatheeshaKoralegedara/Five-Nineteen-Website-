"use server"

import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { db } from "@/db";
import { galleries, photos, settings } from "@/db/schema";
import { r2 } from "@/lib/r2";
import { requireAdmin } from "@/lib/auth";

const refresh = () => revalidatePath("/", "layout");

const toSlug = (text: string) => 
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* --------------- Galleries --------------- */

export async function createGallery(title: string) {
    await requireAdmin();
    const clean = title.trim();
    if (!clean) throw new Error("Title is required");

    let slug = toSlug(clean);
    const existing = await db.select().from(galleries).where(eq(galleries.slug, slug));
    if (existing.length) slug = '${slug}-${Date.now().toSttring(36)}';

    const [gallery] = await db.insert(galleries).values({ title: clean, slug }).returning();
    refresh();
    return gallery;

}

export async function renameGallery(id: number, title: string) {
    await requireAdmin();
    await db.update(galleries).set({ title: title.trim() }).where(eq(galleries.id, id));
    refresh();
}

export async function setGalleryPublished(id: number, published: boolean) {
    await requireAdmin();
    await db.update(galleries).set({ published }).where(eq(galleries.id, id));
    refresh();
}

export async function setGalleryCover(galleryId: number, photoId: number) {
    await requireAdmin();
    await db.update(galleries).set({ coverPhotoId: photoId }).where(eq(galleries.id, galleryId));
    refresh();
}

export async function reorderGalleries(orderedIds: number[]) {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, i) =>
      db.update(galleries).set({ sortOrder: i }).where(eq(galleries.id, id)),
    ),
  );
  refresh();
}

export async function deleteGallery(id: number) {
    await requireAdmin();
    const list = await db.select().from(photos).where(eq(photos.galleryId, id));
    if (list.length) {
        await r2.send(
            new DeleteObjectsCommand({
                Bucket: process.env.R2_BUCKET,
                Delete: { Objects: list.map((p) => ({ Key: p.r2Key})) },
            })
        );
    }
    await db.delete(galleries).where(eq(galleries.id, id));
    refresh();
}

/*---------------- Photos --------------- */

export async function savePhoto(p: {
    galleryId: number;
    r2Key: string;
    alt: string;
    width: number;
    height: number;
}) {
    await requireAdmin();
    const count = await db.select({ id: photos.id }).from(photos).where(eq(photos.galleryId, p.galleryId));
    const [photo] = await db
.insert(photos)
.values({ ...p, sortOrder: count.length })
.returning();
    refresh();
    return photo;       
}

export async function updatePhoto(
    id: number,
    data: { alt?: string; caption?: string; featured?: boolean },

) {
    await requireAdmin();
    await db.update(photos).set(data).where(eq(photos.id, id));
    refresh();
}

export async function deletePhoto(id: number) {
  await requireAdmin();
  const [photo] = await db.delete(photos).where(eq(photos.id, id)).returning();
  if (photo) {
    await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: photo.r2Key }));
  }
  refresh();
}

export async function deletePhotos(ids: number[]) {
  await requireAdmin();
  if (!ids.length) return;
  const removed = await db.delete(photos).where(inArray(photos.id, ids)).returning();
  if (removed.length) {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET,
        Delete: { Objects: removed.map((p) => ({ Key: p.r2Key })) },
      }),
    );
  }
  refresh();
}

/* ---------- Settings (About text, contact details) ---------- */

export async function saveSetting(key: string, value: string) {
  await requireAdmin();
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
  refresh();
}
