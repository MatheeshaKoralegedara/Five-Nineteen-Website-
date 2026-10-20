import Link from "next/link";
import { getSettings } from "@/db/queries";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/Logo";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/icons";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-ink">
      <SiteHeader name={site.name} />

      <main className="flex-1">{children}</main>

      <footer className="bg-ink text-ivory/70">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block text-ivory" aria-label={`${site.name} home`}>
              <Logo className="h-20 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed">{site.description}</p>
            <p className="mt-2 text-sm">{site.location}</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-gold-soft">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/portfolio" className="transition hover:text-ivory">Portfolio</Link></li>
              <li><Link href="/about" className="transition hover:text-ivory">About</Link></li>
              <li><Link href="/contact" className="transition hover:text-ivory">Book a session</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.3em] text-gold-soft">Connect</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {s.instagram && (
                <li>
                  <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 transition hover:text-ivory">
                    <InstagramIcon className="size-4" /> @{s.instagram}
                  </a>
                </li>
              )}
              {s.whatsapp && (
                <li>
                  <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 transition hover:text-ivory">
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                </li>
              )}
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="inline-flex items-center gap-2.5 break-all transition hover:text-ivory">
                    <MailIcon className="size-4 shrink-0" /> {s.contact_email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-5 py-6 text-xs tracking-wide text-ivory/40 sm:px-8">
            <span>© {site.name}. All images protected.</span>
            <span>Photography by {site.photographer}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
