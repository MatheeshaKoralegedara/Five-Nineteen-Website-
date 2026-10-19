import { getPublishedGalleries } from "@/db/queries";
import { GalleryCard } from "@/components/GalleryCard";

export default async function Portfolio() {
  const list = await getPublishedGalleries();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-10 text-3xl font-semibold">Portfolio</h1>
      {list.length === 0 ? (
        <p className="text-neutral-500">New work coming soon.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <GalleryCard key={g.id} slug={g.slug} title={g.title} count={g.count} cover={g.cover} />
          ))}
        </div>
      )}
    </section>
  );
}