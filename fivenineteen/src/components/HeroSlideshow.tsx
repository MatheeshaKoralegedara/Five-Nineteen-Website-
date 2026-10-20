"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { PublicPhoto } from "@/db/queries";

const INTERVAL = 6000;

export function HeroSlideshow({ photos }: { photos: PublicPhoto[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % photos.length), INTERVAL);
    return () => clearTimeout(t);
  }, [active, photos.length]);

  return (
    <>
      {photos.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="100vw"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            // Re-keying restarts the slow zoom each time a slide becomes active.
            key={i === active ? `on-${active}` : "off"}
            className={`object-cover ${i === active ? "animate-kenburns" : ""}`}
          />
        </div>
      ))}

      {photos.length > 1 && (
        <div className="absolute bottom-10 right-5 z-10 flex items-center gap-4 text-white sm:right-8">
          <span className="font-display text-lg tabular-nums">
            {String(active + 1).padStart(2, "0")}
            <span className="mx-1 text-white/50">/</span>
            <span className="text-white/50">{String(photos.length).padStart(2, "0")}</span>
          </span>
          <div className="flex gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}`}
                className="group py-2"
              >
                <span className="relative block h-px w-8 overflow-hidden bg-white/30">
                  {i === active && (
                    <span
                      key={active}
                      className="absolute inset-0 origin-left bg-white"
                      style={{ animation: `progress ${INTERVAL}ms linear both` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
