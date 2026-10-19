import Link from "next/link";
import Image from "next/image";
import type { PublicPhoto } from "@/db/queries";

export function GalleryCard({
  slug,
  title,
  count,
  cover,
}: {
  slug: string;
  title: string;
  count: number;
  cover: PublicPhoto | null;
}) {
  return (
    <Link href={`/portfolio/${slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded bg-neutral-100">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-neutral-500">{count} photos</span>
      </div>
    </Link>
  );
}