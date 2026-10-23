import type { Metadata } from "next";
import Link from "next/link";
import { getFeatured, getPackages } from "@/db/queries";
import { PageHeader } from "@/components/PageHeader";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Packages" };

export default async function Packages() {
  const [list, featured] = await Promise.all([getPackages(), getFeatured()]);

  return (
    <>
      <PageHeader eyebrow="Packages" title={<>Choose your <em>story</em>.</>}>
        Every session is edited by hand and delivered in a private online gallery. Need something different?
        Get in touch and we&apos;ll put together a package that fits.
      </PageHeader>

      <section className="mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        {list.length === 0 ? (
          <p className="text-stone">Packages are coming soon. Get in touch for a quote.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <article
                key={p.id}
                className={`reveal relative flex flex-col p-8 sm:p-10 ${
                  p.highlighted ? "bg-ink text-ivory" : "border border-ink/10 bg-ivory text-ink"
                }`}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-8 rounded-full bg-gold px-4 py-1 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-white sm:left-10">
                    Most popular
                  </span>
                )}
                <h2 className="font-display text-3xl font-light">{p.name}</h2>
                {p.description && (
                  <p className={`mt-3 leading-relaxed ${p.highlighted ? "text-ivory/70" : "text-stone"}`}>{p.description}</p>
                )}
                {p.price && (
                  <p className={`mt-6 font-display text-4xl ${p.highlighted ? "text-gold-soft" : "text-gold"}`}>{p.price}</p>
                )}

                {p.features.length > 0 && (
                  <ul className={`mt-8 space-y-3 border-t pt-8 text-sm ${p.highlighted ? "border-ivory/15" : "border-ink/10"}`}>
                    {p.features.map((f, i) => (
                      <li key={i} className="flex gap-3">
                        <span className={`mt-2 h-px w-3 shrink-0 ${p.highlighted ? "bg-gold-soft" : "bg-gold"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-10">
                  <Link
                    href="/contact"
                    className={`group flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition hover:bg-gold hover:text-white ${
                      p.highlighted ? "bg-ivory text-ink" : "bg-ink text-ivory"
                    }`}
                  >
                    Book this package
                    <ArrowIcon className="size-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <CtaBand photo={featured[2] ?? featured[0]} />
    </>
  );
}
