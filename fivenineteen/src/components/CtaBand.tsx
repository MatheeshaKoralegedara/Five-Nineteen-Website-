import Link from "next/link";
import Image from "next/image";
import type { PublicPhoto } from "@/db/queries";
import { ArrowIcon } from "@/components/icons";
import { Eyebrow } from "@/components/PageHeader";

export function CtaBand({ photo }: { photo?: PublicPhoto }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-soft">
      {photo && (
        <Image src={photo.src} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
      <div className="reveal mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
        <Eyebrow light>Now booking</Eyebrow>
        <h2 className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.05] text-ivory sm:text-7xl">
          Let&apos;s create something <em className="text-gold-soft">timeless</em>.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/70">
          Dates fill up quickly. Tell me about your plans and I&apos;ll get back to you within a day.
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-ivory px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-gold hover:text-white"
        >
          Check availability
          <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
