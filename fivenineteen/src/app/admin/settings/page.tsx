import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { galleries, photos, settings } from "@/db/schema";
import { imageUrl } from "@/db/queries";
import { PHOTO_SLOTS, slotSettingKey } from "@/lib/photoSlots";
import { SitePhotosPicker } from "@/components/admin/SitePhotosPicker";
import { saveSetting } from "../actions";

export const instant = false;

const FIELDS = [
  { key: "about_text", label: "About text", type: "textarea" },
  { key: "contact_email", label: "Contact email", type: "email" },
  { key: "whatsapp", label: "WhatsApp number (e.g. 94771234567)", type: "text" },
  { key: "instagram", label: "Instagram username (without @)", type: "text" },
  { key: "facebook_url", label: "Facebook profile or page URL", type: "url" },
  { key: "facebook_name", label: "Facebook page name (e.g. Five Nineteen by Matheesha Koralegedara)", type: "text" },
] as const;

export default async function SettingsPage() {
  const [rows, pickable] = await Promise.all([
    db.select().from(settings),
    db
      .select({ id: photos.id, r2Key: photos.r2Key, alt: photos.alt, gallery: galleries.title, published: galleries.published })
      .from(photos)
      .innerJoin(galleries, eq(photos.galleryId, galleries.id))
      .orderBy(asc(galleries.sortOrder), asc(galleries.id), asc(photos.sortOrder), asc(photos.id)),
  ]);
  const value = (key: string) => rows.find((r) => r.key === key)?.value ?? "";

  const slots = PHOTO_SLOTS.map((s) => ({ ...s, name: slotSettingKey(s.key) }));
  const initial = Object.fromEntries(slots.map((s) => [s.key, Number(value(s.name)) || undefined]));

  async function save(form: FormData) {
    "use server";
    for (const f of FIELDS) {
      await saveSetting(f.key, String(form.get(f.key) ?? ""));
    }
  }

  async function savePhotos(form: FormData) {
    "use server";
    for (const s of slots) {
      const id = Number(form.get(s.name));
      await saveSetting(s.name, Number.isInteger(id) && id > 0 ? String(id) : "");
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <form action={save} className="mt-6 space-y-5">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-sm font-medium">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                name={f.key}
                defaultValue={value(f.key)}
                rows={6}
                className="w-full rounded-lg border bg-white px-3 py-2"
              />
            ) : (
              <input
                name={f.key}
                type={f.type}
                defaultValue={value(f.key)}
                className="w-full rounded-lg border bg-white px-3 py-2"
              />
            )}
          </label>
        ))}
        <button className="rounded-lg bg-black px-4 py-2 text-white">Save settings</button>
      </form>

      <h2 className="mt-12 text-xl font-semibold">Site photos</h2>
      <p className="mt-1 text-sm text-neutral-500">
        Pick the photo for each fixed spot on the site. Spots left on automatic use your featured photos.
      </p>
      <form action={savePhotos} className="mt-6 space-y-5">
        <SitePhotosPicker
          slots={slots}
          photos={pickable.map(({ r2Key, ...p }) => ({ ...p, src: imageUrl(r2Key) }))}
          initial={initial}
        />
        <button className="rounded-lg bg-black px-4 py-2 text-white">Save site photos</button>
      </form>
    </main>
  );
}
