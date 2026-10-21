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
      <div className="columns-2 gap-2.5 sm:gap-5 lg:columns-3">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="reveal group relative mb-2.5 block w-full cursor-zoom-in break-inside-avoid overflow-hidden bg-sand [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:mb-5"
            aria-label={`Open ${p.alt || "photo"}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(max-width: 1024px) 50vw, 33vw"
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
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        carousel={{ padding: 0 }}
        counter={{ container: { style: { top: "unset", bottom: "env(safe-area-inset-bottom)" } } }}
        styles={{ container: { backgroundColor: "rgba(21, 19, 17, 0.97)" } }}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt, width: p.width, height: p.height }))}
      />
    </>
  );
}
