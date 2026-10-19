import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGallery } from "@/db/queries";
import { Masonry } from "@/components/Masonry";

export default function GalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/portfolio" className="text-sm text-neutral-500 hover:text-black">
        ← All galleries
      </Link>
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent params={params} />
      </Suspense>
    </section>
  );
}

async function GalleryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = await getGallery(slug);
  if (!gallery) notFound();

  return (
    <>
      <h1 className="mb-2 mt-4 text-3xl font-semibold">{gallery.title}</h1>
      {gallery.description && <p className="mb-8 max-w-2xl text-neutral-600">{gallery.description}</p>}
      <div className={gallery.description ? "" : "mt-8"}>
        <Masonry photos={gallery.photos} />
      </div>
    </>
  );
}

function GallerySkeleton() {
  return (
    <div className="mt-4 animate-pulse">
      <div className="mb-8 h-9 w-48 rounded bg-neutral-100" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div className="h-64 rounded bg-neutral-100" />
        <div className="h-80 rounded bg-neutral-100" />
        <div className="h-56 rounded bg-neutral-100" />
      </div>
    </div>
  );
}