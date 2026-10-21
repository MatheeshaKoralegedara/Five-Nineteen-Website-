import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFeatured, getSettings, getSitePhotos } from "@/db/queries";
import { site } from "@/lib/site";
import { PageHeader, Eyebrow } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const [s, featured, picks] = await Promise.all([getSettings(), getFeatured(), getSitePhotos()]);
  const paragraphs = (s.about_text ?? "").split(/\n\s*\n/).filter(Boolean);
  const [lead, ...body] = paragraphs;
  const portrait = picks.about_portrait ?? featured[3] ?? featured[0];
  const accent = picks.about_accent ?? featured[4] ?? featured[1];

  return (
    <>
      <PageHeader eyebrow="About" title={<>Hello, I&apos;m <em>{site.photographer.split(" ")[0]}</em>.</>} />

      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-24 lg:pb-32">
        <div className="reveal relative">
          {portrait ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-sand lg:sticky lg:top-28">
              <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/5] bg-sand" />
          )}
        </div>

        <div className="lg:pt-8">
          {paragraphs.length ? (
            <>
              <p className="reveal font-display text-3xl font-light leading-snug text-ink sm:text-4xl">{lead}</p>
              <div className="mt-10 space-y-6 text-lg leading-relaxed text-stone">
                {body.map((p, i) => <p key={i} className="reveal">{p}</p>)}
              </div>
            </>
          ) : (
            <p className="text-stone">Add your About text in Admin → Settings.</p>
          )}

          <div className="reveal mt-14 grid gap-px bg-ink/10 sm:grid-cols-2">
            <Fact label="Based in" value={site.location} />
            <Fact label="Approach" value="Natural, candid, unhurried" />
          </div>

          <div className="reveal mt-12 flex flex-wrap items-center gap-6">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition hover:bg-gold"
            >
              Get in touch
              <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <Link href="/portfolio" className="text-xs font-medium uppercase tracking-[0.25em] text-ink underline-offset-8 hover:text-gold hover:underline">
              See the work
            </Link>
          </div>
        </div>
      </section>

      {accent && (
        <section className="bg-sand/50">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-2 lg:gap-24">
            <div className="reveal">
              <Eyebrow>Philosophy</Eyebrow>
              <blockquote className="mt-8 font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl">
                &ldquo;The best photographs aren&apos;t posed — they&apos;re noticed.&rdquo;
              </blockquote>
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-stone">— {site.photographer}</p>
            </div>
            <div className="reveal relative aspect-[3/2] overflow-hidden bg-sand">
              <Image src={accent.src} alt={accent.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </section>
      )}

      <CtaBand photo={picks.about_cta ?? featured[2] ?? featured[0]} />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ivory p-6">
      <div className="text-xs uppercase tracking-[0.25em] text-gold">{label}</div>
      <div className="mt-2 font-display text-2xl text-ink">{value}</div>
    </div>
  );
}
