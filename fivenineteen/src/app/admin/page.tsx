import Link from "next/link";
import { redirect } from "next/navigation";
import { asc, count } from "drizzle-orm";
import { db } from "@/db";
import { galleries, photos } from "@/db/schema";
import { createGallery } from "./actions";

export const instant = false;

export default async function Dashboard() {
  const list = await db.select().from(galleries).orderBy(asc(galleries.sortOrder), asc(galleries.id));
  const counts = await db
    .select({ galleryId: photos.galleryId, n: count() })
    .from(photos)
    .groupBy(photos.galleryId);
  const countFor = (id: number) => counts.find((c) => c.galleryId === id)?.n ?? 0;

  async function add(form: FormData) {
    "use server";
    const gallery = await createGallery(String(form.get("title") ?? ""));
    redirect(`/admin/galleries/${gallery.id}`);
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Galleries</h1>

      <form action={add} className="my-6 flex gap-2">
        <input
          name="title"
          required
          placeholder="New gallery, e.g. Weddings"
          className="flex-1 rounded-lg border bg-white px-3 py-2"
        />
        <button className="rounded-lg bg-black px-4 py-2 text-white">Add gallery</button>
      </form>

      {list.length === 0 ? (
        <p className="text-neutral-500">No galleries yet. Create your first one above.</p>
      ) : (
        <ul className="divide-y rounded-lg border bg-white">
          {list.map((g) => (
            <li key={g.id}>
              <Link
                href={`/admin/galleries/${g.id}`}
                className="flex items-center justify-between p-4 hover:bg-neutral-50"
              >
                <span className="font-medium">{g.title}</span>
                <span className="flex items-center gap-3 text-sm text-neutral-500">
                  {countFor(g.id)} photos
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      g.published ? "bg-green-100 text-green-800" : "bg-neutral-100"
                    }`}
                  >
                    {g.published ? "Published" : "Draft"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}