import Link from "next/link";
import { getSettings } from "@/db/queries";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-neutral-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
          <Link href="/" className="mr-auto text-sm font-semibold uppercase tracking-[0.2em]">
            {site.name}
          </Link>
          <Link href="/portfolio" className="text-sm hover:opacity-60">Portfolio</Link>
          <Link href="/about" className="text-sm hover:opacity-60">About</Link>
          <Link
            href="/contact"
            className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
          >
            Book a session
          </Link>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-neutral-500 sm:px-6">
          {s.instagram && (
            <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noreferrer" className="hover:text-black">
              Instagram
            </a>
          )}
          {s.whatsapp && (
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-black">
              WhatsApp
            </a>
          )}
          {s.contact_email && (
            <a href={`mailto:${s.contact_email}`} className="hover:text-black">{s.contact_email}</a>
          )}
          <span className="ml-auto">© {site.name}</span>
        </div>
      </footer>
    </div>
  );
}