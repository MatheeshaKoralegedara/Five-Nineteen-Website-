import Link from "next/link";
import Image from "next/image";
import { getFeatured, getPublishedGalleries } from "@/db/queries";
import { site } from "@/lib/site";
import { Masonry } from "@/components/Masonry";
import { GalleryCard } from "@/components/GalleryCard";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { CtaBand } from "@/components/CtaBand";
import { Eyebrow } from "@/components/PageHeader";
import { ArrowIcon, PinIcon } from "@/components/icons";

export default async function Home() {
  const [featured, list] = await Promise.all([getFeatured(), getPublishedGalleries()]);
  const slides = featured.slice(0, 5);
  const intro = featured[5] ?? featured[1] ?? featured[0];
  const totalPhotos = list.reduce((n, g) => n + g.count, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-ink">
        <HeroSlideshow photos={slides} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/40" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-28 text-ivory sm:px-8 sm:pb-32">
          <p className="animate-fade-up flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-ivory/80">
            <PinIcon className="size-4" /> {site.location}
          </p>
          <h1
            className="animate-fade-up mt-6 max-w-5xl font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl"
            style={{ animationDelay: "150ms" }}
          >
            {site.tagline}
          </h1>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: "300ms" }}>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-ink transition hover:bg-gold hover:text-white"
            >
              View portfolio
              <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-ivory/50 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] backdrop-blur-sm transition hover:border-ivory hover:bg-ivory/10"
            >
              Book a session
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-ivory/70 md:flex">
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-ivory" />
          </span>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div className="reveal">
          <Eyebrow>{site.name} Photography</Eyebrow>
          <p className="mt-8 font-display text-4xl font-light leading-[1.15] text-ink sm:text-5xl">
            {site.intro}
          </p>
          {list.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-x-14 gap-y-6 border-t border-ink/10 pt-8">
              <Stat value={list.length} label={list.length === 1 ? "Story told" : "Stories told"} />
              <Stat value={totalPhotos} label="Frames in portfolio" />
            </div>
          )}
          <Link
            href="/about"
            className="group mt-12 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-ink"
          >
            <span className="border-b border-ink pb-1 transition group-hover:border-gold group-hover:text-gold">More about me</span>
            <ArrowIcon className="size-4 transition group-hover:translate-x-1 group-hover:text-gold" />
          </Link>
        </div>

        {intro && (
          <div className="reveal relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-sand">
              <Image src={intro.src} alt={intro.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 -z-10 hidden h-2/3 w-2/3 border border-gold/40 sm:block" />
          </div>
        )}
      </section>

      {/* Featured work */}
      {featured.length > 1 && (
        <section className="bg-sand/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading eyebrow="Selected frames" title={<>Featured <em>work</em></>} href="/portfolio" cta="All galleries" />
            <Masonry photos={featured.slice(1)} />
          </div>
        </section>
      )}

      {/* Galleries */}
      {list.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading eyebrow="Portfolio" title={<>Recent <em>stories</em></>} href="/portfolio" cta="View all" />
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.slice(0, 6).map((g, i) => (
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
        </section>
      )}

      {/* Process */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="reveal max-w-2xl">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-light leading-tight text-ink sm:text-6xl">
              Simple from <em>hello</em> to gallery.
            </h2>
          </div>
          <ol className="mt-16 grid gap-px overflow-hidden bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {site.process.map((step, i) => (
              <li key={step.title} className="reveal group bg-ivory p-8 transition hover:bg-white sm:p-10">
                <span className="font-display text-5xl font-extralight text-gold/70 transition group-hover:text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-ink">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand photo={featured[2] ?? featured[0]} />
    </>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <div className="font-display text-5xl font-light text-ink">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  cta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-6 font-display text-5xl font-light text-ink sm:text-6xl">{title}</h2>
      </div>
      <Link href={href} className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-ink">
        <span className="border-b border-ink pb-1 transition group-hover:border-gold group-hover:text-gold">{cta}</span>
        <ArrowIcon className="size-4 transition group-hover:translate-x-1 group-hover:text-gold" />
      </Link>
    </div>
  );
}
