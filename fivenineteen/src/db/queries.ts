import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { galleries, packages, photos, settings } from "@/db/schema";
import { PHOTO_SLOTS, slotSettingKey, type PhotoSlot } from "@/lib/photoSlots";

export const imageUrl = (key: string) => `${process.env.NEXT_PUBLIC_IMAGE_BASE}/${key}`;

export type PublicPhoto = { id: number; src: string; alt: string; width: number; height: number }

const photoFields = {
    id: photos.id,
    galleryId: photos.galleryId,
    r2Key: photos.r2Key,
    alt: photos.alt,
    width: photos.width,
    height: photos.height,
};

type PhotoRow = { id: number; r2Key: string; alt: string; width: number; height: number };

const toPublic = (p: PhotoRow): PublicPhoto => ({
    id: p.id,
    src: imageUrl(p.r2Key),
    alt: p.alt,
    width: p.width,
    height: p.height,
});

export async function getSettings() {
    "use cache";
    cacheTag("portfolio");
    cacheLife("hours");
    const rows = await db.select().from(settings);
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;

}

export async function getPublishedGalleries() {
    "use cache";
    cacheTag("portfolio");
    cacheLife("hours");

    const list = await db
    .select({
        id: galleries.id,
        slug: galleries.slug,
        title: galleries.title,
        description: galleries.description,
        coverPhotoId: galleries.coverPhotoId,
    })
    .from(galleries)
    .where(eq(galleries.published, true))
    .orderBy(asc(galleries.sortOrder), asc(galleries.id));

  if (!list.length) return [];
  
  const pics = await db
    .select(photoFields)
    .from(photos)
    .where(inArray(photos.galleryId, list.map((g) => g.id)))
    .orderBy(asc(photos.sortOrder), asc(photos.id));

  return list.map((g) => {
    const own = pics.filter((p) => p.galleryId === g.id);
    const cover = own.find((p) => p.id === g.coverPhotoId) ?? own[0];
    return { ...g, count: own.length, cover: cover ? toPublic(cover) : null };
  });  

}

export async function getFeatured() {
    "use cache";
    cacheTag("portfolio");
    cacheLife("hours"); 

    const rows = await db
        .select(photoFields)
    .from(photos)
    .innerJoin(galleries, eq(photos.galleryId, galleries.id))
    .where(and(eq(photos.featured, true), eq(galleries.published, true)))
    .orderBy(asc(galleries.sortOrder), asc(photos.sortOrder))
    .limit(10);

  return rows.map(toPublic);
}

/** Photos the admin pinned to fixed places on the site. Missing slots fall back to featured photos in the pages. */
export async function getSitePhotos() {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");

  const keys = PHOTO_SLOTS.map((s) => slotSettingKey(s.key));
  const rows = await db.select().from(settings).where(inArray(settings.key, keys));
  const chosen = new Map(rows.map((r) => [r.key, Number(r.value)]));
  const ids = [...chosen.values()].filter((id) => Number.isInteger(id) && id > 0);
  if (!ids.length) return {};

  const pics = await db
    .select(photoFields)
    .from(photos)
    .innerJoin(galleries, eq(photos.galleryId, galleries.id))
    .where(and(inArray(photos.id, ids), eq(galleries.published, true)));
  const byId = new Map(pics.map((p) => [p.id, toPublic(p)]));

  const result: Partial<Record<PhotoSlot, PublicPhoto>> = {};
  for (const { key } of PHOTO_SLOTS) {
    const photo = byId.get(chosen.get(slotSettingKey(key)) ?? 0);
    if (photo) result[key] = photo;
  }
  return result;
}

export async function getGallery(slug: string) {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");

  const [g] = await db
    .select({ id: galleries.id, title: galleries.title, description: galleries.description })
    .from(galleries)
    .where(and(eq(galleries.slug, slug), eq(galleries.published, true)));
  if (!g) return null;

  const list = await db
    .select(photoFields)
    .from(photos)
    .where(eq(photos.galleryId, g.id))
    .orderBy(asc(photos.sortOrder), asc(photos.id));

  return { ...g, photos: list.map(toPublic) };
}

export async function getPackages() {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");

  const list = await db
    .select()
    .from(packages)
    .where(eq(packages.published, true))
    .orderBy(asc(packages.sortOrder), asc(packages.id));

  return list.map((p) => ({
    ...p,
    features: p.features.split("\n").map((f) => f.trim()).filter(Boolean),
  }));
}

export async function getPublishedSlugs() {
  "use cache";
  cacheTag("portfolio");
  cacheLife("hours");
  const rows = await db
    .select({ slug: galleries.slug })
    .from(galleries)
    .where(eq(galleries.published, true));
  return rows.map((r) => r.slug);
}
