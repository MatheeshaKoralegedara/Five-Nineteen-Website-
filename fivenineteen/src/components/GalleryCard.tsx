import Link from "next/link";
import Image from "next/image";
import type { PublicPhoto } from "@/db/queries";
import { ArrowIcon } from "@/components/icons";

export function GalleryCard({
  slug,
  title,
  count,
  cover,
  index,
  className = "",
}: {
  slug: string;
  title: string;
  count: number;
  cover: PublicPhoto | null;
  index?: number;
  className?: string;
}) {
  return (
    <Link href={`/portfolio/${slug}`} className={`reveal group block ${className}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        {cover && (
          <Image
            src={cover.src}
            alt={cover.alt || title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-60 transition duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between p-6 text-ivory opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-xs uppercase tracking-[0.25em]">View gallery</span>
          <span className="grid size-10 place-items-center rounded-full border border-ivory/50">
            <ArrowIcon />
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-baseline gap-4">
        {index !== undefined && (
          <span className="font-display text-sm font-semibold text-gold">{String(index + 1).padStart(2, "0")}</span>
        )}
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-ink transition group-hover:text-gold">{title}</h3>
        <span className="ml-auto text-xs uppercase tracking-[0.2em] text-stone">
          {count} {count === 1 ? "photo" : "photos"}
        </span>
      </div>
    </Link>
  );
}
