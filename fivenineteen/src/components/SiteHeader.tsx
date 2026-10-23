"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// usePathname is runtime data on dynamic routes, so it must sit under Suspense;
// the fallback is the same header in its solid state.
export function SiteHeader({ name }: { name: string }) {
  return (
    <Suspense fallback={<Header name={name} pathname="" />}>
      <HeaderWithPath name={name} />
    </Suspense>
  );
}

function HeaderWithPath({ name }: { name: string }) {
  return <Header name={name} pathname={usePathname()} />;
}

function Header({ name, pathname }: { name: string; pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Transparent over the home hero until the visitor scrolls.
  const overHero = pathname === "/" && !scrolled && !open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        overHero
          ? "bg-transparent text-white"
          : "border-b border-ink/5 bg-ivory/85 text-ink backdrop-blur-md"
      }`}
    >
      <nav className={`mx-auto flex max-w-7xl items-center px-5 transition-[padding] duration-500 sm:px-8 ${overHero ? "py-6" : "py-4"}`}>
        <Link href="/" onClick={() => setOpen(false)} className="mr-auto" aria-label={`${name} home`}>
          <Logo byline={false} className={`w-auto transition-[height] duration-500 ${overHero ? "h-11" : "h-9"}`} />
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.filter((l) => l.href !== "/contact").map((l) => (
            <NavLink key={l.href} href={l.href} active={pathname.startsWith(l.href)}>
              {l.label}
            </NavLink>
          ))}
          <Link
            href="/contact"
            className={`rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] transition ${
              overHero
                ? "bg-white text-ink hover:bg-gold hover:text-white"
                : "bg-ink text-ivory hover:bg-gold"
            }`}
          >
            Book a session
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 -mr-2 grid size-10 place-items-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`absolute h-px w-6 bg-current transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-current transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </nav>
    </header>

      {/* Mobile menu — outside the header, whose backdrop-filter would contain a fixed child */}
      <div
        className={`fixed inset-0 z-30 flex flex-col justify-center bg-ivory px-8 transition-opacity duration-500 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="space-y-4">
          {links.map((l, i) => (
            <li key={l.href} className={open ? "animate-fade-up" : ""} style={{ animationDelay: `${i * 80}ms` }}>
              <Link href={l.href} onClick={() => setOpen(false)} className="font-display text-5xl font-light text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Logo className="mt-14 h-14 w-auto text-ink" />
      </div>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative text-xs font-medium uppercase tracking-[0.2em]">
      {children}
      <span
        className={`absolute -bottom-1.5 left-0 h-px bg-current transition-all duration-300 ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
}
