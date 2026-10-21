import type { Metadata } from "next";
import Image from "next/image";
import { getFeatured, getSettings } from "@/db/queries";
import { formatPhone, phoneDigits, site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { ArrowIcon, FacebookIcon, InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
  const [s, featured] = await Promise.all([getSettings(), getFeatured()]);
  const photo = featured[1] ?? featured[0];

  const channels = [
    s.whatsapp && {
      href: `https://wa.me/${phoneDigits(s.whatsapp)}`,
      label: "WhatsApp",
      value: formatPhone(s.whatsapp),
      note: "Fastest reply",
      icon: <WhatsAppIcon className="size-6" />,
      external: true,
    },
    s.contact_email && {
      href: `mailto:${s.contact_email}`,
      label: "Email",
      value: s.contact_email,
      note: "For detailed enquiries",
      icon: <MailIcon className="size-6" />,
      external: false,
    },
    s.instagram && {
      href: `https://instagram.com/${s.instagram}`,
      label: "Instagram",
      value: `@${s.instagram}`,
      note: "Latest work & DMs",
      icon: <InstagramIcon className="size-6" />,
      external: true,
    },
    s.facebook_url && {
      href: s.facebook_url,
      label: "Facebook",
      value: s.facebook_name || site.facebookName,
      note: "Follow for updates",
      icon: <FacebookIcon className="size-6" />,
      external: true,
    },
  ].filter(Boolean) as {
    href: string; label: string; value: string; note: string; icon: React.ReactNode; external: boolean;
  }[];

  return (
    <>
      <PageHeader eyebrow="Contact" title={<>Let&apos;s talk about <em>your day</em>.</>}>
        Tell me about your date, location and what you have in mind. I usually reply within a day.
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-28 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          {/* Contact form goes here in Step 8 */}

          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {channels.map((c) => (
              <li key={c.label} className="reveal">
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="group flex items-center gap-6 py-8 transition hover:pl-3"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition group-hover:border-gold group-hover:bg-gold group-hover:text-white">
                    {c.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs uppercase tracking-[0.25em] text-gold">{c.label} · {c.note}</span>
                    <span className="mt-1 block truncate font-display text-2xl text-ink sm:text-3xl">{c.value}</span>
                  </span>
                  <ArrowIcon className="size-5 shrink-0 text-stone transition group-hover:translate-x-1 group-hover:text-gold" />
                </a>
              </li>
            ))}
          </ul>

          <div className="reveal mt-12 flex items-start gap-4 text-stone">
            <PinIcon className="mt-0.5 size-5 shrink-0 text-gold" />
            <p>
              Based in <span className="text-ink">{site.location}</span>. Available for travel across the island and beyond.
            </p>
          </div>
        </div>

        {photo && (
          <div className="reveal relative hidden aspect-[4/5] overflow-hidden bg-sand lg:block">
            <Image src={photo.src} alt={photo.alt} fill sizes="40vw" className="object-cover" />
          </div>
        )}
      </section>
    </>
  );
}
