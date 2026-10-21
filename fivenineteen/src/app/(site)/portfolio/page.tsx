import type { Metadata } from "next";
import { getPublishedGalleries, getSitePhotos } from "@/db/queries";
import { GalleryCard } from "@/components/GalleryCard";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = { title: "Portfolio" };

export default async function Portfolio() {
  const [list, picks] = await Promise.all([getPublishedGalleries(), getSitePhotos()]);

  return (
    <>
      <PageHeader eyebrow="Portfolio" title={<>Stories, <em>one frame</em> at a time.</>}>
        A collection of recent work each gallery a different day, a different light, a different story.
      </PageHeader>

      <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        {list.length === 0 ? (
          <div className="border border-dashed border-ink/15 px-6 py-24 text-center">
            <p className="font-display text-3xl text-ink">New work coming soon.</p>
            <p className="mt-2 text-stone">Galleries are being curated — check back shortly.</p>
          </div>
        ) : (
          <div className="grid gap-x-8 gap-y-14 border-t border-ink/10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((g, i) => (
              <GalleryCard
                key={g.id}
                index={i}
                slug={g.slug}
                title={g.title}
                count={g.count}
                cover={g.cover}
                className={i % 3 === 1 ? "lg:mt-16" : ""}
              />
            ))}
          </div>
        )}
      </section>

      <CtaBand photo={picks.portfolio_cta ?? list[0]?.cover ?? undefined} />
    </>
  );
}
