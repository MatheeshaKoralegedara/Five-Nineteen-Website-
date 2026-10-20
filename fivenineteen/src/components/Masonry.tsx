"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import type { PublicPhoto } from "@/db/queries";

export function Masonry({ photos }: { photos: PublicPhoto[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 sm:gap-5 lg:columns-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="reveal group relative mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden bg-sand sm:mb-5"
            aria-label={`Open ${p.alt || "photo"}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
            <span className="pointer-events-none absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/15" />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Counter, Zoom]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        styles={{ container: { backgroundColor: "rgba(21, 19, 17, 0.97)" } }}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}
