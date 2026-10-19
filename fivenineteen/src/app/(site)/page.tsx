import Link from "next/link";
import Image from "next/image";
import { getFeatured, getPublishedGalleries } from "@/db/queries";
import { site } from "@/lib/site";
import { Masonry } from "@/components/Masonry";
import { GalleryCard } from "@/components/GalleryCard";

export default async function Home() {
  const [featured, list] = await Promise.all([getFeatured(), getPublishedGalleries()]);
  const [hero, ...rest] = featured;

  return (
    <>
      <section className="relative h-[75vh] min-h-[420px] w-full bg-neutral-900">
        {hero && (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-12 text-white sm:px-6">
          <h1 className="text-3xl font-semibold sm:text-5xl">{site.tagline}</h1>
          <p className="mt-2 text-white/80">{site.location}</p>
          <Link
            href="/portfolio"
            className="mt-6 inline-block rounded-full border border-white px-5 py-2 text-sm hover:bg-white hover:text-black"
          >
            View portfolio
          </Link>
        </div>
      </section>

      {rest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">Featured work</h2>
            <Link href="/portfolio" className="text-sm text-neutral-500 hover:text-black">
              See all galleries →
            </Link>
          </div>
          <Masonry photos={rest} />
        </section>
      )}

      {list.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold">Galleries</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g) => (
              <GalleryCard key={g.id} slug={g.slug} title={g.title} count={g.count} cover={g.cover} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}