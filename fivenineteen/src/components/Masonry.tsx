"use client";
import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { PublicPhoto } from "@/db/queries";

export function Masonry({ photos }: { photos: PublicPhoto[] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded"
            aria-label={`Open ${p.alt || "photo"}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full transition duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}