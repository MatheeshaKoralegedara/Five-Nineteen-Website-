import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getGallery } from "@/db/queries";
import { Masonry } from "@/components/Masonry";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon } from "@/components/icons";

export default function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <GalleryContent params={params} />
    </Suspense>
  );
}

async function GalleryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  const [cover, ...rest] = gallery.photos;

  return (
    <>
      <section className="relative flex h-[85svh] min-h-[480px] items-end overflow-hidden bg-ink">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt || gallery.title}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="animate-kenburns object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/50" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 text-ivory sm:px-8 sm:pb-20">
          <Link
            href="/portfolio"
            className="animate-fade-up group inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-ivory/70 transition hover:text-ivory"
          >
            <ArrowIcon className="size-4 rotate-180 transition group-hover:-translate-x-1" /> All galleries
          </Link>
          <h1
            className="animate-fade-up mt-6 max-w-5xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "100ms" }}
          >
            {gallery.title}
          </h1>
          <p className="animate-fade-up mt-6 text-xs uppercase tracking-[0.3em] text-gold-soft" style={{ animationDelay: "200ms" }}>
            {gallery.photos.length} {gallery.photos.length === 1 ? "photograph" : "photographs"}
          </p>
        </div>
      </section>

      {gallery.description && (
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="reveal font-display text-3xl font-light italic leading-snug text-ink sm:text-4xl">
            {gallery.description}
          </p>
          <span className="mx-auto mt-10 block h-px w-16 bg-gold" />
        </section>
      )}

      <section className={`mx-auto max-w-7xl px-5 pb-28 sm:px-8 ${gallery.description ? "" : "pt-20"}`}>
        <Masonry photos={gallery.photos} />
      </section>

      <CtaBand photo={rest[rest.length - 1] ?? cover} />
    </>
  );
}

function GallerySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[85svh] min-h-[480px] bg-sand" />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-5 py-20 sm:px-8 md:grid-cols-3">
        <div className="h-72 bg-sand" />
        <div className="h-96 bg-sand" />
        <div className="h-64 bg-sand" />
      </div>
    </div>
  );
}
